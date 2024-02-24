document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded and script execution started');

    // Form submission functionality
    document.getElementById('postForm').addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent the default form submission
        console.log('Form submitted');

        // Capturing all form inputs
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const publishedDate = document.getElementById('publishedDate').value;
        const description = document.getElementById('description').value;
        const keywords = document.getElementById('keywords').value.split(',').map(keyword => keyword.trim());
        const imageDescription = document.getElementById('imageDescription').value;

        // Preparing the post object with all captured values
        const post = {
            title: title,
            content: content,
            publishedDate: publishedDate,
            description: description,
            keywords: keywords,
            imageDescription: imageDescription
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
                alert('Post added successfully'); // Simple user feedback
                document.getElementById('postForm').reset(); // Clear the form
            } else {
                const responseText = await response.text();
                console.error('Failed to add post. Server responded with:', responseText);
                alert(`Failed to add post: ${responseText}`); // Simple error feedback
            }




        } catch (error) {
            console.error('Error submitting post:', error);
        }
    });
});

