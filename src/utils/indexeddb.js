import { openDB } from 'idb';

const DB_NAME = 'cerita-db';
const DB_VERSION = 1;
const STORY_STORE = 'stories';
const PENDING_STORE = 'pendingStories';

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORY_STORE)) {
      db.createObjectStore(STORY_STORE, { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains(PENDING_STORE)) {
      db.createObjectStore(PENDING_STORE, { keyPath: 'localId', autoIncrement: true });
    }
  },
});

export const StoryDB = {
  async add(story) {
    return (await dbPromise).add(STORY_STORE, story);
  },
  async getAll() {
    return (await dbPromise).getAll(STORY_STORE);
  },
  async delete(id) {
    return (await dbPromise).delete(STORY_STORE, id);
  }
};

export const PendingDB = {
  async add(story) {
    return (await dbPromise).add(PENDING_STORE, story);
  },
  async getAll() {
    return (await dbPromise).getAll(PENDING_STORE);
  },
  async delete(localId) {
    return (await dbPromise).delete(PENDING_STORE, localId);
  }
};