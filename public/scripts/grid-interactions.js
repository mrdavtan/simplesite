document.addEventListener('DOMContentLoaded', () => {
    const blogContainer = document.querySelector('.blog-container');
    const panzoomInstance = panzoom(blogContainer, {
        // Initial panzoom options
    });

    blogContainer.addEventListener('mousedown', (e) => {
        // Prevent the context menu from showing on right click
        if (e.button === 2) { // Right mouse button
            e.preventDefault();
        }
    });

    blogContainer.addEventListener('mouseup', (e) => {
        if (e.button === 0) { // Left mouse button for zoom in
            panzoomInstance.zoomIn();
        } else if (e.button === 2) { // Right mouse button for zoom out
            panzoomInstance.zoomOut();
        }
    });

    // Optional: Disable context menu on right click to use right mouse button for zoom out
    blogContainer.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
});

