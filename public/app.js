document.getElementById('postForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent the default form submission

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    console.log('Sending post to server:', { title, content }); // Log data being sent

    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
        console.log('Post added successfully');
    } else {
        console.error('Failed to add post');
    }
});

