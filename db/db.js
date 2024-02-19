// Import the JSONFilePreset from lowdb
import { JSONFilePreset } from 'lowdb/node';

// Define your default data schema
const defaultData = {
  posts: [],
  users: [],
  comments: [],
  tags: [],
  images: []
};

// Initialize your database with the default data
const db = await JSONFilePreset('db.json', defaultData);

export default db;

