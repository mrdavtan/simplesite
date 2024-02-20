document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    // Define an array of themes in the order they should be toggled
    const themes = ['light-theme', 'medium-theme', 'dark-theme'];
    // Get the current theme index from localStorage, default to 0 if not found
    let currentThemeIndex = localStorage.getItem('themeIndex') ? parseInt(localStorage.getItem('themeIndex'), 10) : 0;
    document.body.className = themes[currentThemeIndex]; // Apply the current theme

    themeToggleBtn.addEventListener('click', () => {
        // Increment the theme index to toggle to the next theme
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        document.body.className = themes[currentThemeIndex]; // Apply the next theme
        // Save the new theme index to localStorage for persistence
        localStorage.setItem('themeIndex', currentThemeIndex.toString());
    });
});

