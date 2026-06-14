/**
 * PG Asia Games — Premium UI interactions
 */
(function () {
    'use strict';

    var AFFILIATE = 'https://reffpa.com/L?tag=d_5501500m_1236c_&site=5501500&ad=1236';

    function initNavCursorDot() {
        var center = document.getElementById('premium-nav-links');
        var dot = document.getElementById('nav-cursor-dot');
        if (!center || !dot) return;

        var links = center.querySelectorAll('.premium-nav__link');
        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        links.forEach(function (link) {
            link.addEventListener('mouseenter', function () {
                if (reduced) return;
                var rect = center.getBoundingClientRect();
                var linkRect = link.getBoundingClientRect();
                dot.style.left = (linkRect.left - rect.left + linkRect.width / 2) + 'px';
                dot.style.top = (linkRect.top - rect.top + linkRect.height / 2) + 'px';
            });
        });
    }

    function initHeroParallax() {
        var visual = document.getElementById('hero-3d-visual');
        var grid = document.getElementById('hero-3d-grid');
        if (!visual || !grid) return;

        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;

        visual.addEventListener('mousemove', function (e) {
            var rect = visual.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            grid.style.transform = 'rotateX(' + (-y * 18) + 'deg) rotateY(' + (x * 18) + 'deg)';
        });

        visual.addEventListener('mouseleave', function () {
            grid.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }

    function initAccordion() {
        var items = document.querySelectorAll('.premium-accordion__item');
        items.forEach(function (item) {
            var trigger = item.querySelector('.premium-accordion__trigger');
            if (!trigger) return;

            trigger.addEventListener('click', function () {
                var isOpen = item.classList.contains('premium-accordion__item--open');
                items.forEach(function (other) {
                    other.classList.remove('premium-accordion__item--open');
                    var btn = other.querySelector('.premium-accordion__trigger');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
                if (!isOpen) {
                    item.classList.add('premium-accordion__item--open');
                    trigger.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    function initContactForm() {
        var form = document.getElementById('premium-contact-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = 'sparta4444@protonmail.com';
            var name = (form.querySelector('[name="name"]') || {}).value || '';
            var userEmail = (form.querySelector('[name="email"]') || {}).value || '';
            var message = (form.querySelector('[name="message"]') || {}).value || '';
            var subject = encodeURIComponent('PGAsia Contact — ' + (name || 'Player'));
            var body = encodeURIComponent(
                'Name: ' + name + '\nEmail: ' + userEmail + '\n\n' + message
            );
            window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
        });
    }

    function initPremiumDrawer() {
        var toggle = document.getElementById('premium-nav-toggle');
        var drawer = document.getElementById('premium-drawer');
        var backdrop = document.getElementById('premium-drawer-backdrop');
        var closeBtn = document.getElementById('premium-drawer-close');

        if (!toggle || !drawer) return;

        function setOpen(open) {
            drawer.classList.toggle('premium-drawer--open', open);
            document.body.classList.toggle('premium-drawer-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        }

        toggle.addEventListener('click', function () {
            setOpen(!drawer.classList.contains('premium-drawer--open'));
        });
        if (backdrop) backdrop.addEventListener('click', function () { setOpen(false); });
        if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
        drawer.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { setOpen(false); });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setOpen(false);
        });
    }

    function setActivePremiumNav() {
        var page = document.body.getAttribute('data-page') || '';
        var map = {
            index: null,
            slots: 'casino',
            'live-casino': 'experience',
            bonus: 'reserve',
            'sports-betting': 'experience'
        };
        var key = map[page];
        if (!key) return;
        var link = document.querySelector('.premium-nav__link[data-premium-nav="' + key + '"]');
        if (link) link.classList.add('premium-nav__link--active');
    }

    window.PGAsiaPremium = {
        init: function () {
            if (window.__pgasiaPremiumInit) return;
            window.__pgasiaPremiumInit = true;
            initNavCursorDot();
            initHeroParallax();
            initAccordion();
            initContactForm();
            initPremiumDrawer();
            setActivePremiumNav();
        },
        affiliateUrl: AFFILIATE
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            if (document.getElementById('premium-nav-links')) {
                window.PGAsiaPremium.init();
            }
        });
    } else if (document.getElementById('premium-nav-links')) {
        window.PGAsiaPremium.init();
    }
})();
