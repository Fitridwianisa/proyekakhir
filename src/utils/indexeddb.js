import { openDB } from 'idb';

const DB_NAME = 'cerita-db';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
  },
});

export const StoryDB = {
  async add(story) {
    return (await dbPromise).add(STORE_NAME, story);
  },
  async getAll() {
    return (await dbPromise).getAll(STORE_NAME);
  },
  async delete(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  }
};
