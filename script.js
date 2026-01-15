/**
 * Bertrand Cafe Light - Interactive Scripts
 * A Bright, Airy Parisian Morning Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initExploreMenu();
    initSearchOverlay();
    initHeroSlider();
    initWaitlistModal();
    initLoginModal();
    initScrollAnimations();
    initSmoothScroll();
    initDiagonalBanners();
    initEditorialKinetic();
    initEventCards();
    initSpecialsCarousel();
    initCart();
});

/**
 * Navbar - Scroll Effects
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Explore Menu - Toggle
 */
function initExploreMenu() {
    const exploreToggle = document.getElementById('exploreToggle');
    const exploreMenu = document.getElementById('exploreMenu');
    const searchOverlay = document.getElementById('searchOverlay');

    if (!exploreToggle || !exploreMenu) return;

    exploreToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (searchOverlay) searchOverlay.classList.remove('active');
        exploreMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!exploreToggle.contains(e.target) && !exploreMenu.contains(e.target)) {
            exploreMenu.classList.remove('active');
        }
    });

    exploreMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            exploreMenu.classList.remove('active');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            exploreMenu.classList.remove('active');
        }
    });
}

/**
 * Search Overlay - Toggle
 */
function initSearchOverlay() {
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    const exploreMenu = document.getElementById('exploreMenu');

    if (!searchToggle || !searchOverlay) return;

    searchToggle.addEventListener('click', () => {
        if (exploreMenu) exploreMenu.classList.remove('active');
        searchOverlay.classList.toggle('active');
        if (searchOverlay.classList.contains('active') && searchInput) {
            setTimeout(() => searchInput.focus(), 300);
        }
    });

    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchOverlay.classList.remove('active');
        }
    });
}

/**
 * Hero Slider - Auto-advance slides
 */
function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    if (slides.length === 0) return;

    let current = 0;

    const goToSlide = (index) => {
        slides[current].classList.remove('active');
        if (dots[current]) dots[current].classList.remove('active');

        current = index;
        if (current >= slides.length) current = 0;
        if (current < 0) current = slides.length - 1;

        slides[current].classList.add('active');
        if (dots[current]) dots[current].classList.add('active');
    };

    // Auto-advance every 4 seconds
    setInterval(() => {
        goToSlide(current + 1);
    }, 4000);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
}

/**
 * Waitlist Modal
 */
function initWaitlistModal() {
    const waitlistModal = document.getElementById('waitlistModal');
    const successModal = document.getElementById('successModal');
    const waitlistForm = document.getElementById('waitlistForm');
    const openButtons = document.querySelectorAll('[data-open-waitlist]');
    const closeButtons = document.querySelectorAll('.modal-close');
    const continueButtons = document.querySelectorAll('[data-close-modal]');

    openButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('exploreMenu')?.classList.remove('active');
            document.getElementById('searchOverlay')?.classList.remove('active');
            openModal(waitlistModal);
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => closeAllModals());
    });

    continueButtons.forEach(button => {
        button.addEventListener('click', () => closeAllModals());
    });

    [waitlistModal, successModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeAllModals();
            });
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmission(waitlistForm, waitlistModal, successModal);
        });
    }
}

function openModal(modal) {
    if (!modal) return;
    document.body.style.overflow = 'hidden';
    modal.classList.add('active');
    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 300);
}

function closeAllModals() {
    document.body.style.overflow = '';
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
    });
}

function handleFormSubmission(form, waitlistModal, successModal) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('Form submission:', data);

    const waitlist = JSON.parse(localStorage.getItem('bertrand_waitlist') || '[]');
    waitlist.push({ ...data, timestamp: new Date().toISOString() });
    localStorage.setItem('bertrand_waitlist', JSON.stringify(waitlist));

    closeAllModals();
    setTimeout(() => {
        openModal(successModal);
        form.reset();
    }, 300);
}

/**
 * Login Modal
 */
function initLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const loginToggle = document.getElementById('loginToggle');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginToggle && loginModal) {
        loginToggle.addEventListener('click', () => {
            openModal(loginModal);
        });
    }

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabName = tab.dataset.tab;
            if (tabName === 'login') {
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                signupForm.style.display = 'block';
            }
        });
    });

    [loginForm, signupForm].forEach(form => {
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Auth form submitted');
                closeAllModals();
            });
        }
    });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.rhythm-card, .diagonal-banner, .special-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));

    // Hero parallax
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
        });
    }
}

/**
 * Editorial Kinetic Typography
 */
function initEditorialKinetic() {
    const headline = document.querySelector('.kinetic-headline');
    if (!headline) return;

    const words = headline.querySelectorAll('.kinetic-word');
    if (words.length === 0) return;

    function updateHeadline() {
        const rect = headline.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const startPoint = viewportHeight * 0.85;
        const endPoint = viewportHeight * 0.3;
        const headlineCenter = rect.top + (rect.height / 2);

        let progress = 0;
        if (headlineCenter < startPoint) {
            progress = Math.min(1, Math.max(0, (startPoint - headlineCenter) / (startPoint - endPoint)));
        }

        const litWordCount = Math.floor(progress * words.length);
        const partialProgress = (progress * words.length) % 1;

        words.forEach((word, index) => {
            word.classList.remove('lit', 'partial');
            if (index < litWordCount) {
                word.classList.add('lit');
            } else if (index === litWordCount && partialProgress > 0.2) {
                word.classList.add('partial');
            }
        });
    }

    window.addEventListener('scroll', updateHeadline, { passive: true });
    updateHeadline();
}

