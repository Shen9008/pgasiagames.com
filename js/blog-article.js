/**
 * PG Asia Games — blog article: related posts + sidebar from /assets/data/blogs.json
 */
(function () {
    'use strict';

    var RELATED_FALLBACK_LIMIT = 3;
    var SIDEBAR_RECENT_LIMIT = 3;

    function sortLatestSyncFirst(a, b) {
        var tb = new Date(b.synced_at || b.published_date || 0).getTime();
        var ta = new Date(a.synced_at || a.published_date || 0).getTime();
        if (tb !== ta) return tb - ta;
        return String(b.slug).localeCompare(String(a.slug));
    }

    var slug = document.body.getAttribute('data-blog-slug') || '';
    var relatedAttr = document.body.getAttribute('data-related-slugs') || '';
    var wanted = relatedAttr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);

    var relatedSection = document.getElementById('related-posts');
    var relatedList = relatedSection ? relatedSection.querySelector('.blog-related-list') : null;
    var relatedPlaceholder = relatedSection ? relatedSection.querySelector('.blog-related-placeholder') : null;

    var sidebar = document.getElementById('sidebar-posts');

    fetch('/assets/data/blogs.json')
        .then(function (r) {
            return r.ok ? r.json() : [];
        })
        .then(function (posts) {
            if (!Array.isArray(posts)) posts = [];

            function entryFor(sl) {
                for (var i = 0; i < posts.length; i++) {
                    if (posts[i].slug === sl) return posts[i];
                }
                return null;
            }

            if (sidebar) {
                var recent = posts
                    .filter(function (p) { return p.slug && p.slug !== slug; })
                    .sort(sortLatestSyncFirst)
                    .slice(0, SIDEBAR_RECENT_LIMIT);

                sidebar.innerHTML = '';
                if (!recent.length) {
                    sidebar.innerHTML = '<li class="blog-sidebar-placeholder">More posts coming soon.</li>';
                } else {
                    recent.forEach(function (p) {
                        var li = document.createElement('li');
                        li.className = 'blog-sidebar-list__item';

                        var link = document.createElement('a');
                        link.className = 'blog-sidebar-list__link';
                        link.href = '/blog/' + encodeURIComponent(p.slug) + '/';

                        var span = document.createElement('span');
                        span.className = 'blog-sidebar-list__title';
                        span.textContent = p.title || p.slug;

                        link.appendChild(span);

                        var dateStr = '';
                        if (p.published_date) {
                            var d = new Date(p.published_date);
                            if (!isNaN(d.getTime())) {
                                dateStr = d.toLocaleDateString('en', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                });
                            }
                        }
                        if (dateStr) {
                            var dateEl = document.createElement('time');
                            dateEl.className = 'blog-sidebar-list__date';
                            dateEl.setAttribute('datetime', String(p.published_date));
                            dateEl.textContent = dateStr;
                            link.appendChild(dateEl);
                        }

                        li.appendChild(link);
                        sidebar.appendChild(li);
                    });
                }
            }

            if (relatedList && relatedPlaceholder) {
                var targets = [];
                wanted.forEach(function (sl) {
                    var e = entryFor(sl);
                    if (e) targets.push(e);
                });
                if (!targets.length) {
                    posts
                        .filter(function (p) { return p.slug && p.slug !== slug; })
                        .sort(sortLatestSyncFirst)
                        .slice(0, RELATED_FALLBACK_LIMIT)
                        .forEach(function (p) {
                            targets.push(p);
                        });
                }

                if (!targets.length) {
                    relatedPlaceholder.textContent = 'No related posts yet.';
                } else {
                    relatedPlaceholder.hidden = true;
                    relatedList.hidden = false;
                    relatedList.innerHTML = '';
                    targets.slice(0, 4).forEach(function (p) {
                        var li = document.createElement('li');
                        var a = document.createElement('a');
                        a.href = '/blog/' + encodeURIComponent(p.slug) + '/';
                        a.textContent = p.title || p.slug;
                        li.appendChild(a);
                        relatedList.appendChild(li);
                    });
                }
            }
        })
        .catch(function () { /* non-fatal */ });
})();
