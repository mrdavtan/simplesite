document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const postData = {
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        seoTitle: document.getElementById('seoTitle').value,
        seoDescription: document.getElementById('seoDescription').value,
        seoKeywords: document.getElementById('seoKeywords').value,
    };

    fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
});