/**
 * Diagonal Banners - Hover Effect
 */
function initDiagonalBanners() {
    const banners = document.querySelectorAll('.diagonal-banner');

    banners.forEach(banner => {
        const bg = banner.querySelector('.banner-bg');

        banner.addEventListener('mousemove', (e) => {
            const rect = banner.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPercent = (x / rect.width - 0.5) * 2;
            const yPercent = (y / rect.height - 0.5) * 2;

            if (bg) {
                bg.style.transform = `scale(1.05) translate(${xPercent * -5}px, ${yPercent * -3}px)`;
            }
        });

        banner.addEventListener('mouseleave', () => {
            if (bg) bg.style.transform = '';
        });
    });
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                document.getElementById('exploreMenu')?.classList.remove('active');
                document.getElementById('searchOverlay')?.classList.remove('active');
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/**
 * Event Cards - Click to Expand
 */
function initEventCards() {
    const eventsSection = document.querySelector('.events-banner-section');
    const eventsCard = document.getElementById('eventsBanner');
    const eventsClose = document.getElementById('eventsClose');
    const eventCards = document.querySelectorAll('.event-card');

    if (!eventsSection || !eventsCard) return;

    eventsCard.addEventListener('click', () => {
        eventsSection.classList.add('expanded');
        setTimeout(() => {
            const expanded = document.getElementById('eventsExpanded');
            if (expanded) expanded.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });

    if (eventsClose) {
        eventsClose.addEventListener('click', (e) => {
            e.stopPropagation();
            eventsSection.classList.remove('expanded');
            setTimeout(() => {
                eventsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && eventsSection.classList.contains('expanded')) {
            eventsSection.classList.remove('expanded');
        }
    });

    // 3D tilt effect on cards (desktop only)
    eventCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            if (!eventsSection.classList.contains('expanded')) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;

            const inner = card.querySelector('.card-inner');
            if (inner) inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.card-inner');
            if (inner) inner.style.transform = '';
        });
    });
}

/**
 * Specials Carousel
 */
function initSpecialsCarousel() {
    const carousel = document.getElementById('specialsCarousel');
    const track = carousel?.querySelector('.specials-track');
    const prevBtn = document.querySelector('.specials-nav-prev');
    const nextBtn = document.querySelector('.specials-nav-next');

    if (!carousel || !track) return;

    const cards = track.querySelectorAll('.special-card');
    if (cards.length === 0) return;

    let position = 0;
    const cardWidth = 300 + 32; // card width + gap
    const visibleCards = Math.floor(carousel.offsetWidth / cardWidth) || 1;
    const maxPosition = Math.max(0, cards.length - visibleCards);

    const updatePosition = () => {
        track.style.transform = `translateX(-${position * cardWidth}px)`;
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            position = Math.max(0, position - 1);
            updatePosition();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            position = Math.min(maxPosition, position + 1);
            updatePosition();
        });
    }
}

/**
 * Cart Functionality
 */
let cart = [];

function initCart() {
    const cartDrawerClose = document.getElementById('cartDrawerClose');
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
    const cartToggle = document.querySelector('.nav-cart');
    const addToCartBtns = document.querySelectorAll('.btn-add-cart');

    if (cartToggle) {
        cartToggle.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (cartDrawerClose) cartDrawerClose.addEventListener('click', closeCart);
    if (cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', closeCart);

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.item;
            const price = parseInt(btn.dataset.price);
            addToCart(name, price);

            btn.classList.add('added');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Added</span>
            `;

            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = originalHTML;
            }, 1500);
        });
    });

    const cartDrawerBody = document.getElementById('cartDrawerBody');
    if (cartDrawerBody) {
        cartDrawerBody.addEventListener('click', (e) => {
            if (e.target.closest('.qty-btn')) {
                const btn = e.target.closest('.qty-btn');
                const action = btn.dataset.action;
                const name = btn.dataset.item;

                if (action === 'increase') updateQuantity(name, 1);
                else if (action === 'decrease') updateQuantity(name, -1);
            }
        });
    }
}

function openCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
    if (cartDrawer && cartDrawerOverlay) {
        cartDrawer.classList.add('open');
        cartDrawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
    if (cartDrawer && cartDrawerOverlay) {
        cartDrawer.classList.remove('open');
        cartDrawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartUI();
    openCart();
}

function updateQuantity(name, delta) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartDrawerBody = document.getElementById('cartDrawerBody');
    const cartDrawerFooter = document.getElementById('cartDrawerFooter');
    const cartSubtotal = document.getElementById('cartSubtotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;

    if (cart.length === 0) {
        if (cartDrawerBody) {
            cartDrawerBody.innerHTML = `
                <div class="cart-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M4 10c0 0 0-3 8-3s8 3 8 3" />
                        <path d="M3 10h18v2c0 5-3 9-9 9s-9-4-9-9v-2z" />
                    </svg>
                    <p>Your basket is empty</p>
                    <span>Add items from the menu to begin your order</span>
                </div>
            `;
        }
        if (cartDrawerFooter) cartDrawerFooter.style.display = 'none';
    } else {
        let itemsHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">R${item.price} each</span>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" data-action="decrease" data-item="${item.name}">−</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" data-action="increase" data-item="${item.name}">+</button>
                    </div>
                </div>
            `;
        });

        if (cartDrawerBody) cartDrawerBody.innerHTML = itemsHTML;
        if (cartSubtotal) cartSubtotal.textContent = `R${subtotal}`;
        if (cartDrawerFooter) cartDrawerFooter.style.display = 'block';
    }
}
