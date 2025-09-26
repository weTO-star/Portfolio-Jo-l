// ===== HOTEL RIVE GAUCHE - PREMIUM JS =====

class LuxuryHotel {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollEffects();
        this.initNavigation();
        this.initGallery();
        this.initAnimations();
        this.initParallax();
        this.initRoomInteractions();
        this.initScrollToTop();
        this.initLoadingStates();
    }

    // ===== SCROLL EFFECTS =====
    initScrollEffects() {
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            const scrolled = window.scrollY > 100;
            header.classList.toggle('scrolled', scrolled);

            // Scroll to top button
            this.toggleScrollToTop();
        });

        // Scroll animations
        this.initScrollAnimations();
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Stagger children animations
                    if (entry.target.classList.contains('feature-grid')) {
                        this.animateStagger(entry.target.children, 'fadeInUp');
                    }
                }
            });
        }, observerOptions);

        // Observe animated elements
        document.querySelectorAll('.feature-card, .room-card, .gallery-item, .section-title').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }

    animateStagger(elements, animation) {
        Array.from(elements).forEach((el, index) => {
            setTimeout(() => {
                el.style.animation = `${animation} 0.6s ease-out forwards`;
            }, index * 100);
        });
    }

    // ===== NAVIGATION =====
    initNavigation() {
        // Mobile menu
        this.initMobileMenu();
        
        // Smooth scroll
        this.initSmoothScroll();
        
        // Active link highlighting
        this.initActiveLinks();
    }

    initMobileMenu() {
        const menuBtn = document.createElement('button');
        menuBtn.innerHTML = '☰';
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 1.8rem;
            cursor: pointer;
            padding: 0.5rem;
            z-index: 10001;
        `;

        const nav = document.querySelector('.nav');
        if (nav) {
            nav.appendChild(menuBtn);

            // Toggle menu
            menuBtn.addEventListener('click', () => {
                const navLinks = document.querySelector('.nav-links');
                navLinks.classList.toggle('active');
                menuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
            });

            // Close menu on link click
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    document.querySelector('.nav-links').classList.remove('active');
                    menuBtn.innerHTML = '☰';
                });
            });

            // Responsive check
            this.checkMobileMenu();
            window.addEventListener('resize', () => this.checkMobileMenu());
        }
    }

    checkMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (window.innerWidth <= 768) {
            menuBtn.style.display = 'block';
            if (!navLinks.classList.contains('active')) {
                navLinks.style.display = 'none';
            }
        } else {
            menuBtn.style.display = 'none';
            navLinks.style.display = 'flex';
            navLinks.classList.remove('active');
        }
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ===== GALLERY FUNCTIONALITY =====
    initGallery() {
        // Lightbox functionality
        this.initLightbox();
        
        // Image lazy loading
        this.initLazyLoading();
        
        // Gallery filters
        this.initGalleryFilters();
    }

    initLightbox() {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                this.openLightbox(item.style.backgroundImage.slice(5, -2));
            });
        });

        // Close lightbox on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox();
            }
        });
    }

    openLightbox(imageUrl) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox active';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close-lightbox">&times;</span>
                <img src="${imageUrl}" alt="Gallery Image" class="lightbox-img">
            </div>
        `;
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });
        
        lightbox.querySelector('.close-lightbox').addEventListener('click', () => this.closeLightbox());
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            setTimeout(() => lightbox.remove(), 300);
            document.body.style.overflow = '';
        }
    }

    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    initGalleryFilters() {
        // Add filter buttons for gallery categories
        const gallerySection = document.querySelector('.gallery-section .container');
        if (gallerySection) {
            const filterHTML = `
                <div class="gallery-filters">
                    <button class="filter-btn active" data-filter="all">Toutes</button>
                    <button class="filter-btn" data-filter="chambres">Chambres</button>
                    <button class="filter-btn" data-filter="suites">Suites</button>
                    <button class="filter-btn" data-filter="espaces">Espaces communs</button>
                </div>
            `;
            
            const galleryGrid = document.querySelector('.gallery-grid');
            if (galleryGrid) {
                galleryGrid.insertAdjacentHTML('beforebegin', filterHTML);
                
                // Filter functionality
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        
                        const filter = btn.dataset.filter;
                        this.filterGallery(filter);
                    });
                });
            }
        }
    }

    filterGallery(filter) {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                setTimeout(() => item.style.opacity = '1', 50);
            } else {
                item.style.opacity = '0';
                setTimeout(() => item.style.display = 'none', 300);
            }
        });
    }

    // ===== ANIMATIONS =====
    initAnimations() {
        // Parallax scrolling
        this.initParallax();
        
        // Floating elements
        this.initFloatingElements();
        
        // Typewriter effect for hero
        this.initTypewriter();
    }

    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    initFloatingElements() {
        const floatElements = document.querySelectorAll('.feature-icon, .room-card');
        floatElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.2}s`;
        });
    }

    initTypewriter() {
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            let i = 0;
            
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            // Start typing after a delay
            setTimeout(typeWriter, 1000);
        }
    }

    // ===== ROOM INTERACTIONS =====
    initRoomInteractions() {
        // Room availability check
        this.initRoomAvailability();
        
        // Room image hover effects
        this.initRoomHoverEffects();
    }

    initRoomAvailability() {
        document.querySelectorAll('.check-availability').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.simulateAvailabilityCheck(btn);
            });
        });
    }

    simulateAvailabilityCheck(button) {
        const originalText = button.innerHTML;
        const roomCard = button.closest('.room-card');
        
        button.innerHTML = '<span class="loading-spinner"></span> Vérification...';
        button.disabled = true;

        setTimeout(() => {
            const isAvailable = Math.random() > 0.3;
            
            if (isAvailable) {
                button.innerHTML = '✅ Disponible';
                button.style.background = '#4CAF50';
                roomCard.classList.add('available');
            } else {
                button.innerHTML = '❌ Complet';
                button.style.background = '#f44336';
                roomCard.classList.add('unavailable');
            }
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '';
                roomCard.classList.remove('available', 'unavailable');
            }, 3000);
        }, 2000);
    }

    initRoomHoverEffects() {
        document.querySelectorAll('.room-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // ===== SCROLL TO TOP =====
    initScrollToTop() {
        const scrollBtn = document.createElement('a');
        scrollBtn.href = '#top';
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.title = 'Retour en haut';
        
        document.body.appendChild(scrollBtn);
    }

    toggleScrollToTop() {
        const scrollBtn = document.querySelector('.scroll-to-top');
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }

    // ===== LOADING STATES =====
    initLoadingStates() {
        // Form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.innerHTML = '<span class="loading-spinner"></span> Traitement...';
                    submitBtn.disabled = true;
                }
            });
        });
    }

    // ===== UTILITY FUNCTIONS =====
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 10px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: var(--shadow);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// ===== INITIALIZE WHEN DOM LOADS =====
document.addEventListener('DOMContentLoaded', () => {
    new LuxuryHotel();
});

// ===== ADD DYNAMIC STYLES =====
const dynamicStyles = `
    .notification-icon { font-size: 1.2rem; }
    
    .gallery-filters {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 2rem 0;
        flex-wrap: wrap;
    }
    
    .filter-btn {
        padding: 0.8rem 1.5rem;
        border: 2px solid var(--secondary);
        background: transparent;
        color: var(--secondary);
        border-radius: 25px;
        cursor: pointer;
        transition: var(--transition);
        font-weight: 600;
    }
    
    .filter-btn.active,
    .filter-btn:hover {
        background: var(--secondary);
        color: var(--white);
    }
    
    .room-card.available {
        border: 2px solid #4CAF50;
    }
    
    .room-card.unavailable {
        border: 2px solid #f44336;
        opacity: 0.8;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);