document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle (Accessible)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const iconMenu = mobileMenuBtn ? mobileMenuBtn.querySelector('.icon-menu') : null;
    const iconClose = mobileMenuBtn ? mobileMenuBtn.querySelector('.icon-close') : null;

    const setMenuState = (open) => {
        if (!mobileMenuBtn || !navLinks) return;
        navLinks.classList.toggle('active', open);
        document.body.classList.toggle('menu-open', open);
        mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        mobileMenuBtn.setAttribute(
            'aria-label',
            open ? 'Close navigation menu' : 'Open navigation menu'
        );
        if (iconMenu && iconClose) {
            iconMenu.style.display = open ? 'none' : 'inline-block';
            iconClose.style.display = open ? 'inline-block' : 'none';
        }
    };

    if (mobileMenuBtn && navLinks) {
        setMenuState(false);

        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('active');
            setMenuState(!isOpen);
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => setMenuState(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                setMenuState(false);
                mobileMenuBtn.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                setMenuState(false);
            }
        });
    }

    // Lightbox Gallery
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    let lastGalleryTrigger = null;

    if (galleryItems.length > 0 && lightbox && lightboxImg) {
        const openLightbox = (trigger) => {
            const img = trigger.querySelector('img');
            if (!img) return;
            lastGalleryTrigger = trigger;
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            if (lightboxCaption) {
                const cap = trigger.getAttribute('data-caption') || img.alt || '';
                lightboxCaption.textContent = cap;
            }
            lightbox.classList.add('active');
            document.body.classList.add('menu-open');
            if (lightboxClose) {
                lightboxClose.focus();
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.classList.remove('menu-open');
            lightboxImg.removeAttribute('src');
            lightboxImg.alt = '';
            if (lastGalleryTrigger) {
                lastGalleryTrigger.focus();
                lastGalleryTrigger = null;
            }
        };

        galleryItems.forEach((item) => {
            item.addEventListener('click', () => openLightbox(item));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(item);
                }
            });
        });

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

    // Copy Email Helper (Support / Legal Pages)
    const copyButtons = document.querySelectorAll('[data-copy-text]');
    copyButtons.forEach((btn) => {
        btn.addEventListener('click', async () => {
            const value = btn.getAttribute('data-copy-text');
            const statusId = btn.getAttribute('data-copy-status');
            const statusEl = statusId ? document.getElementById(statusId) : null;
            if (!value) return;

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(value);
                } else {
                    const tmp = document.createElement('textarea');
                    tmp.value = value;
                    tmp.style.position = 'fixed';
                    tmp.style.opacity = '0';
                    document.body.appendChild(tmp);
                    tmp.select();
                    document.execCommand('copy');
                    document.body.removeChild(tmp);
                }
                if (statusEl) {
                    statusEl.textContent = 'Email copied to clipboard.';
                    setTimeout(() => {
                        statusEl.textContent = '';
                    }, 3500);
                }
            } catch (_) {
                if (statusEl) {
                    statusEl.textContent = 'Please copy: ' + value;
                }
            }
        });
    });

    // Progressive Scroll Animations
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { root: null, rootMargin: '0px 0px -30px 0px', threshold: 0.08 }
        );

        fadeElements.forEach((el) => observer.observe(el));

        // Safety fallback so above/near-fold elements never remain invisible
        setTimeout(() => {
            fadeElements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight + 120) {
                    el.classList.add('visible');
                }
            });
        }, 250);
    } else {
        fadeElements.forEach((el) => el.classList.add('visible'));
    }

    // Highlight in-page section links cleanly on homepage
    const sections = document.querySelectorAll('main section[id]');
    if (sections.length > 0) {
        const updateActiveNav = () => {
            const scrollY = window.scrollY;
            let activeId = '';
            sections.forEach((sec) => {
                const top = sec.offsetTop - 130;
                const bottom = top + sec.offsetHeight;
                if (scrollY >= top && scrollY < bottom) {
                    activeId = sec.getAttribute('id') || '';
                }
            });

            if (!activeId) return;
            const navSectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
            navSectionLinks.forEach((link) => {
                const isMatch = link.getAttribute('href') === `#${activeId}`;
                link.classList.toggle('active', isMatch);
            });
        };

        window.addEventListener('scroll', updateActiveNav, { passive: true });
        updateActiveNav();
    }
});
