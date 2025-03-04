document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const diaryCards = document.querySelectorAll('.diary-card');
    const searchInput = document.getElementById('diarySearch');
    const noResults = document.querySelector('.no-results');
    const resetButton = document.getElementById('resetSearch');
    
    // Filter by category
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Show all cards if "All" is selected
            if (filter === 'all') {
                diaryCards.forEach(card => {
                    card.style.display = 'flex';
                });
            } else {
                // Otherwise show only matching cards
                diaryCards.forEach(card => {
                    if (card.getAttribute('data-category') === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
            
            // Apply any existing search filter
            if (searchInput.value.trim() !== '') {
                applySearchFilter();
            }
            
            // Check if there are any visible cards
            checkForResults();
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', applySearchFilter);
    
    function applySearchFilter() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            // If search is empty, show cards based on category filter
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            
            diaryCards.forEach(card => {
                if (activeFilter === 'all' || card.getAttribute('data-category') === activeFilter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        } else {
            // Otherwise, filter by search within the active category
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            
            diaryCards.forEach(card => {
                const cardTitle = card.querySelector('h3').textContent.toLowerCase();
                const cardExcerpt = card.querySelector('.diary-excerpt').textContent.toLowerCase();
                const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
                
                const matchesSearch = cardTitle.includes(searchTerm) || 
                                      cardExcerpt.includes(searchTerm) ||
                                      tags.some(tag => tag.includes(searchTerm));
                
                const matchesCategory = activeFilter === 'all' || card.getAttribute('data-category') === activeFilter;
                
                if (matchesSearch && matchesCategory) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        // Check if there are any visible cards
        checkForResults();
    }
    
    // Check if there are any visible cards
    function checkForResults() {
        const visibleCards = Array.from(diaryCards).filter(card => card.style.display !== 'none');
        
        if (visibleCards.length === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
    
    // Reset search
    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        
        // Reset filter to 'All'
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');
        
        // Show all cards
        diaryCards.forEach(card => {
            card.style.display = 'flex';
        });
        
        // Hide no results message
        noResults.style.display = 'none';
    });
    
    // Pagination (demo functionality)
    const pageButtons = document.querySelectorAll('.page-btn');
    
    pageButtons.forEach(button => {
        button.addEventListener('click', () => {
            pageButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // In a real application, this would load different sets of dev diaries
            // For this demo, we'll just scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
    
    // Animation for page elements
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.diary-card, .section-header');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

