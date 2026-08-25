const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'history.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  } catch (e) {}
}

class Store {
  static readData() {
    let retries = 5;
    while (retries > 0) {
      try {
        if (!fs.existsSync(DATA_FILE)) return [];
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(content || '[]');
      } catch (err) {
        retries--;
        if (retries === 0) {
          console.error('Error reading history file:', err.message);
          return [];
        }
        const waitTill = new Date(new Date().getTime() + 50);
        while (waitTill > new Date()) {}
      }
    }
    return [];
  }

  static writeData(data) {
    let retries = 5;
    while (retries > 0) {
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return true;
      } catch (err) {
        retries--;
        if (retries === 0) {
          console.error('Error writing history file:', err.message);
          return false;
        }
        const waitTill = new Date(new Date().getTime() + 50);
        while (waitTill > new Date()) {}
      }
    }
    return false;
  }

  static getAll(userId = null) {
    const list = this.readData();
    const userList = userId ? list.filter(item => item.userId === userId) : list.filter(item => !item.userId || item.userId === 'guest');
    return userList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static getById(id, userId = null) {
    const list = this.readData();
    return list.find(item => item.id === id && (!userId || item.userId === userId)) || null;
  }

  static save(record, userId = 'guest') {
    const list = this.readData();
    const newRecord = {
      id: record.id || `sem_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: userId || record.userId || 'guest',
      semesterName: record.semesterName || 'Semester',
      scaleId: record.scaleId || 'us_4_0',
      courses: record.courses || [],
      semesterGpa: record.semesterGpa !== undefined ? record.semesterGpa : 0,
      totalCredits: record.totalCredits !== undefined ? record.totalCredits : 0,
      totalPoints: record.totalPoints !== undefined ? record.totalPoints : 0,
      academicStanding: record.academicStanding || 'Good Standing',
      cumulative: record.cumulative || null,
      created_at: record.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const existingIndex = list.findIndex(item => item.id === newRecord.id && item.userId === newRecord.userId);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...newRecord };
    } else {
      list.unshift(newRecord);
    }

    this.writeData(list);
    return newRecord;
  }

  static delete(id, userId = null) {
    const list = this.readData();
    const filtered = list.filter(item => {
      if (item.id === id) {
        return userId ? item.userId !== userId : false;
      }
      return true;
    });

    if (filtered.length !== list.length) {
      this.writeData(filtered);
      return true;
    }
    return false;
  }

  static clear(userId = null) {
    if (!userId) {
      this.writeData([]);
      return true;
    }
    const list = this.readData().filter(item => item.userId !== userId);
    this.writeData(list);
    return true;
  }
}

module.exports = Store;
