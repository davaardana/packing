// Keep runtime JS lightweight for better mobile PageSpeed.
(function () {
    const nav = document.querySelector('nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Smooth scroll with event delegation (one listener, not many).
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Navbar shadow toggle with passive scroll + rAF.
    if (nav) {
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                nav.classList.toggle('shadow-lg', window.scrollY > 50);
                ticking = false;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Counter animation (only if counters exist).
    const counters = document.querySelectorAll('.stats-counter');
    if (counters.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const element = entry.target;
                const target = parseInt(element.textContent.replace(/\D/g, ''), 10);
                if (!Number.isFinite(target)) {
                    observer.unobserve(element);
                    return;
                }

                const duration = 1200;
                const startTime = performance.now();
                const tick = (now) => {
                    const progress = Math.min((now - startTime) / duration, 1);
                    element.textContent = Math.floor(target * progress) + '+';
                    if (progress < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
                observer.unobserve(element);
            });
        }, { threshold: 0.5 });

        counters.forEach((el) => observer.observe(el));
    }

    // Skip costly section fade observer on smaller screens.
    if (window.matchMedia('(min-width: 769px)').matches && 'IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section').forEach((sec) => {
            if (sec.id === 'home') return;
            sec.classList.add('section-fade');
            sectionObserver.observe(sec);
        });
    }
})();
