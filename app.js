// IEEE Student Branch Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initFormHandling();
    initModalHandling();
    initScrollEffects();
    initEventHandlers();
    fixDropdownOptions();
});

// Fix dropdown options display issue
function fixDropdownOptions() {
    const dropdowns = document.querySelectorAll('select.form-control');
    dropdowns.forEach(dropdown => {
        // Ensure options are properly styled
        const options = dropdown.querySelectorAll('option');
        options.forEach(option => {
            option.style.background = '#2a2a2a';
            option.style.color = '#ffffff';
            option.style.padding = '8px 12px';
        });
        
        // Add focus and change event handlers
        dropdown.addEventListener('focus', function() {
            this.style.borderColor = '#0066CC';
            this.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.2)';
        });
        
        dropdown.addEventListener('blur', function() {
            this.style.borderColor = 'rgba(0, 102, 204, 0.3)';
            this.style.boxShadow = 'none';
        });
        
        dropdown.addEventListener('change', function() {
            if (this.value) {
                this.style.color = '#ffffff';
            }
        });
    });
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(26, 26, 26, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 102, 204, 0.15)';
        } else {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
            header.style.boxShadow = 'none';
        }

        lastScrollTop = scrollTop;
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToSection(targetId.substring(1));
        });
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    const header = document.getElementById('header');
    
    if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Modal functionality
function initModalHandling() {
    // Join IEEE button handler
    const joinButtons = document.querySelectorAll('.btn--primary');
    joinButtons.forEach(button => {
        if (button.textContent.includes('Join IEEE')) {
            button.addEventListener('click', function() {
                openModal('join-modal');
            });
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Make closeModal globally available
window.closeModal = closeModal;

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for grid items
                if (entry.target.classList.contains('chapters__grid') || 
                    entry.target.classList.contains('benefits__grid') ||
                    entry.target.classList.contains('events__grid') ||
                    entry.target.classList.contains('team__grid')) {
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll(`
        .section-header,
        .benefit-card,
        .chapter-card,
        .event-card,
        .announcement-card,
        .team-card,
        .gallery-item,
        .stat-card,
        .contact__item,
        .contact__form,
        .hero__content
    `);

    // Set initial state for animations
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Hero content animation (immediate)
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // Stats animation with counter effect
    const statNumbers = document.querySelectorAll('.stat-card__number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter animation for statistics
function animateCounter(element) {
    const target = element.textContent;
    const isPercentage = target.includes('%');
    const isPlus = target.includes('+');
    const numericValue = parseInt(target.replace(/[^\d]/g, ''));
    
    let current = 0;
    const increment = Math.ceil(numericValue / 50);
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        
        let displayValue = current.toString();
        if (isPercentage) displayValue += '%';
        if (isPlus && current === numericValue) displayValue += '+';
        
        element.textContent = displayValue;
    }, 30);
}

// Form handling
function initFormHandling() {
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form fields
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const phone = this.querySelector('input[name="phone"]').value;
            const interest = this.querySelector('select[name="interest"]').value;
            const message = this.querySelector('textarea[name="message"]').value;
            
            if (!name || !email || !phone || !interest || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            handleFormSubmission(this, 'Thank you for your interest! We will contact you soon.');
        });
    }

    // Join IEEE form
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'Application submitted successfully! We will review your application and get back to you.');
            setTimeout(() => {
                closeModal('join-modal');
            }, 2000);
        });
    }

    // Form field focus effects
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

