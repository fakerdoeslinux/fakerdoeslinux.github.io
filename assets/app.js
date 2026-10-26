/* BlackOnBlue — project site behaviour. No dependencies. */
(function () {
  "use strict";

  const projects = window.PROJECTS || [];
  const pinGrid = document.getElementById("pin-grid");
  const repoList = document.getElementById("repo-list");
  const searchInput = document.getElementById("repo-search");
  const langFilters = document.getElementById("lang-filters");
  const repoCount = document.getElementById("repo-count");
  const emptyState = document.getElementById("empty-state");
  const clearButton = document.getElementById("clear-filters");
  const dialog = document.getElementById("repo-dialog");
  const dialogContent = document.getElementById("dialog-content");

  const state = { query: "", lang: "All" };
  const rows = [];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Helpers --------------------------------------------------- */

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function icon(name, className) {
    return (
      '<svg class="' +
      (className || "icon") +
      '" aria-hidden="true"><use href="#' +
      name +
      '"/></svg>'
    );
  }

  function githubUrl(project) {
    return "https://github.com/" + project.owner + "/" + project.repo;
  }

  function cloneUrl(project) {
    return githubUrl(project) + ".git";
  }

  function languageDot(project) {
    return (
      '<span class="lang"><i style="--dot:' +
      esc(project.languageColor) +
      '"></i>' +
      esc(project.language) +
      "</span>"
    );
  }

  function timeAgo(iso) {
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return "recently";
    const days = Math.floor((Date.now() - then) / 86400000);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 30) return days + " days ago";
    if (days < 365) {
      const months = Math.floor(days / 30);
      return months + (months === 1 ? " month ago" : " months ago");
    }
    const years = Math.floor(days / 365);
    return years + (years === 1 ? " year ago" : " years ago");
  }

  function fullDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "Unknown";
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    }).format(date);
  }

  function tagList(tags) {
    if (!tags || !tags.length) return "";
    return (
      '<ul class="tags">' +
      tags.map((tag) => "<li>" + esc(tag) + "</li>").join("") +
      "</ul>"
    );
  }

  function sortedProjects() {
    return projects.slice().sort(function (a, b) {
      return new Date(b.pushedAt) - new Date(a.pushedAt);
    });
  }

  /* ---------- Pinned cards ---------------------------------------------- */

  function renderPins() {
    pinGrid.innerHTML = projects
      .map(function (project, index) {
        return (
          '<article class="pin-card reveal" data-repo="' +
          esc(project.id) +
          '" style="--delay:' +
          index * 60 +
          'ms">' +
          '<div class="pin-head">' +
          '<span class="repo-mark">' +
          icon("icon-" + project.icon) +
          "</span>" +
          '<a class="pin-title" href="' +
          esc(githubUrl(project)) +
          '" target="_blank" rel="noopener" title="' +
          esc(project.owner + "/" + project.repo) +
          '">' +
          esc(project.name) +
          icon("i-arrow-up-right") +
          "</a>" +
          '<span class="badge">Public</span>' +
          "</div>" +
          '<p class="pin-desc">' +
          esc(project.description) +
          "</p>" +
          tagList(project.tags.slice(0, 4)) +
          '<div class="pin-foot">' +
          languageDot(project) +
          '<span class="stat" title="Stars">' +
          icon("i-star") +
          project.stars +
          "</span>" +
          '<span class="stat" title="Forks">' +
          icon("i-fork") +
          project.forks +
          "</span>" +
          '<button class="pin-open" type="button" data-open="' +
          esc(project.id) +
          '">Overview' +
          icon("i-arrow-right") +
          "</button>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  /* ---------- Repository rows ------------------------------------------- */

  function renderRows() {
    repoList.innerHTML = sortedProjects()
      .map(function (project) {
        return (
          '<li class="repo-row" data-repo="' +
          esc(project.id) +
          '">' +
          '<div class="repo-main">' +
          '<div class="repo-title-row">' +
          '<a class="repo-name" href="' +
          esc(githubUrl(project)) +
          '" target="_blank" rel="noopener">' +
          esc(project.name) +
          "</a>" +
          '<span class="badge">Public</span>' +
          "</div>" +
          '<p class="repo-desc">' +
          esc(project.description) +
          "</p>" +
          tagList(project.tags) +
          '<div class="repo-meta">' +
          languageDot(project) +
          '<span class="stat" title="Stars">' +
          icon("i-star") +
          project.stars +
          "</span>" +
          '<span class="stat" title="Forks">' +
          icon("i-fork") +
          project.forks +
          "</span>" +
          (project.license ? "<span>" + esc(project.license) + "</span>" : "") +
          '<span title="Last push">Updated ' +
          esc(timeAgo(project.pushedAt)) +
          "</span>" +
          "</div>" +
          "</div>" +
          '<div class="repo-actions">' +
          '<button class="btn btn-quiet" type="button" data-open="' +
          esc(project.id) +
          '">Overview</button>' +
          '<a class="icon-btn" href="' +
          esc(githubUrl(project)) +
          '" target="_blank" rel="noopener" aria-label="Open ' +
          esc(project.name) +
          ' on GitHub">' +
          icon("i-arrow-up-right") +
          "</a>" +
          "</div>" +
          "</li>"
        );
      })
      .join("");

    repoList.querySelectorAll(".repo-row").forEach(function (row) {
      const project = projects.find(function (item) {
        return item.id === row.dataset.repo;
      });
      if (!project) return;
      rows.push({
        el: row,
        lang: project.language,
        search: [
          project.name,
          project.repo,
          project.owner,
          project.description,
          project.about,
          project.language,
          project.tags.join(" ")
        ]
          .join(" ")
          .toLowerCase()
      });
    });
  }

  /* ---------- Filters --------------------------------------------------- */

  function renderLanguageFilters() {
    const languages = [];
    projects.forEach(function (project) {
      if (languages.indexOf(project.language) === -1) {
        languages.push(project.language);
      }
    });

    const options = ["All"].concat(languages);
    langFilters.innerHTML = options
      .map(function (language) {
        return (
          '<button class="chip" type="button" data-lang="' +
          esc(language) +
          '" aria-pressed="' +
          (language === state.lang ? "true" : "false") +
          '">' +
          esc(language) +
          "</button>"
        );
      })
      .join("");
  }

  function applyFilters() {
    const query = state.query.trim().toLowerCase();
    let visible = 0;

    rows.forEach(function (row) {
      const matchesQuery = !query || row.search.indexOf(query) !== -1;
      const matchesLang = state.lang === "All" || row.lang === state.lang;
      const show = matchesQuery && matchesLang;
      row.el.hidden = !show;
      if (show) visible += 1;
    });

    repoCount.textContent = String(visible);
    emptyState.hidden = visible !== 0;
    repoList.hidden = visible === 0;
  }

  function setLanguage(language) {
    state.lang = language;
    langFilters.querySelectorAll(".chip").forEach(function (chip) {
      chip.setAttribute("aria-pressed", chip.dataset.lang === language ? "true" : "false");
    });
    applyFilters();
  }

  function clearFilters() {
    state.query = "";
    searchInput.value = "";
    setLanguage("All");
    searchInput.focus();
  }

  /* ---------- Dialog ---------------------------------------------------- */

  function renderDialog(project) {
    const primaryHref = project.liveUrl || githubUrl(project);
    const copyKind = project.liveUrl ? "url" : "clone";
    const copyLabel = project.liveUrl ? "Copy play link" : "Copy clone URL";

    const badges = [
      '<li><span class="badge">Public</span></li>',
      "<li>" + languageDot(project) + "</li>",
      "<li>" + (project.license ? esc(project.license) + " license" : "No license") + "</li>",
      "<li>" + icon("i-clock") + "Updated " + esc(timeAgo(project.pushedAt)) + "</li>"
    ].join("");

    const highlights = project.highlights
      .map(function (item) {
        return "<li>" + esc(item) + "</li>";
      })
      .join("");

    const liveButton = project.liveUrl
      ? '<a class="btn btn-ghost" href="' +
        esc(githubUrl(project)) +
        '" target="_blank" rel="noopener">GitHub' +
        icon("i-arrow-up-right") +
        "</a>"
      : "";

    return (
      '<div class="dlg-top">' +
      '<span class="repo-mark lg">' +
      icon("icon-" + project.icon) +
      "</span>" +
      '<div class="dlg-heading">' +
      '<p class="dlg-path">' +
      esc(project.owner + " / " + project.repo) +
      "</p>" +
      '<h2 id="dlg-title">' +
      esc(project.name) +
      "</h2>" +
      "</div>" +
      '<button class="icon-btn dlg-close" type="button" data-close aria-label="Close overview">' +
      icon("i-close") +
      "</button>" +
      "</div>" +
      '<p class="dlg-tagline">' +
      esc(project.tagline) +
      "</p>" +
      '<ul class="dlg-badges">' +
      badges +
      "</ul>" +
      '<p class="dlg-about">' +
      esc(project.about) +
      "</p>" +
      '<div class="dlg-actions">' +
      '<a class="btn btn-primary" href="' +
      esc(primaryHref) +
      '" target="_blank" rel="noopener">' +
      esc(project.primaryLabel) +
      icon("i-arrow-up-right") +
      "</a>" +
      liveButton +
      '<button class="btn btn-quiet" type="button" data-copy-kind="' +
      copyKind +
      '" data-repo-id="' +
      esc(project.id) +
      '">' +
      icon("i-copy") +
      '<span class="copy-label">' +
      copyLabel +
      "</span></button>" +
      "</div>" +
      "<h3>Highlights</h3>" +
      '<ul class="checks">' +
      highlights +
      "</ul>" +
      "<h3>" +
      esc(project.commandLabel) +
      "</h3>" +
      '<div class="code-block">' +
      '<pre><code>' +
      esc(project.command) +
      "</code></pre>" +
      '<button class="code-copy" type="button" data-copy-kind="command" data-repo-id="' +
      esc(project.id) +
      '">' +
      icon("i-copy") +
      '<span class="copy-label">Copy</span></button>' +
      "</div>" +
      (project.note ? '<p class="note">' + esc(project.note) + "</p>" : "") +
      "<h3>Details</h3>" +
      '<dl class="facts">' +
      "<div><dt>Language</dt><dd>" +
      esc(project.language) +
      "</dd></div>" +
      "<div><dt>License</dt><dd>" +
      (project.license ? esc(project.license) : "Not specified") +
      "</dd></div>" +
      "<div><dt>Default branch</dt><dd><code>" +
      esc(project.branch) +
      "</code></dd></div>" +
      "<div><dt>Last push</dt><dd>" +
      esc(fullDate(project.pushedAt)) +
      "</dd></div>" +
      "<div><dt>Owner</dt><dd><a href=\"https://github.com/" +
      esc(project.owner) +
      '" target="_blank" rel="noopener">@' +
      esc(project.owner) +
      "</a></dd></div>" +
      "<div><dt>Stars</dt><dd>" +
      project.stars +
      "</dd></div>" +
      "</dl>" +
      '<p class="dlg-topic-label">Tags</p>' +
      tagList(project.tags)
    );
  }

  function openProject(id) {
    const project = projects.find(function (item) {
      return item.id === id;
    });
    if (!project || !dialog || typeof dialog.showModal !== "function") return;
    dialogContent.innerHTML = renderDialog(project);
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add("dialog-open");
  }

  function closeProject() {
    if (!dialog || !dialog.open) return;
    dialog.close();
    document.body.classList.remove("dialog-open");
    dialogContent.innerHTML = "";
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      /* fall through to the textarea fallback */
    }

    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch (error) {
      return false;
    }
  }

  function copyTextFor(kind, project) {
    if (kind === "command") return project.command;
    if (kind === "url") return project.liveUrl || githubUrl(project);
    return "git clone " + cloneUrl(project);
  }

  /* ---------- Wiring ---------------------------------------------------- */

  renderPins();
  renderRows();
  renderLanguageFilters();
  applyFilters();

  const stats = document.querySelectorAll("[data-stat]");
  stats.forEach(function (el) {
    const kind = el.dataset.stat;
    if (kind === "projects") el.textContent = String(projects.length).padStart(2, "0");
    if (kind === "mit") {
      const count = projects.filter(function (project) {
        return project.license === "MIT";
      }).length;
      el.textContent = String(count).padStart(2, "0");
    }
  });

  searchInput.addEventListener("input", function (event) {
    state.query = event.target.value;
    applyFilters();
  });

  langFilters.addEventListener("click", function (event) {
    const chip = event.target.closest("[data-lang]");
    if (chip) setLanguage(chip.dataset.lang);
  });

  clearButton.addEventListener("click", clearFilters);

  document.addEventListener("click", function (event) {
    const opener = event.target.closest("[data-open]");
    if (opener) {
      openProject(opener.dataset.open);
      return;
    }

    const card = event.target.closest(".pin-card");
    if (card && !event.target.closest("a, button")) {
      openProject(card.dataset.repo);
    }
  });

  if (dialog) {
    // Some engines do not deliver the native `close` event; close explicitly
    // so the page never stays scroll-locked.
    dialog.addEventListener("cancel", function (event) {
      event.preventDefault();
      closeProject();
    });

    dialog.addEventListener("click", async function (event) {
      if (event.target === dialog) {
        closeProject();
        return;
      }

      if (event.target.closest("[data-close]")) {
        closeProject();
        return;
      }

      const button = event.target.closest("[data-copy-kind]");
      if (!button) return;

      const project = projects.find(function (item) {
        return item.id === button.dataset.repoId;
      });
      if (!project) return;

      const label = button.querySelector(".copy-label") || button;
      const original = label.textContent;
      const ok = await copyToClipboard(copyTextFor(button.dataset.copyKind, project));

      if (!ok) {
        label.textContent = "Select and copy";
        return;
      }

      label.textContent = "Copied";
      button.classList.add("is-done");
      window.setTimeout(function () {
        label.textContent = original;
        button.classList.remove("is-done");
      }, 1500);
    });

    dialog.addEventListener("close", function () {
      document.body.classList.remove("dialog-open");
      dialogContent.innerHTML = "";
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Reveal on scroll ------------------------------------------ */

  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in");
    });
  } else {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px" }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
      observer.observe(el);
    });
  }
})();
