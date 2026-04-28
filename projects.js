/* ═══════════════════════════════════════════════
   PROJECTS PAGE — GitHub API
   Fetches all public repos and renders them as cards.

═══════════════════════════════════════════════ */
(function () {
  'use strict';

  // ─── CONFIG ───────────────────────────────────
  var GITHUB_USERNAME = 'dylanewe';
  // ──────────────────────────────────────────────

  var grid      = document.getElementById('repo-grid');
  var countEl   = document.getElementById('repo-count');
  var subtitle  = document.getElementById('repo-subtitle');
  var sortSel   = document.getElementById('sort-select');
  var hideForks = document.getElementById('hide-forks');

  var allRepos = [];

  // Language → rough color mapping (common languages only)
  var LANG_COLORS = {
    'JavaScript':  '#f1e05a',
    'TypeScript':  '#3178c6',
    'Python':      '#3572A5',
    'Go':          '#00ADD8',
    'Rust':        '#dea584',
    'Java':        '#b07219',
    'C':           '#555555',
    'C++':         '#f34b7d',
    'C#':          '#178600',
    'Ruby':        '#701516',
    'PHP':         '#4F5D95',
    'Swift':       '#F05138',
    'Kotlin':      '#A97BFF',
    'Dart':        '#00B4AB',
    'Shell':       '#89e051',
    'HTML':        '#e34c26',
    'CSS':         '#563d7c',
    'Vue':         '#41b883',
    'Svelte':      '#ff3e00',
    'Haskell':     '#5e5086',
    'Elixir':      '#6e4a7e',
    'Lua':         '#000080',
    'R':           '#198CE7',
  };

  function langColor(lang) {
    return lang && LANG_COLORS[lang] ? LANG_COLORS[lang] : 'rgba(255,255,255,0.25)';
  }

  function timeAgo(dateStr) {
    var now  = Date.now();
    var then = new Date(dateStr).getTime();
    var diff = Math.floor((now - then) / 1000);
    if (diff < 60)                  return 'just now';
    if (diff < 3600)                return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400)               return Math.floor(diff / 3600) + 'h ago';
    if (diff < 86400 * 30)          return Math.floor(diff / 86400) + 'd ago';
    if (diff < 86400 * 365)         return Math.floor(diff / (86400 * 30)) + 'mo ago';
    return Math.floor(diff / (86400 * 365)) + 'y ago';
  }

  function sortRepos(repos) {
    var by = sortSel.value;
    var copy = repos.slice();
    if (by === 'stars') {
      copy.sort(function (a, b) { return b.stargazers_count - a.stargazers_count; });
    } else if (by === 'name') {
      copy.sort(function (a, b) { return a.name.localeCompare(b.name); });
    } else {
      // updated (default)
      copy.sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); });
    }
    return copy;
  }

  function filterRepos(repos) {
    if (hideForks.checked) {
      return repos.filter(function (r) { return !r.fork; });
    }
    return repos;
  }

  function renderCard(repo) {
    var card = document.createElement('a');
    card.className = 'repo-card';
    card.href = repo.html_url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', repo.name);

    var desc = repo.description
      ? escapeHtml(repo.description)
      : '<em style="opacity:0.35">no description</em>';

    var langHtml = repo.language
      ? '<span class="repo-lang"><span class="lang-dot" style="background:' + langColor(repo.language) + '"></span>' + escapeHtml(repo.language) + '</span>'
      : '';

    var starsHtml = repo.stargazers_count > 0
      ? '<span class="repo-stat">★ ' + repo.stargazers_count + '</span>'
      : '';

    var forksHtml = repo.forks_count > 0
      ? '<span class="repo-stat"><svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style="opacity:.5"><path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm3-8.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z"/></svg> ' + repo.forks_count + '</span>'
      : '';

    var forkBadge = repo.fork ? '<span class="fork-badge">fork</span>' : '';

    card.innerHTML =
      '<div class="repo-name">' + escapeHtml(repo.name) + ' ' + forkBadge + '</div>' +
      '<div class="repo-desc">' + desc + '</div>' +
      '<div class="repo-meta">' +
        langHtml +
        starsHtml +
        forksHtml +
        '<span class="repo-updated">' + timeAgo(repo.pushed_at) + '</span>' +
      '</div>';

    return card;
  }

  function render() {
    var repos = filterRepos(sortRepos(allRepos));

    grid.innerHTML = '';

    if (repos.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'repo-error';
      empty.textContent = 'no repositories match the current filter.';
      grid.appendChild(empty);
      countEl.textContent = '0 repos';
      return;
    }

    var frag = document.createDocumentFragment();
    repos.forEach(function (repo) {
      frag.appendChild(renderCard(repo));
    });
    grid.appendChild(frag);

    var total = allRepos.length;
    var shown = repos.length;
    countEl.textContent = shown === total
      ? total + ' repos'
      : shown + ' / ' + total + ' repos';
  }

  function showError(msg, detail) {
    grid.innerHTML = '';
    var el = document.createElement('div');
    el.className = 'repo-error';
    el.innerHTML = msg + (detail ? '<code>' + escapeHtml(detail) + '</code>' : '');
    grid.appendChild(el);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fetchAllRepos(username, page, accumulated) {
    var url = 'https://api.github.com/users/' + encodeURIComponent(username) +
              '/repos?sort=pushed&per_page=100&page=' + page;

    fetch(url)
      .then(function (res) {
        if (!res.ok) {
          if (res.status === 404) throw new Error('GitHub user "' + username + '" not found. Check GITHUB_USERNAME in projects.js.');
          if (res.status === 403) throw new Error('GitHub API rate limit hit. Try again in a minute.');
          throw new Error('GitHub API error: ' + res.status);
        }

        // Check Link header for pagination
        var linkHeader = res.headers.get('Link') || '';
        var hasNext = linkHeader.indexOf('rel="next"') !== -1;

        return res.json().then(function (data) {
          return { data: data, hasNext: hasNext };
        });
      })
      .then(function (result) {
        var combined = accumulated.concat(result.data);
        if (result.hasNext) {
          // Recurse for next page
          fetchAllRepos(username, page + 1, combined);
        } else {
          allRepos = combined;
          subtitle.textContent = '@' + username;
          render();
        }
      })
      .catch(function (err) {
        subtitle.textContent = 'error';
        showError('Could not load repositories.', err.message);
      });
  }

  // ─── INIT ─────────────────────────────────────
  if (GITHUB_USERNAME === 'YOUR_GITHUB_USERNAME') {
    subtitle.textContent = 'not configured';
    showError(
      'Set your GitHub username to load repos.',
      'Open projects.js and replace YOUR_GITHUB_USERNAME with your actual GitHub username.'
    );
  } else {
    fetchAllRepos(GITHUB_USERNAME, 1, []);
  }

  sortSel.addEventListener('change', render);
  hideForks.addEventListener('change', render);

}());
