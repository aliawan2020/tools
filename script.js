document.addEventListener('DOMContentLoaded', function() {
    // Tool icons click functionality
    const toolIcons = document.querySelectorAll('.tool-icon');
    toolIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const toolName = this.getAttribute('data-tool');
            // Scroll to the corresponding tool card
            document.querySelector(`.tool-card a[href="${toolName}.html"]`).closest('.tool-card').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    searchBtn.addEventListener('click', function() {
        performSearch();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.trim() === '') return;
        
        const toolCards = document.querySelectorAll('.tool-card');
        let found = false;
        
        toolCards.forEach(card => {
            const title = card.querySelector('h2').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm)) {
                card.style.display = 'block';
                found = true;
            } else if (desc.includes(searchTerm)) {
                card.style.display = 'block';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        if (!found) {
            alert('No tools found matching your search. Try different keywords.');
            toolCards.forEach(card => {
                card.style.display = 'block';
            });
        }
    }
    
    // Contact dropdown mobile behavior
    const contactDropdown = document.querySelector('.contact-dropdown');
    if (window.innerWidth < 768) {
        contactDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.querySelector('.dropdown-content');
            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
            } else {
                dropdown.style.display = 'block';
            }
        });
    }
});