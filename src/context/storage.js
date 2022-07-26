const storage = {
  async getItem(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error(e);
    }
  },
  async setItem(key, data) {
    try {
      const state = JSON.parse(localStorage.getItem(key));
      if (state) {
        localStorage.setItem(key, JSON.stringify({ ...state, ...data }));
      } else {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (e) {
      console.error(e);
    }
  },
  async removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  },
};

export default storage;
