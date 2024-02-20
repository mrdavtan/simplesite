document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    console.log('Theme toggle button loaded', themeToggleBtn); // Debugging log

    const themes = ['light-theme', 'medium-theme', 'dark-theme'];
    let currentThemeIndex = localStorage.getItem('themeIndex') ? parseInt(localStorage.getItem('themeIndex'), 10) : 0;
    document.body.className = themes[currentThemeIndex]; // Apply the current theme

    themeToggleBtn.addEventListener('click', () => {
        console.log('Theme toggle clicked');
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        document.body.className = themes[currentThemeIndex];
        localStorage.setItem('themeIndex', currentThemeIndex.toString());
    });
});

