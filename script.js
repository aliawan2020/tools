// Simple JavaScript for interactions
document.addEventListener('DOMContentLoaded', function() {
    // Tool icon click handler
    const toolIcons = document.querySelectorAll('.tool-icon');
    toolIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const tool = this.getAttribute('data-tool');
            alert(`You clicked on the ${tool.replace('-', ' ')} tool. Redirecting to tool page...`);
            // In a real implementation, you would redirect to the tool page
            // window.location.href = `${tool}.html`;
        });
    });
    
    // Tool card button click handler
    const toolButtons = document.querySelectorAll('.card-btn');
    toolButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const toolName = this.parentElement.querySelector('h3').textContent;
            alert(`Launching ${toolName}...`);
            // In a real implementation, you would redirect to the tool page
            // window.location.href = this.getAttribute('href');
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-container button');
    
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            alert(`Searching for: ${searchTerm}`);
            // In a real implementation, you would filter tools or redirect to search results
        }
    });
    
    // Allow search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
});