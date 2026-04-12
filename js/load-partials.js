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
        document.querySelectorAll('.nav__link[data-nav="' + page + '"], .mobile-menu__link[data-nav="' + page + '"]').forEach(function (el) {
            el.classList.add('nav__link--active', 'mobile-menu__link--active');
        });
    }

    function injectSvgSprite() {
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;" aria-hidden="true"><defs>' +
            '<symbol id="icon-menu" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></symbol>' +
            '<symbol id="icon-close" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></symbol>' +
            '</defs></svg>';
        var wrap = document.createElement('div');
        wrap.innerHTML = svg;
        document.body.insertBefore(wrap.firstChild, document.body.firstChild);
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
            setActiveNav();
            var toggle = document.querySelector('.mobile-menu-toggle');
            var menu = document.querySelector('.mobile-menu');
            if (toggle && menu) {
                function setMenuOpen(open) {
                    menu.classList.toggle('active', open);
                    document.body.classList.toggle('menu-open', open);
                    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
                    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
                    var icon = toggle.querySelector('use');
                    if (icon) icon.setAttribute('href', open ? '#icon-close' : '#icon-menu');
                }
                toggle.addEventListener('click', function () {
                    setMenuOpen(!menu.classList.contains('active'));
                });
                document.addEventListener('keydown', function (e) {
                    if (e.key === 'Escape' && menu.classList.contains('active')) {
                        setMenuOpen(false);
                    }
                });
                menu.querySelectorAll('a').forEach(function (link) {
                    link.addEventListener('click', function () {
                        setMenuOpen(false);
                    });
                });
            }
        }).catch(function () {
            setActiveNav();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
