document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            });
        });
    }

    // Lightbox Gallery
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (galleryItems.length > 0 && lightbox && lightboxImg) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                lightboxImg.src = item.src;
                lightboxImg.alt = item.alt;
                lightbox.classList.add('active');
            });
            // Keyboard accessibility
            item.parentElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    lightboxImg.src = item.src;
                    lightboxImg.alt = item.alt;
                    lightbox.classList.add('active');
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightboxImg.src = '';
            }, 300);
        };

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Highlight active nav link on scroll (for one-page sections if any)
    // Mostly useful for the homepage sections
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            let scrollY = window.pageYOffset;
            
            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 100;
                const sectionId = current.getAttribute('id');
                const navLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
                
                if (navLink) {
                    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                        navLink.classList.add('active');
                    }
                }
            });
        });
    }
});
