import { fileURLToPath } from 'url';
// Import the required modules from lowdb and Node.js file system
import { JSONFilePreset } from 'lowdb/node';
import fs from 'fs';
import path from 'path';

// Define the directory where blog posts will be stored
const blogDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'blog');

// Ensure the blog directory exists
if (!fs.existsSync(blogDirectory)) {
    fs.mkdirSync(blogDirectory, { recursive: true });
}

function generateFilename(post) {
    // Safeguard for undefined post.publishedDate
    if (!post.publishedDate) {
        throw new Error('post.publishedDate is undefined');
    }

    const date = new Date(post.publishedDate);

    // Check if 'date' is an invalid date
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid publishedDate value: ${post.publishedDate}`);
    }

    const dateString = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const timeString = date.toISOString().split('T')[1].slice(0, 5).replace(':', ''); // "HHMM"
    const simplifiedTitle = post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    return `${dateString}_${timeString}_${post.id}_${simplifiedTitle}.json`;
}

// Function to initialize and access the database for a specific post
async function getDbForPost(post) {
    const filename = generateFilename(post);
    const filePath = path.join(blogDirectory, filename);

    // Use JSONFilePreset for creating or accessing a JSON file with default data
    const db = await JSONFilePreset(filePath, {
        id: post.id,
        title: post.title,
        content: post.content,
        publishedDate: post.publishedDate,
        comments: [],
        tags: [],
        images: []
    });

    // With JSONFilePreset, the explicit db.read() call is not required as it handles initialization

    return db;
}

// Export the getDbForPost function to be used in your application
export { getDbForPost };

