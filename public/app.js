document.getElementById('postForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent the default form submission

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
        console.log('Post added successfully');
        // Optionally reset the form or give user feedback
    } else {
        console.error('Failed to add post');
        // Handle errors or notify the user
    }
});