function handleFormSubmission(form, successMessage) {
    const formButton = form.querySelector('.btn--primary');
    const originalText = formButton.textContent;
    
    // Show loading state
    formButton.textContent = 'Sending...';
    formButton.disabled = true;
    formButton.style.opacity = '0.7';
    
    // Simulate form submission
    setTimeout(() => {
        // Show success message
        showNotification(successMessage, 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        formButton.textContent = originalText;
        formButton.disabled = false;
        formButton.style.opacity = '1';
    }, 2000);
}

// Event handlers
function initEventHandlers() {
    // Event registration buttons
    const registerButtons = document.querySelectorAll('.event-card .btn--primary');
    registerButtons.forEach(button => {
        if (button.textContent.includes('Register')) {
            button.addEventListener('click', function() {
                const eventTitle = this.closest('.event-card').querySelector('h3').textContent;
                showNotification(`Registration for "${eventTitle}" - Coming Soon! Check back later.`, 'info');
            });
        }
    });

    // Learn More buttons
    const learnMoreButtons = document.querySelectorAll('.event-card .btn--outline');
    learnMoreButtons.forEach(button => {
        if (button.textContent.includes('Learn More')) {
            button.addEventListener('click', function() {
                const eventTitle = this.closest('.event-card').querySelector('h3').textContent;
                showNotification(`More details about "${eventTitle}" will be available soon!`, 'info');
            });
        }
    });

    // Chapter card interactions
    const chapterCards = document.querySelectorAll('.chapter-card');
    chapterCards.forEach(card => {
        card.addEventListener('click', function() {
            const chapterName = this.querySelector('h3').textContent;
            showNotification(`Interested in ${chapterName}? Contact us for more information!`, 'info');
        });
    });

    // Gallery item interactions
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const eventName = this.querySelector('.gallery-item__text').textContent;
            showNotification(`${eventName} gallery - Full gallery coming soon!`, 'info');
        });
    });

    // Team member email links
    const emailLinks = document.querySelectorAll('.team-card__email');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Let the default mailto behavior work, but show a notification
            setTimeout(() => {
                showNotification('Opening email client...', 'info');
            }, 100);
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    let backgroundColor, borderColor;
    switch(type) {
        case 'success':
            backgroundColor = 'rgba(0, 102, 204, 0.9)';
            borderColor = 'rgba(0, 102, 204, 0.3)';
            break;
        case 'error':
            backgroundColor = 'rgba(255, 68, 68, 0.9)';
            borderColor = 'rgba(255, 68, 68, 0.3)';
            break;
        case 'info':
        default:
            backgroundColor = 'rgba(212, 165, 116, 0.9)';
            borderColor = 'rgba(212, 165, 116, 0.3)';
    }

    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        border: 1px solid ${borderColor};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        backdrop-filter: blur(10px);
    `;
    
    // Style the close button
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
        padding: 0;
        line-height: 1;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            removeNotification(notification);
        }
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 300);
}

// Scroll effects
function initScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = hero.querySelector('.hero__container');
            if (parallax && scrolled < window.innerHeight) {
                parallax.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        });
    }

    // IEEE badge rotation on scroll
    const ieeeBadge = document.querySelector('.ieee-badge');
    if (ieeeBadge) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rotation = scrolled * 0.1;
            ieeeBadge.style.transform = `rotate(${rotation}deg)`;
        });
    }

    // Chapter cards hover effect enhancement
    const chapterCards = document.querySelectorAll('.chapter-card');
    chapterCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Button click effects with ripple animation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        const button = e.target;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
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
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s linear;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// Modal keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modal
        const openModal = document.querySelector('.modal:not(.hidden)');
        if (openModal) {
            closeModal(openModal.id);
        }
        
        // Close mobile menu
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Performance optimizations
const throttle = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Apply throttling to scroll-heavy functions
const throttledScrollHandler = throttle(() => {
    // Additional scroll handling can go here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Initialize service worker for better performance (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker would be registered here in a production environment
        console.log('Service Worker support detected');
    });
}

// Add custom CSS animations
const customStyles = document.createElement('style');
customStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .focused {
        transform: translateY(-2px);
    }
    
    .nav__toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .nav__toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav__toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .notification {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    /* Fix dropdown styling for better visibility */
    select.form-control option {
        background-color: #2a2a2a !important;
        color: #ffffff !important;
        padding: 8px 12px !important;
    }
    
    select.form-control option:hover,
    select.form-control option:focus,
    select.form-control option:checked {
        background-color: #0066CC !important;
        color: #ffffff !important;
    }
`;
document.head.appendChild(customStyles);

// Initialize tooltips for better UX
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                pointer-events: none;
                z-index: 10001;
                white-space: nowrap;
            `;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Initialize all tooltips
initTooltips();

// Console welcome message
console.log('%c🎓 IEEE Student Branch - IIMT College of Engineering', 
    'color: #0066CC; font-size: 16px; font-weight: bold;');
console.log('%cWebsite successfully loaded! Join us in advancing technology for humanity.', 
    'color: #d4a574; font-size: 12px;');

// Export functions for global access
window.scrollToSection = scrollToSection;
window.openModal = openModal;
window.showNotification = showNotification;