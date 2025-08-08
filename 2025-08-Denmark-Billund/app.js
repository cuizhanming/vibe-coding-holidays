// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Toggle hamburger icon
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize interactive features
    initializeItinerary();
    initializeChecklist();
    initializeScrollEffects();
});

// Day Itinerary Toggle Functionality
function toggleDay(dayNumber) {
    const dayContent = document.getElementById(`day-${dayNumber}`);
    const expandBtn = document.querySelector(`[data-day="${dayNumber}"] .expand-btn`);
    
    if (dayContent && expandBtn) {
        const isActive = dayContent.classList.contains('active');
        
        if (isActive) {
            dayContent.classList.remove('active');
            expandBtn.classList.remove('active');
        } else {
            dayContent.classList.add('active');
            expandBtn.classList.add('active');
        }
    }
}

// Initialize Itinerary Functionality
function initializeItinerary() {
    const dayHeaders = document.querySelectorAll('.day-header');
    
    dayHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const dayCard = this.parentElement;
            const dayNumber = dayCard.getAttribute('data-day');
            if (dayNumber) {
                toggleDay(parseInt(dayNumber));
            }
        });
    });

    // Open first day by default
    toggleDay(1);
}

// Checklist Functionality
function initializeChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            
            if (this.checked) {
                label.style.opacity = '0.6';
                // Add a small celebration effect
                addCheckAnimation(this.parentElement);
            } else {
                label.style.opacity = '1';
            }
            
            updateChecklistProgress();
        });
    });
}

// Add check animation
function addCheckAnimation(checklistItem) {
    checklistItem.style.transform = 'scale(1.05)';
    checklistItem.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        checklistItem.style.transform = 'scale(1)';
    }, 200);
}

// Update checklist progress
function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked');
    
    const progress = (checkedBoxes.length / checkboxes.length) * 100;
    
    // You could add a progress bar here if needed
    // For now, we'll just log the progress
    if (checkedBoxes.length === checkboxes.length) {
        showPackingComplete();
    }
}

// Show packing complete message
function showPackingComplete() {
    const packingCard = document.querySelector('.practical-card');
    const existingMessage = packingCard.querySelector('.completion-message');
    
    if (!existingMessage) {
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = '<i class="fas fa-check-circle"></i> Great! You\'re all packed and ready for your Billund adventure!';
        message.style.cssText = `
            margin-top: 16px;
            padding: 12px 16px;
            background: rgba(33, 128, 141, 0.1);
            color: var(--color-success);
            border-radius: var(--radius-base);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
            animation: slideIn 0.3s ease;
        `;
        
        packingCard.appendChild(message);
        
        // Add some CSS for the animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > 50) {
            navbar.style.background = `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--color-slate-900-rgb')}, 0.95)`;
        } else {
            navbar.style.background = `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--color-slate-900-rgb')}, 0.9)`;
        }
        
        // Update active navigation link
        updateActiveNavLink();
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards for animation
    const cards = document.querySelectorAll('.day-card, .attraction-card, .specialty-card, .restaurant-card, .practical-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], .hero[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Image lazy loading and error handling
function initializeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading animation
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Handle error cases
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.alt = 'Image not available';
        });
        
        // Set initial state
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
}

// Add some interactive hover effects
function addInteractiveEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .nav-link.active {
            color: var(--color-teal-300) !important;
        }
        
        .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--color-teal-300);
        }
        
        .nav-link {
            position: relative;
        }
    `;
    document.head.appendChild(style);
}

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add keyboard navigation support
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Press 'Escape' to close mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        
        // Press number keys 1-5 to toggle day sections
        if (e.key >= '1' && e.key <= '5') {
            const dayNumber = parseInt(e.key);
            toggleDay(dayNumber);
        }
    });
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeImages();
    addInteractiveEffects();
    initializeKeyboardNavigation();
    
    // Add a subtle parallax effect to the hero section
    window.addEventListener('scroll', debounce(function() {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }, 10));
});

// Add some fun interactions for the LEGO theme
function addLegoEffects() {
    // Add a brick-building sound effect simulation (visual only)
    const dayCards = document.querySelectorAll('.day-card');
    
    dayCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) rotate(0.5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
    
    // Add click effect to attraction cards
    const attractionCards = document.querySelectorAll('.attraction-card');
    
    attractionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('a')) {
                const button = this.querySelector('.attraction-btn');
                if (button) {
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 150);
                }
            }
        });
    });
}

// Add scroll-to-top functionality
function addScrollToTop() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--color-primary);
        color: var(--color-btn-primary-text);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top when clicked
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.background = 'var(--color-primary-hover)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.background = 'var(--color-primary)';
    });
}

// Final initialization
window.addEventListener('load', function() {
    addLegoEffects();
    addScrollToTop();
    
    // Add a welcome effect
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.animation = 'bounceIn 1s ease';
        }
        
        // Add bounce animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounceIn {
                0% { opacity: 0; transform: scale(0.3); }
                50% { transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }, 500);
});