// Tool data
const tools = [
    {
        name: "Image Converter",
        description: "Convert images between JPG, PNG, WEBP, and more formats with just a few clicks."
    },
    {
        name: "Image Compressor",
        description: "Reduce image file size without losing quality. Perfect for websites and social media."
    },
    {
        name: "Image Crop",
        description: "Crop and resize your images to the perfect dimensions for any platform."
    },
    {
        name: "Video Converter",
        description: "Convert videos between MP4, AVI, MOV, and other popular formats."
    },
    {
        name: "Age Calculator",
        description: "Calculate your exact age in years, months, days, and even seconds!"
    },
    {
        name: "EMI Calculator",
        description: "Calculate your Equated Monthly Installments for loans with detailed breakdown."
    },
    {
        name: "SIP Calculator",
        description: "Plan your Systematic Investment Plan and estimate potential returns."
    },
    {
        name: "Audio Trim",
        description: "Cut and trim your audio files online. Extract the perfect sound clip."
    },
    {
        name: "PDF Converter",
        description: "Convert PDFs to Word, Excel, JPG and vice versa while preserving formatting."
    }
];

// Generate tool cards
document.addEventListener('DOMContentLoaded', function() {
    const toolsGrid = document.querySelector('.tools-grid');
    
    tools.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.innerHTML = `
            <h2>${tool.name}</h2>
            <p>${tool.description}</p>
            <button class="tool-btn">Use Tool</button>
        `;
        toolsGrid.appendChild(toolCard);
    });

    // Add click event to all tool buttons
    document.querySelectorAll('.tool-btn').forEach(button => {
        button.addEventListener('click', function() {
            const toolName = this.parentElement.querySelector('h2').textContent;
            alert(`Redirecting to ${toolName}...`);
        });
    });

    // Search functionality
    document.querySelector('.search-bar button').addEventListener('click', function() {
        const searchTerm = document.querySelector('.search-bar input').value;
        if (searchTerm.trim() !== '') {
            alert(`Searching for: ${searchTerm}`);
        } else {
            alert('Please enter a search term');
        }
    });

    // Search on Enter key
    document.querySelector('.search-bar input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.querySelector('.search-bar button').click();
        }
    });
});