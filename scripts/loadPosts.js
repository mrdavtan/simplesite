async function loadAndDisplayPosts() {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();

        const blogContainer = document.querySelector('.blog-container');
        blogContainer.innerHTML = ''; // Clear existing posts

        posts.forEach(post => {
            const postBox = document.createElement('div');
            postBox.className = 'box';

            const image = document.createElement('img');
            // Assuming each post includes an imagePath; adjust as necessary
            image.src = post.imagePath || 'path/to/default/image'; // Fallback to a default image if none is specified
            image.alt = post.title; // Using the post title as alt text; adjust as needed

            const content = document.createElement('p');
            content.textContent = post.content;

            postBox.appendChild(image);
            postBox.appendChild(content);

            blogContainer.appendChild(postBox);
        });
    } catch (error) {
        console.error('Failed to load posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadAndDisplayPosts);

