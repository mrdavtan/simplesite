import { JSONFilePreset } from 'lowdb/node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const blogDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'blog');
console.log(`Blog directory path: ${blogDirectory}`); // Log the path of the blog directory

// Ensure the blog directory exists
if (!fs.existsSync(blogDirectory)) {
    console.log('Blog directory does not exist, creating it...');
    fs.mkdirSync(blogDirectory, { recursive: true });
} else {
    console.log('Blog directory already exists.');
}

function generateFilename(post) {
    console.log(`Generating filename for post titled: ${post.title}`); // Log the title of the post being processed

    if (!post.publishedDate) {
        console.error('post.publishedDate is undefined');
        throw new Error('post.publishedDate is undefined');
    }

    const date = new Date(post.publishedDate);
    if (isNaN(date.getTime())) {
        console.error(`Invalid publishedDate value: ${post.publishedDate}`);
        throw new Error(`Invalid publishedDate value: ${post.publishedDate}`);
    }

    // Sanitize the title to be filesystem-friendly, replacing spaces with underscores
    const sanitizedTitle = post.title.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '');
    // Format the date as YYYYMMDD
    const datePart = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    // Optionally include time part formatted as HHMMSS, if needed
    const timePart = `${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;

    // Construct filename with the title first, followed by the date and time
    const filename = `${sanitizedTitle}_${datePart}${timePart}.json`;
    console.log(`Generated filename: ${filename}`); // Log the generated filename

    return filename;
}


async function getDbForPost(post) {
    const filename = generateFilename(post);
    const filePath = path.join(blogDirectory, filename);
    console.log(`File path for DB: ${filePath}`); // Log the full file path for the DB

    // Initialize or access the JSON file database for a specific post
    const db = await JSONFilePreset(filePath, {
        id: post.id,
        title: post.title,
        content: post.content,
        publishedDate: post.publishedDate,
        description: post.description,
        imageDescription: post.imageDescription,
        imagePath: post.imagePath,
        images: [],
        comments: [],
        tags: []
    });

    console.log(`Database initialized for: ${filePath}`); // Confirm DB initialization
    return db;
}

export { getDbForPost };

