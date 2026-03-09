// Smooth scroll untuk navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Navbar transparent saat di atas, solid saat scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('shadow-lg');
    } else {
        nav.classList.remove('shadow-lg');
    }
});

// Simple image loading
window.addEventListener('load', () => {
    document.querySelectorAll('img').forEach(img => {
        img.classList.add('image-loaded');
    });
});

// Fallback for fast page loads
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.querySelectorAll('img').forEach(img => {
        img.classList.add('image-loaded');
    });
}

// Counter animation untuk stats
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('stats-counter')) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe semua stats counter
document.querySelectorAll('.stats-counter').forEach(el => {
    observer.observe(el);
});

function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const start = 0;
    const startTime = Date.now();

    const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (progress < 1) {
            const current = Math.floor((target - start) * progress) + start;
            element.textContent = current + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };

    updateCounter();
}

// Mobile menu toggle (jika implementasi mobile menu di masa depan)
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
    });
}

// Button CTA actions
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const text = this.textContent.trim();
        if (text.includes('Hubungi') || text.includes('Demo')) {
            if (!this.getAttribute('onclick')) {
                // Fallback jika onclick tidak ada
                window.open('https://wa.me/628123456789', '_blank');
            }
        } else if (text.includes('Spesifikasi')) {
            alert('Fitur detail produk akan ditampilkan di halaman detail produk');
        }
    });
});

// Fade in animation saat page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

console.log('Landing Page Packing Pro loaded successfully with lazy loading!');
