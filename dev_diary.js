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
    
    // Add loading transitions for diary content
    const diaryContent = document.querySelector('.diary-content');
    if (diaryContent) {
        diaryContent.style.opacity = '0';
        
        setTimeout(() => {
            diaryContent.style.opacity = '1';
        }, 200);
    }
    
    // Image click to enlarge
    const contentImages = document.querySelectorAll('.diary-content img');
    contentImages.forEach(img => {
        img.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '2000';
            modal.style.cursor = 'zoom-out';
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';
            
            const modalImg = document.createElement('img');
            modalImg.src = img.src;
            modalImg.style.maxWidth = '90%';
            modalImg.style.maxHeight = '90%';
            modalImg.style.objectFit = 'contain';
            modalImg.style.border = '2px solid white';
            modalImg.style.borderRadius = '4px';
            modalImg.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
            
            modal.appendChild(modalImg);
            document.body.appendChild(modal);
            
            // Trigger reflow
            modal.offsetWidth;
            
            // Fade in
            modal.style.opacity = '1';
            
            modal.addEventListener('click', () => {
                modal.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            });
        });
    });
    
    // Filter functionality for dev diaries archive
    const filterButtons = document.querySelectorAll('.filter-btn');
    const diaryCards = document.querySelectorAll('.diary-card');
    const searchInput = document.getElementById('diarySearch');
    const noResults = document.querySelector('.no-results');
    const resetButton = document.getElementById('resetSearch');
    
    if (filterButtons.length > 0) {
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
                if (searchInput && searchInput.value.trim() !== '') {
                    applySearchFilter();
                }
                
                // Check if there are any visible cards
                checkForResults();
            });
        });
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', applySearchFilter);
    }
    
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
        if (!noResults) return;
        
        const visibleCards = Array.from(diaryCards).filter(card => card.style.display !== 'none');
        
        if (visibleCards.length === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
    
    // Reset search
    if (resetButton) {
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
    }
    
    // Pagination
    const pageButtons = document.querySelectorAll('.page-btn');
    
    if (pageButtons.length > 0) {
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
    }
    
    // Handle diary navigation and display
    const diaryLinks = document.querySelectorAll('.diary-link');
    const backLinks = document.querySelectorAll('.back-btn, .nav-button.all');
    const prevNextLinks = document.querySelectorAll('.nav-button.prev, .nav-button.next');
    const diaryArchive = document.getElementById('diary-archive');
    const singleDiaries = document.querySelectorAll('.diary-single');
    
    // Function to show a specific diary
    function showDiary(diaryId) {
        // Hide archive and all diaries
        diaryArchive.style.display = 'none';
        singleDiaries.forEach(diary => {
            diary.style.display = 'none';
        });
        
        // Show the selected diary
        const targetDiary = document.getElementById(diaryId);
        if (targetDiary) {
            targetDiary.style.display = 'block';
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // If diary doesn't exist, show archive
            diaryArchive.style.display = 'block';
        }
        
        // Update URL hash
        window.location.hash = diaryId;
    }
    
    // Function to show the archive
    function showArchive() {
        singleDiaries.forEach(diary => {
            diary.style.display = 'none';
        });
        diaryArchive.style.display = 'block';
        window.location.hash = 'diary-archive';
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Handle diary link clicks
    diaryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const diaryId = this.getAttribute('href').substring(1);
            showDiary(diaryId);
        });
    });
    
    // Handle back to archive clicks
    backLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showArchive();
        });
    });
    
    // Handle prev/next navigation
    prevNextLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showDiary(targetId);
        });
    });
    
    // Check URL hash on page load
    window.addEventListener('load', function() {
        const hash = window.location.hash;
        if (hash && hash !== '#diary-archive') {
            showDiary(hash.substring(1));
        } else {
            showArchive();
        }
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
    
    const animateElements = document.querySelectorAll('.diary-card, .section-header, .diary-header');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
    
    // Set up image fallbacks
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            // For diary images
            if (this.parentElement.classList.contains('diary-image')) {
                this.src = '1.png';
            }
        });
    });
});