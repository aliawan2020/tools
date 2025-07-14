// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Tool button click handler
document.querySelectorAll('.tool-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const toolName = this.closest('.tool-card').querySelector('h3').textContent;
        alert(`Redirecting to ${toolName} tool...`);
        
        // In a real implementation, you would navigate to the tool page
        // window.location.href = this.closest('a').getAttribute('href');
    });
});

// Search functionality
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', () => {
    if (searchInput.value.trim()) {
        alert(`Searching for: ${searchInput.value}`);
        // Actual search implementation would go here
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
        alert(`Searching for: ${searchInput.value}`);
        // Actual search implementation would go here
    }
});

// Mobile menu toggle (can be added if needed)
document.addEventListener('DOMContentLoaded', function() {
    console.log('FIXDO website loaded successfully!');
    
    // Mobile menu implementation example:
    /*
    const menuToggle = document.createElement('button');
    menuToggle.classList.add('mobile-menu-toggle');
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.main-header').prepend(menuToggle);
    
    const nav = document.querySelector('.main-nav');
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('show');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('show');
        });
    });
    */
});