/* App bootstrap + routing */

(async function () {
  const screen = document.getElementById("screen-content");
  const loading = document.getElementById("loading-screen");

  function setTitle(t) {
    const el = document.getElementById("status-title");
    if (el) el.textContent = t;
  }

  function nowTime() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  function updateStatus() {
    const timeEl = document.getElementById("status-time");
    if (timeEl) timeEl.textContent = nowTime();
  }

  setInterval(updateStatus, 30000);
  updateStatus();

  const apps = await MindsEyeLauncher.getApps();
  const appIndex = Object.fromEntries(apps.map(a => [a.appId, a]));

  function renderHome(query = "") {
    setTitle("MindsEye OS");
    screen.innerHTML = MindsEyeLauncher.buildLauncher(apps, query);
    wireLauncher();
  }

  function renderRecents() {
    setTitle("Recents");
    const items = MindsEyeNav.getRecents();
    const cards = items.map(r => {
      if (r.type === "home") return "";
      const app = appIndex[r.appId];
      if (!app) return "";
      return `
        <div class="card fade-in" style="margin:12px">
          <div class="doc-h2">${app.title}</div>
          <div class="doc-p">${(app.tags || []).join(" · ")}</div>
          <button class="icon-btn" data-open="${app.appId}">Open</button>
        </div>
      `;
    }).join("");

    screen.innerHTML = `<div class="doc-view">${cards || `<div class="doc-p" style="padding:16px;color:rgba(148,163,184,.95)">No recent apps yet.</div>`}</div>`;
    screen.querySelectorAll("[data-open]").forEach(btn => {
      btn.addEventListener("click", () => openApp(btn.getAttribute("data-open")));
    });
  }

  async function renderApp(appId) {
    const app = appIndex[appId];
    if (!app) {
      screen.innerHTML = `<div class="doc-view"><div class="card">App not found.</div></div>`;
      return;
    }

    setTitle(app.title);

    let contentHtml = "";
    if (app.kind === "doc") {
      contentHtml = await MindsEyeDocs.loadDoc(app.document, { title: app.title, repo: app.repo });
    } else if (app.kind === "page") {
      // loads an internal HTML app screen
      const res = await fetch(app.page, { cache: "no-cache" });
      contentHtml = await res.text();
    } else {
      contentHtml = `<div class="card">Unknown app type.</div>`;
    }

    screen.innerHTML = `
      <div class="app-screen slide-in">
        <div class="app-topbar">
          <div class="app-title">${app.title}</div>
          <div class="app-actions">
            ${app.repo ? `<a class="icon-btn" href="${app.repo}" target="_blank" rel="noreferrer">Repo</a>` : ""}
            ${app.document ? `<a class="icon-btn" href="${app.document}" target="_blank" rel="noreferrer">XML</a>` : ""}
          </div>
        </div>
        <div class="doc-view">
          ${contentHtml}
        </div>
      </div>
    `;

    // If page content includes internal open links
    screen.querySelectorAll("[data-open-app]").forEach(el => {
      el.addEventListener("click", () => openApp(el.getAttribute("data-open-app")));
    });
  }

  function openApp(appId) {
    MindsEyeNav.push({ type: "app", appId });
    renderApp(appId).catch(err => {
      screen.innerHTML = `<div class="doc-view"><div class="card">Failed to open app: ${String(err)}</div></div>`;
    });
  }

  function wireLauncher() {
    const input = document.getElementById("launcher-search");
    if (input) {
      input.addEventListener("input", () => renderHome(input.value));
    }

    screen.querySelectorAll(".app-tile").forEach(tile => {
      tile.addEventListener("click", () => {
        const appId = tile.getAttribute("data-app");
        openApp(appId);
      });
    });
  }

  // Nav buttons
  document.getElementById("nav-back").addEventListener("click", () => {
    const route = MindsEyeNav.back();
    if (!route || route.type === "home") renderHome();
    else if (route.type === "app") renderApp(route.appId);
  });

  document.getElementById("nav-home").addEventListener("click", () => {
    MindsEyeNav.home();
    renderHome();
  });

  document.getElementById("nav-recents").addEventListener("click", () => {
    renderRecents();
  });

  // Gestures
  MindsEyeGestures.attach(document.getElementById("android-device"), () => {
    const route = MindsEyeNav.back();
    if (!route || route.type === "home") renderHome();
    else if (route.type === "app") renderApp(route.appId);
  }, () => {
    MindsEyeNav.home();
    renderHome();
  });

  // Start
  MindsEyeNav.home();
  renderHome();
  loading.style.display = "none";
})();
