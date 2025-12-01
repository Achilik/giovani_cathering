document.addEventListener('DOMContentLoaded', () => {
    // Select the navigation toggle button and the navigation links container
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    // Add a click event listener to the toggle button
    navToggle.addEventListener('click', () => {
        // Toggle the 'active' class on the main navigation container
        // This class is defined in the CSS to show/hide the menu on mobile
        mainNav.classList.toggle('active');
        
        // Optional: Change the button icon (e.g., from hamburger to X)
        if (mainNav.classList.contains('active')) {
            navToggle.innerHTML = '&#10005;'; // X mark
            navToggle.setAttribute('aria-expanded', 'true');
        } else {
            navToggle.innerHTML = '&#9776;'; // Hamburger icon
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Optional: Close the menu when a link is clicked (for single-page sites)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                navToggle.innerHTML = '&#9776;'; // Reset icon
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
});