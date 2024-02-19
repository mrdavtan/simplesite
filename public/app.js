document.getElementById('postForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Capturing all form inputs
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const publishedDate = document.getElementById('publishedDate').value; // Capture the publishedDate
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

    console.log('Sending post to server:', post); // Log the full post data being sent

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(post),
        });

        if (response.ok) {
            console.log('Post added successfully');
            // Optionally, you could clear the form fields here or redirect the user to a confirmation page
            document.getElementById('postForm').reset(); // Clear the form
        } else {
            console.error('Failed to add post. Server responded with:', await response.text());
            // Implement user-friendly feedback in the UI as needed
        }
    } catch (error) {
        console.error('Error submitting post:', error);
        // Implement user-friendly error handling in the UI
    }
});

