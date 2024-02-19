// Import statements for lowdb and its JSON adapter
import { Low, JSONFile } from 'lowdb';

// Create a file async adapter for lowdb; the path might need to be adjusted based on your project structure
const adapter = new JSONFile('./db.json');
const db = new Low(adapter);

// An async function to initialize the database
async function initializeDb() {
    // Read data from JSON file, this will set db.data content
    await db.read();

    // If db.json doesn't exist or it's empty, default values are set
    db.data ||= { posts: [], users: [], comments: [], tags: [], images: [] };

    // Optional: Write default data back to the file if it was empty
    await db.write();
}

// Immediately invoke the async function to ensure the DB is initialized
initializeDb().catch(err => console.error('Failed to initialize DB:', err));

// Export db for use in other parts of the application
export { db };

