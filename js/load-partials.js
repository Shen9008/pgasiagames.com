/**
 * PG Asia Games - Load modular header, footer, and partials.
 */
(function () {
    'use strict';

    var pathname = (window.location.pathname || '').replace(/\/$/, '');
    var segments = pathname.split('/').filter(Boolean);
    if (segments[segments.length - 1] === 'index.html') segments.pop();
    var depth = segments.length;
    var base = depth > 0 ? Array(depth + 1).join('../') : '';

    function rewriteLinks(html) {
        if (!base) return html;
        html = html.replace(/\ssrc="(images\/[^"]*)"/g, ' src="' + base + '$1"');
        return html;
    }

    function setActiveNav() {
        var page = document.body.getAttribute('data-page') || '';
        if (!page) return;
        document.querySelectorAll('.nav__link[data-nav="' + page + '"]').forEach(function (el) {
            el.classList.add('nav__link--active');
        });
        document.querySelectorAll('.nav-drawer__item[data-nav="' + page + '"]').forEach(function (el) {
            el.classList.add('nav-drawer__item--current');
        });
    }

    /**
     * Build drawer body + link list from desktop nav. Runs after partial inject so a truncated
     * `partials/header.html` response cannot leave the drawer without links.
     */
    function hydrateNavDrawer() {
        var drawer = document.getElementById('site-nav-drawer');
        var surface = drawer && drawer.querySelector('.nav-drawer__surface');
        if (!surface) {
            return;
        }

        var body = surface.querySelector('.nav-drawer__body');
        if (!body) {
            body = document.createElement('div');
            body.className = 'nav-drawer__body';
            surface.appendChild(body);
        }

        var navEl = body.querySelector('.nav-drawer__nav');
        if (!navEl) {
            navEl = document.createElement('nav');
            navEl.className = 'nav-drawer__nav';
            navEl.setAttribute('aria-label', 'Site sections');
            body.appendChild(navEl);
        }

        var list = navEl.querySelector('.nav-drawer__list');
        if (!list) {
            list = document.createElement('ul');
            list.className = 'nav-drawer__list';
            navEl.appendChild(list);
        }

        var sources = document.querySelectorAll('.nav .nav__link[data-nav]');
        if (!sources.length) {
            return;
        }

        list.innerHTML = '';
        for (var i = 0; i < sources.length; i++) {
            var src = sources[i];
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = src.getAttribute('href') || '#';
            a.className = 'nav-drawer__item';
            a.setAttribute('data-nav', src.getAttribute('data-nav'));
            a.textContent = (src.textContent || '').replace(/\s+/g, ' ').trim();
            li.appendChild(a);
            list.appendChild(li);
        }
    }

    function bindNavDrawer() {
        var toggle = document.querySelector('.nav-drawer-toggle');
        var drawer = document.getElementById('site-nav-drawer');
        var backdrop = document.getElementById('site-nav-drawer-backdrop');
        if (!toggle || !drawer) {
            return;
        }

        var btnClose = drawer.querySelector('.nav-drawer__close');
        var list = drawer.querySelector('.nav-drawer__list');
        var openedFrom = null;

        function setDrawerOpen(open) {
            drawer.classList.toggle('nav-drawer--open', open);
            document.body.classList.toggle('nav-drawer-open', open);
            drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            var icon = toggle.querySelector('use');
            if (icon) {
                icon.setAttribute('href', open ? '#icon-close' : '#icon-menu');
            }
            if (backdrop) {
                backdrop.hidden = !open;
                backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
            }
            if (open) {
                openedFrom = document.activeElement;
                if (btnClose && typeof btnClose.focus === 'function') {
                    btnClose.focus();
                }
            } else if (openedFrom && typeof openedFrom.focus === 'function') {
                openedFrom.focus();
                openedFrom = null;
            }
        }

        if (btnClose) {
            btnClose.addEventListener('click', function () {
                setDrawerOpen(false);
            });
        }
        toggle.addEventListener('click', function () {
            setDrawerOpen(!drawer.classList.contains('nav-drawer--open'));
        });
        if (backdrop) {
            backdrop.addEventListener('click', function () {
                setDrawerOpen(false);
            });
        }
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer.classList.contains('nav-drawer--open')) {
                setDrawerOpen(false);
            }
        });
        if (list) {
            list.addEventListener('click', function (e) {
                var link = e.target.closest && e.target.closest('.nav-drawer__item');
                if (link) {
                    setDrawerOpen(false);
                }
            });
        }
    }

    function injectSvgSprite() {
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;" aria-hidden="true"><defs>' +
            '<symbol id="icon-menu" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></symbol>' +
            '<symbol id="icon-close" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></symbol>' +
            '<symbol id="icon-chevron-up" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></symbol>' +
            '</defs></svg>';
        var wrap = document.createElement('div');
        wrap.innerHTML = svg;
        document.body.insertBefore(wrap.firstChild, document.body.firstChild);
    }

    function bindScrollToTop() {
        var btn = document.getElementById('scroll-to-top-btn');
        if (!btn) {
            return;
        }

        var threshold = 420;
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        function applyVisibility() {
            var y = window.scrollY || document.documentElement.scrollTop || 0;
            var show = y >= threshold;
            btn.classList.toggle('scroll-to-top--visible', show);
            btn.setAttribute('aria-hidden', show ? 'false' : 'true');
            btn.setAttribute('tabindex', show ? '0' : '-1');
        }

        btn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: reducedMotion.matches ? 'auto' : 'smooth'
            });
            btn.blur();
        });

        window.addEventListener('scroll', applyVisibility, { passive: true });
        applyVisibility();
    }

    function run() {
        injectSvgSprite();
        var promises = [
            fetch(base + 'partials/header.html').then(function (r) { return r.text(); }).then(function (html) {
                var placeholder = document.getElementById('partial-header');
                if (placeholder) {
                    placeholder.outerHTML = rewriteLinks(html);
                }
            }),
            fetch(base + 'partials/footer.html').then(function (r) { return r.text(); }).then(function (html) {
                var placeholder = document.getElementById('partial-footer');
                if (placeholder) {
                    placeholder.outerHTML = rewriteLinks(html);
                }
            })
        ];

        var promoPlaceholder = document.getElementById('partial-1xbet-promo');
        if (promoPlaceholder) {
            promises.push(fetch(base + 'partials/1xbet-promo-banner.html').then(function (r) { return r.text(); }).then(function (html) {
                promoPlaceholder.outerHTML = html;
            }));
        }
        var promoMidPlaceholder = document.getElementById('partial-1xbet-promo-mid');
        if (promoMidPlaceholder) {
            promises.push(fetch(base + 'partials/1xbet-promo-banner-mid.html').then(function (r) { return r.text(); }).then(function (html) {
                promoMidPlaceholder.outerHTML = html;
            }));
        }
        var promoBottomPlaceholder = document.getElementById('partial-1xbet-promo-bottom');
        if (promoBottomPlaceholder) {
            promises.push(fetch(base + 'partials/1xbet-promo-banner-bottom.html').then(function (r) { return r.text(); }).then(function (html) {
                promoBottomPlaceholder.outerHTML = html;
            }));
        }

        var relatedLinksPlaceholder = document.getElementById('partial-related-links');
        if (relatedLinksPlaceholder) {
            promises.push(fetch(base + 'partials/related-links.html').then(function (r) { return r.text(); }).then(function (html) {
                relatedLinksPlaceholder.outerHTML = html;
            }));
        }

        Promise.all(promises).then(function () {
            hydrateNavDrawer();
            setActiveNav();
            bindNavDrawer();
            bindScrollToTop();
        }).catch(function () {
            hydrateNavDrawer();
            setActiveNav();
            bindNavDrawer();
            bindScrollToTop();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
