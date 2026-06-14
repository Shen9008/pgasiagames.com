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

    function setAccordionItemState(item, open) {
        var trigger = item.querySelector('.premium-accordion__trigger');
        var panel = item.querySelector('.premium-accordion__panel');
        item.classList.toggle('premium-accordion__item--open', open);
        if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (panel) panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    }

    function initAccordion() {
        var items = document.querySelectorAll('.premium-accordion__item');
        items.forEach(function (item, index) {
            var trigger = item.querySelector('.premium-accordion__trigger');
            var panel = item.querySelector('.premium-accordion__panel');
            if (!trigger || !panel) return;

            var panelId = panel.id || ('faq-panel-' + index);
            var triggerId = trigger.id || ('faq-trigger-' + index);
            panel.id = panelId;
            trigger.id = triggerId;
            trigger.setAttribute('aria-controls', panelId);
            setAccordionItemState(item, false);

            trigger.addEventListener('click', function () {
                var isOpen = item.classList.contains('premium-accordion__item--open');
                items.forEach(function (other) {
                    setAccordionItemState(other, false);
                });
                if (!isOpen) setAccordionItemState(item, true);
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
        var panel = document.getElementById('premium-drawer-panel');
        var backdrop = document.getElementById('premium-drawer-backdrop');
        var closeBtn = document.getElementById('premium-drawer-close');

        if (!toggle || !drawer || !panel) return;

        var lastFocus = null;

        function setOpen(open) {
            drawer.classList.toggle('premium-drawer--open', open);
            document.body.classList.toggle('premium-drawer-open', open);
            drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (open) {
                lastFocus = document.activeElement;
                closeBtn && closeBtn.focus();
            } else if (lastFocus && typeof lastFocus.focus === 'function') {
                lastFocus.focus();
                lastFocus = null;
            }
        }

        toggle.addEventListener('click', function () {
            setOpen(!drawer.classList.contains('premium-drawer--open'));
        });
        if (backdrop) backdrop.addEventListener('click', function () { setOpen(false); });
        if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
        drawer.querySelectorAll('.premium-drawer__links a').forEach(function (a) {
            a.addEventListener('click', function () { setOpen(false); });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer.classList.contains('premium-drawer--open')) {
                setOpen(false);
            }
        });
    }

    function setActivePremiumNav() {
        var page = document.body.getAttribute('data-page') || '';
        document.querySelectorAll('.premium-nav__link[data-nav="' + page + '"]').forEach(function (el) {
            el.classList.add('premium-nav__link--active');
        });
        document.querySelectorAll('.premium-drawer__links a[data-nav="' + page + '"]').forEach(function (el) {
            el.classList.add('premium-drawer__link--active');
        });
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
})();
