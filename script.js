// ========== SCROLL REVEAL ANIMATION ==========
function handleScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// ========== LOAD PRODUCTS WITH ANIMATION ==========
async function loadProducts() {
    const container = document.getElementById('products-container');
    
    if (!container) return;
    
    try {
        const response = await fetch('/content/products/products.json');
        const products = await response.json();
        
        container.innerHTML = products.map((product, index) => `
            <div class="product-card reveal" style="animation-delay: ${index * 0.1}s">
                <img src="${product.image || '/images/placeholder.jpg'}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-price">₹${product.price}</p>
                    <p class="product-category">${product.category || 'Fresh Item'}</p>
                </div>
            </div>
        `).join('');
        
        // Re-trigger scroll reveal for new elements
        handleScrollReveal();
        
    } catch (error) {
        console.error('Error loading products:', error);
        if (container) {
            container.innerHTML = '<p class="glass-card" style="padding: 2rem; text-align: center;">Unable to load products. Please try again later.</p>';
        }
    }
}

// ========== LOAD NOTICES ==========
async function loadNotices() {
    const container = document.getElementById('notices-container');
    
    if (!container) return;
    
    try {
        const response = await fetch('/content/notices/notices.json');
        const notices = await response.json();
        const today = new Date().toISOString().split('T')[0];
        
        const activeNotices = notices.filter(notice => 
            notice.active && (!notice.expiry || notice.expiry >= today)
        );
        
        if (activeNotices.length === 0) {
            container.innerHTML = '<div class="glass-card" style="padding: 1.5rem; text-align: center;">✨ No active announcements. Check back soon!</div>';
            return;
        }
        
        container.innerHTML = activeNotices.map(notice => `
            <div class="notice-card slide-in">
                <p class="notice-message">📢 ${notice.message}</p>
                ${notice.expiry ? `<p class="notice-expiry">Valid till: ${notice.expiry}</p>` : ''}
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading notices:', error);
        container.innerHTML = '<div class="glass-card" style="padding: 1.5rem; text-align: center;">📢 No announcements at the moment.</div>';
    }
}

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

// ========== ADD GLOW EFFECT ON HOVER ==========
function initHoverEffects() {
    const cards = document.querySelectorAll('.product-card, .glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    });
}

// ========== LAZY LOAD IMAGES ==========
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in-up');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========== ADD LOADING ANIMATION ==========
function showLoading() {
    const containers = document.querySelectorAll('#products-container, #notices-container');
    containers.forEach(container => {
        if (container && container.innerHTML === '') {
            container.innerHTML = '<div class="glass-card" style="padding: 2rem; text-align: center;"><div class="loading-spinner"></div> Loading...</div>';
        }
    });
}

// ========== INITIALIZE ALL ==========
document.addEventListener('DOMContentLoaded', () => {
    // Show loading state
    showLoading();
    
    // Load data
    loadProducts();
    loadNotices();
    
    // Initialize animations
    initSmoothScroll();
    initHoverEffects();
    initLazyLoad();
    handleScrollReveal();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollReveal);
});

// ========== ADD LOADING SPINNER CSS DYNAMICALLY ==========
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 77, 77, 0.2);
        border-top-color: #ff4d4d;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

