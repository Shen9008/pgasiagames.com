/**
 * PG Asia Games — blog index: cards from /assets/data/blogs.json
 * Pagination: 6 posts per page, URL ?page=N (page 1 = /blog/)
 */
(function () {
    'use strict';

    var PER_PAGE = 6;
    var LIST_PATH = '/blog/';
    var BLOG_DEFAULT_IMAGE = '/assets/img/blog-default.png';

    function postImage(p) {
        var img = (p && p.image ? String(p.image) : '').trim();
        return img || BLOG_DEFAULT_IMAGE;
    }

    var grid = document.getElementById('blog-articles-root');
    var paginationEl = document.getElementById('blog-pagination');
    if (!grid) return;

    function getCurrentPage() {
        var params = new URLSearchParams(window.location.search);
        var n = parseInt(params.get('page'), 10);
        if (!Number.isFinite(n) || n < 1) return 1;
        return n;
    }

    function pageHref(page) {
        if (page <= 1) return LIST_PATH;
        return LIST_PATH + '?page=' + page;
    }

    function resolvePageNums(current, total) {
        var pages = [];
        var i;
        if (total <= 8) {
            for (i = 1; i <= total; i++) pages.push(i);
            return pages;
        }
        pages.push(1);
        var start = Math.max(2, current - 1);
        var end = Math.min(total - 1, current + 1);
        if (start > 2) pages.push(0);
        for (i = start; i <= end; i++) pages.push(i);
        if (end < total - 1) pages.push(0);
        pages.push(total);
        return pages;
    }

    function createCard(p) {
        var a = document.createElement('a');
        a.className = 'blog-article-card';
        a.href = '/blog/' + encodeURIComponent(p.slug) + '/';

        var imgWrap = document.createElement('div');
        imgWrap.className = 'blog-article-card__image';

        var img = document.createElement('img');
        img.src = postImage(p);
        img.alt = p.title || p.slug || 'Blog article';
        img.loading = 'lazy';
        img.decoding = 'async';
        imgWrap.appendChild(img);

        var content = document.createElement('div');
        content.className = 'blog-article-card__content';

        var cat = document.createElement('span');
        cat.className = 'blog-article-card__category';
        cat.textContent = p.category || 'Article';

        var title = document.createElement('h2');
        title.className = 'blog-article-card__title';
        title.textContent = p.title || p.slug;

        var ex = document.createElement('p');
        ex.className = 'blog-article-card__excerpt';
        ex.textContent = p.excerpt || p.meta_description || '';

        content.appendChild(cat);
        content.appendChild(title);
        content.appendChild(ex);
        a.appendChild(imgWrap);
        a.appendChild(content);
        return a;
    }

    function renderPagination(page, totalPages) {
        if (!paginationEl) return;

        if (totalPages <= 1) {
            paginationEl.hidden = true;
            paginationEl.innerHTML = '';
            paginationEl.removeAttribute('aria-label');
            return;
        }

        paginationEl.hidden = false;
        paginationEl.innerHTML = '';
        paginationEl.setAttribute(
            'aria-label',
            'Blog pagination, page ' + page + ' of ' + totalPages,
        );

        var nav = document.createElement('div');
        nav.className = 'blog-pagination__inner';

        var row = document.createElement('div');
        row.className = 'blog-pagination__row';

        var prevWrap = document.createElement('div');
        prevWrap.className = 'blog-pagination__prev';
        if (page <= 1) {
            var prevSpan = document.createElement('span');
            prevSpan.className = 'blog-pagination__link blog-pagination__link--disabled';
            prevSpan.setAttribute('aria-disabled', 'true');
            prevSpan.textContent = 'Previous';
            prevWrap.appendChild(prevSpan);
        } else {
            var prevA = document.createElement('a');
            prevA.className = 'blog-pagination__link';
            prevA.href = pageHref(page - 1);
            prevA.rel = 'prev';
            prevA.textContent = 'Previous';
            prevWrap.appendChild(prevA);
        }
        row.appendChild(prevWrap);

        var list = document.createElement('ul');
        list.className = 'blog-pagination__pages';
        resolvePageNums(page, totalPages).forEach(function (num) {
            var li = document.createElement('li');
            if (num === 0) {
                li.className = 'blog-pagination__ellipsis';
                li.setAttribute('aria-hidden', 'true');
                li.textContent = '…';
                list.appendChild(li);
                return;
            }
            if (num === page) {
                var cur = document.createElement('span');
                cur.className = 'blog-pagination__link blog-pagination__link--current';
                cur.setAttribute('aria-current', 'page');
                cur.textContent = String(num);
                li.appendChild(cur);
            } else {
                var link = document.createElement('a');
                link.className = 'blog-pagination__link';
                link.href = pageHref(num);
                link.textContent = String(num);
                li.appendChild(link);
            }
            list.appendChild(li);
        });
        row.appendChild(list);

        var nextWrap = document.createElement('div');
        nextWrap.className = 'blog-pagination__next';
        if (page >= totalPages) {
            var nextSpan = document.createElement('span');
            nextSpan.className = 'blog-pagination__link blog-pagination__link--disabled';
            nextSpan.setAttribute('aria-disabled', 'true');
            nextSpan.textContent = 'Next';
            nextWrap.appendChild(nextSpan);
        } else {
            var nextA = document.createElement('a');
            nextA.className = 'blog-pagination__link';
            nextA.href = pageHref(page + 1);
            nextA.rel = 'next';
            nextA.textContent = 'Next';
            nextWrap.appendChild(nextA);
        }
        row.appendChild(nextWrap);

        nav.appendChild(row);
        paginationEl.appendChild(nav);
    }

    function sortLatestSyncFirst(a, b) {
        var tb = new Date(b.synced_at || b.published_date || 0).getTime();
        var ta = new Date(a.synced_at || a.published_date || 0).getTime();
        if (tb !== ta) return tb - ta;
        return String(b.slug).localeCompare(String(a.slug));
    }

    function render(posts) {
        var sorted = posts
            .filter(function (p) {
                return p && p.slug;
            })
            .sort(sortLatestSyncFirst);

        if (sorted.length === 0) {
            grid.innerHTML =
                '<p class="blog-empty">No articles yet — run <code>npm run sync</code> after configuring <code>.env</code> or <code>.env.local</code> (see steps.md).</p>';
            if (paginationEl) {
                paginationEl.hidden = true;
                paginationEl.innerHTML = '';
            }
            grid.setAttribute('aria-busy', 'false');
            return;
        }

        var totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
        var page = getCurrentPage();
        if (page > totalPages) {
            window.location.replace(pageHref(totalPages));
            return;
        }

        var start = (page - 1) * PER_PAGE;
        var slice = sorted.slice(start, start + PER_PAGE);

        grid.innerHTML = '';
        slice.forEach(function (p) {
            grid.appendChild(createCard(p));
        });

        renderPagination(page, totalPages);
        grid.setAttribute('aria-busy', 'false');
    }

    fetch('/assets/data/blogs.json')
        .then(function (r) {
            if (!r.ok) throw new Error('blogs.json HTTP ' + r.status);
            return r.json();
        })
        .then(function (posts) {
            if (!Array.isArray(posts)) posts = [];
            render(posts);
        })
        .catch(function () {
            grid.innerHTML =
                '<p class="blog-empty">Could not load articles. Check that <code>assets/data/blogs.json</code> exists.</p>';
            if (paginationEl) {
                paginationEl.hidden = true;
                paginationEl.innerHTML = '';
            }
            grid.setAttribute('aria-busy', 'false');
        });
})();
