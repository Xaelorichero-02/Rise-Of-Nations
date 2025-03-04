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
    
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    const faqQuestions = document.querySelectorAll('.faq-question');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('faqSearch');
    const noResults = document.querySelector('.faq-no-results');
    const resetButton = document.getElementById('resetFaqSearch');
    
    // Toggle FAQ answers
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            
            // If the clicked item is already active, close it
            if (faqItem.classList.contains('active')) {
                faqItem.classList.remove('active');
            } else {
                // Close all other items and open the clicked one
                faqItems.forEach(item => {
                    if (item !== faqItem) {
                        item.classList.remove('active');
                    }
                });
                faqItem.classList.add('active');
                
                // Scroll the item into view if it's not fully visible
                const itemRect = faqItem.getBoundingClientRect();
                const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
                
                if (itemRect.bottom > viewHeight) {
                    faqItem.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
            }
        });
    });
    
    // Filter by category
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-category');
            
            // Show all items if "All" is selected
            if (filter === 'all') {
                faqItems.forEach(item => {
                    item.style.display = 'block';
                });
            } else {
                // Otherwise show only matching items
                faqItems.forEach(item => {
                    if (item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
            
            // Apply any existing search filter
            if (searchInput.value.trim() !== '') {
                applySearchFilter();
            }
            
            // Check if there are any visible items
            checkForResults();
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', applySearchFilter);
    
    function applySearchFilter() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            // If search is empty, show items based on category filter
            const activeFilter = document.querySelector('.category-btn.active').getAttribute('data-category');
            
            faqItems.forEach(item => {
                if (activeFilter === 'all' || item.getAttribute('data-category') === activeFilter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        } else {
            // Otherwise, filter by search within the active category
            const activeFilter = document.querySelector('.category-btn.active').getAttribute('data-category');
            
            faqItems.forEach(item => {
                const question = item.querySelector('h3').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                const matchesSearch = question.includes(searchTerm) || answer.includes(searchTerm);
                const matchesCategory = activeFilter === 'all' || item.getAttribute('data-category') === activeFilter;
                
                if (matchesSearch && matchesCategory) {
                    item.style.display = 'block';
                    
                    // Auto-expand matching items
                    item.classList.add('active');
                } else {
                    item.style.display = 'none';
                    
                    // Close non-matching items
                    item.classList.remove('active');
                }
            });
        }
        
        // Check if there are any visible items
        checkForResults();
    }
    
    // Check if there are any visible items
    function checkForResults() {
        const visibleItems = Array.from(faqItems).filter(item => item.style.display !== 'none');
        
        if (visibleItems.length === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
    
    // Reset search
    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        
        // Reset filter to 'All'
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-category="all"]').classList.add('active');
        
        // Show all items
        faqItems.forEach(item => {
            item.style.display = 'block';
            item.classList.remove('active');
        });
        
        // Hide no results message
        noResults.style.display = 'none';
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
    
    const animateElements = document.querySelectorAll('.faq-item, .section-header, .contact-support');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});