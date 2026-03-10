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

// Button CTA actions (fallback for buttons without href/onclick)
document.querySelectorAll('.btn-primary').forEach(btn => {
    if (!btn.getAttribute('href') && !btn.getAttribute('onclick')) {
        btn.addEventListener('click', function() {
            const text = this.textContent.trim();
            if (text.includes('Hubungi') || text.includes('Demo')) {
                window.open('https://wa.me/6282138538244', '_blank', 'noopener,noreferrer');
            }
        });
    }
});

// Close mobile menu when a nav link is clicked
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.add('hidden');
    });
});

// Fade in animation saat page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// IntersectionObserver: fade-in setiap section saat masuk viewport
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            sectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('section').forEach(sec => {
    sec.classList.add('section-fade');
    sectionObserver.observe(sec);
});

// IntersectionObserver: lazy-load background images (data-bg)
const bgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            if (el.dataset.bg) {
                el.style.backgroundImage = el.dataset.bg;
                delete el.dataset.bg;
            }
            bgObserver.unobserve(el);
        }
    });
}, { rootMargin: '200px' });

document.querySelectorAll('[data-bg]').forEach(el => bgObserver.observe(el));
