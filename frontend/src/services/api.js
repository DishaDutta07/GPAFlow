/**
 * API Service for GPAFlow with Authentication, LocalStorage Fallback & Offline Resilience
 */

const API_BASE = '/api';

export const ApiService = {
  // Token Management
  getToken() {
    return localStorage.getItem('gpaflow_auth_token') || null;
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('gpaflow_auth_token', token);
    } else {
      localStorage.removeItem('gpaflow_auth_token');
    }
  },

  getCurrentUser() {
    try {
      const u = localStorage.getItem('gpaflow_auth_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem('gpaflow_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gpaflow_auth_user');
    }
  },

  getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Auth: Sign Up
  async signup(username, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account.');
      }
      if (data.token) {
        this.setToken(data.token);
        this.setCurrentUser(data.user);
      }
      return data;
    } catch (err) {
      throw err;
    }
  },

  // Auth: Login
  async login(username, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid username or password.');
      }
      if (data.token) {
        this.setToken(data.token);
        this.setCurrentUser(data.user);
      }
      return data;
    } catch (err) {
      throw err;
    }
  },

  // Auth: Get Current Profile
  async getMe() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: this.getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          this.setCurrentUser(data.user);
          return data.user;
        }
      }
      // Token invalid or expired
      this.logout();
      return null;
    } catch {
      return this.getCurrentUser();
    }
  },

  // Auth: Logout
  logout() {
    this.setToken(null);
    this.setCurrentUser(null);
  },

  // Check backend health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Get grading scales
  async getScales() {
    try {
      const res = await fetch(`${API_BASE}/scales`);
      if (!res.ok) throw new Error('Failed to fetch scales');
      const data = await res.json();
      return data.scales;
    } catch (err) {
      console.warn('Using default offline scales:', err);
      return null;
    }
  },

  // Calculate GPA on backend
  async calculate(payload) {
    try {
      const res = await fetch(`${API_BASE}/calculate`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Calculation API error');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('Backend calculate unavailable, using local calculation:', err);
      return null;
    }
  },

  // Get semester history (User-Isolated)
  async getHistory() {
    const user = this.getCurrentUser();
    const storageKey = user ? `gpaflow_history_${user.id}` : 'gpaflow_history_guest';

    try {
      const res = await fetch(`${API_BASE}/history`, {
        headers: this.getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          localStorage.setItem(storageKey, JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Backend history unavailable, loading from user storage:', err);
    }
    
    // LocalStorage fallback for current user
    const local = localStorage.getItem(storageKey);
    return local ? JSON.parse(local) : [];
  },

  // Save semester (User-Isolated)
  async saveSemester(record) {
    const user = this.getCurrentUser();
    const storageKey = user ? `gpaflow_history_${user.id}` : 'gpaflow_history_guest';
    const localList = this.getLocalHistory(storageKey);

    const newRecord = {
      ...record,
      id: record.id || `sem_${Date.now()}`,
      userId: user ? user.id : 'guest',
      created_at: record.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const existingIdx = localList.findIndex(item => item.id === newRecord.id);
    if (existingIdx >= 0) {
      localList[existingIdx] = newRecord;
    } else {
      localList.unshift(newRecord);
    }
    localStorage.setItem(storageKey, JSON.stringify(localList));

    // Try saving to backend with user token
    try {
      const res = await fetch(`${API_BASE}/save`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(newRecord)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Backend save failed, saved to local cache:', err);
    }

    return newRecord;
  },

  // Delete semester from history (User-Isolated)
  async deleteHistory(id) {
    const user = this.getCurrentUser();
    const storageKey = user ? `gpaflow_history_${user.id}` : 'gpaflow_history_guest';
    const localList = this.getLocalHistory(storageKey).filter(item => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(localList));

    try {
      await fetch(`${API_BASE}/history/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
    } catch (err) {
      console.warn('Backend delete request failed:', err);
    }
    return true;
  },

  getLocalHistory(storageKey = 'gpaflow_history_guest') {
    try {
      const item = localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  },

  // Server PDF Export
  async exportServerPdf(payload) {
    try {
      const res = await fetch(`${API_BASE}/export-pdf`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Server PDF export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GPAFlow_${(payload.semesterName || 'Transcript').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      return true;
    } catch (err) {
      console.warn('Server PDF export failed, falling back to client-side PDF:', err);
      return false;
    }
  }
};
