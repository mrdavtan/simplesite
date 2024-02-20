document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const currentTheme = document.body.dataset.theme;
        switch (currentTheme) {
            case 'light-theme':
                document.body.dataset.theme = 'medium-theme';
                document.body.className = 'medium-theme';
                break;
            case 'medium-theme':
                document.body.dataset.theme = 'dark-theme';
                document.body.className = 'dark-theme';
                break;
            case 'dark-theme':
            default:
                document.body.dataset.theme = 'light-theme';
                document.body.className = 'light-theme';
        }
        // Optionally, save the current theme to localStorage and load it on page refresh
        localStorage.setItem('theme', document.body.className);
    });

    // Check for saved theme in localStorage and apply it
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.className = savedTheme;
        document.body.dataset.theme = savedTheme;
    }

    // Form submission functionality
    document.getElementById('postForm').addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent the default form submission

        // Capturing all form inputs
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const publishedDate = document.getElementById('publishedDate').value;
        const seoTitle = document.getElementById('seoTitle').value;
        const seoDescription = document.getElementById('seoDescription').value;
        // Assuming keywords are entered as comma-separated, and trimming each keyword to remove extra spaces
        const seoKeywords = document.getElementById('seoKeywords').value.split(',').map(keyword => keyword.trim());

        // Preparing the post object with all captured values
        const post = {
            title,
            content,
            publishedDate,
            seoTitle,
            seoDescription,
            seoKeywords
        };

        console.log('Sending post to server:', post);

        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(post),
            });

            if (response.ok) {
                console.log('Post added successfully');
                document.getElementById('postForm').reset(); // Clear the form
            } else {
                console.error('Failed to add post. Server responded with:', await response.text());
            }
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    });
});

