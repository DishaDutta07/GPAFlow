const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  } catch (e) {
    // Ignore
  }
}

class UserStore {
  static readUsers() {
    let retries = 5;
    while (retries > 0) {
      try {
        if (!fs.existsSync(USERS_FILE)) return [];
        const content = fs.readFileSync(USERS_FILE, 'utf-8');
        return JSON.parse(content || '[]');
      } catch (err) {
        retries--;
        if (retries === 0) {
          console.error('Error reading users file:', err.message);
          return [];
        }
        // Brief synchronous busy-wait for OneDrive lock release
        const waitTill = new Date(new Date().getTime() + 50);
        while (waitTill > new Date()) {}
      }
    }
    return [];
  }

  static writeUsers(users) {
    let retries = 5;
    while (retries > 0) {
      try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
        return true;
      } catch (err) {
        retries--;
        if (retries === 0) {
          console.error('Error writing users file:', err.message);
          return false;
        }
        const waitTill = new Date(new Date().getTime() + 50);
        while (waitTill > new Date()) {}
      }
    }
    return false;
  }

  static findByUsername(username) {
    if (!username) return null;
    const users = this.readUsers();
    const cleanName = username.trim().toLowerCase();
    return users.find(u => u.username.toLowerCase() === cleanName) || null;
  }

  static findById(id) {
    if (!id) return null;
    const users = this.readUsers();
    return users.find(u => u.id === id) || null;
  }

  static async createUser(username, password) {
    const cleanUsername = (username || '').trim();
    if (!cleanUsername || cleanUsername.length < 3) {
      throw new Error('Username must be at least 3 characters long.');
    }
    if (cleanUsername.length > 30) {
      throw new Error('Username cannot exceed 30 characters.');
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
      throw new Error('Username can only contain letters, numbers, underscores, and hyphens.');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const existing = this.findByUsername(cleanUsername);
    if (existing) {
      throw new Error('Username already exists. Please choose another username.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      username: cleanUsername,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    const users = this.readUsers();
    users.push(newUser);
    this.writeUsers(users);

    return {
      id: newUser.id,
      username: newUser.username,
      createdAt: newUser.createdAt
    };
  }

  static async verifyPassword(plainPassword, passwordHash) {
    if (!plainPassword || !passwordHash) return false;
    return bcrypt.compare(plainPassword, passwordHash);
  }
}

module.exports = UserStore;
