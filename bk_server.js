import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import basicAuth from 'express-basic-auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Basic Authentication for the /admin route
const adminAuth = basicAuth({
   users: { 'admin': 'strong_password_here' }, // Replace 'strong_password_here' with a secure password
   challenge: true,
   realm: 'Admin',
   unauthorizedResponse: (req, res) => {
       console.log('Unauthorized access attempt to /admin');
       res.status(401).send('Unauthorized');
   }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files from 'public'
app.use(express.static('public'));

// Password-protected route for blog administration
app.get('/admin', adminAuth, async (req, res) => {
   console.log('Access granted to /admin');
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Newly added /main route to display home page content
app.get('/main', async (req, res) => {
   console.log("User is visiting the main page.");
   const indexHtmlPath = path.join(__dirname, 'public', 'index.html');
   try {
       res.sendFile(indexHtmlPath);
   } catch (err) {
       console.error('Unable to send main page.', err);
       res.status(500).send('An error occurred while trying to load the main page.');
   }
});

// Route to display blog posts on /home
app.get('/home', async (req, res) => {
  console.log('Fetching blog posts for /home');
  try {
      const blogDirectory = path.join(__dirname, 'blog');
      const postFiles = fs.readdirSync(blogDirectory);
      console.log(`Found ${postFiles.length} post files in the blog directory.`);

      let allPosts = [];

      for (let i = 0; i < postFiles.length; i++) {
          if (!['README.md', '.DS_Store'].includes(postFiles[i])) {
              const filePath = path.join(blogDirectory, postFiles[i]);
              const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
              let parsedData;
              try {
                 parsedData = JSON.parse(fileContent);
                 allPosts.push(parsedData);
              } catch (err) {
                 console.error(`Error parsing data for "${postFiles[i]}":`, err);
                 continue;
              }
          }
      }

      console.log(`Successfully loaded ${allPosts.length} valid posts.`);
      if (allPosts && allPosts.length > 0) {
          res.render('home', { posts: allPosts });
      } else {
          console.warn('No valid posts found in the blog directory.');
          res.status(200).send('<p>There seem to be no blog posts available at this time.</p>');
      }
  } catch (error) {
      console.error('Error fetching posts for /home:', error);
      res.status(500).send('Error loading posts');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));;
