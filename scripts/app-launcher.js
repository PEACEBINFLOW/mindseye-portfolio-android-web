/* Home + App Drawer builder */

window.MindsEyeLauncher = (() => {
  async function loadJson(path) {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed JSON: ${path}`);
    return await res.json();
  }

  function buildTile(app) {
    return `
      <div class="app-tile" data-app="${app.appId}">
        <div class="app-icon">
          <img src="${app.icon}" alt="${app.title}">
        </div>
        <div class="app-label">${app.title}</div>
      </div>
    `;
  }

  function buildLauncher(apps, query = "") {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? apps.filter(a =>
          a.title.toLowerCase().includes(q) ||
          (a.tags || []).some(t => t.toLowerCase().includes(q))
        )
      : apps;

    return `
      <div class="launcher slide-in">
        <div class="launcher-header">
          <div class="launcher-title">MindsEye Android OS</div>
          <div class="launcher-sub">
            Educational simulation: each “app” is a repository document. Navigation mimics Android.
          </div>
          <div class="searchbar">
            <input id="launcher-search" placeholder="Search apps, repos, lessons..." value="${q ? q : ""}" />
          </div>
        </div>
        <div class="grid">
          ${filtered.map(buildTile).join("")}
        </div>
      </div>
    `;
  }

  async function getApps() {
    const map = await loadJson("documents/metadata/57_repos-map.json");
    const lessons = await loadJson("documents/metadata/58_app-categories.json");
    // lessons file also stores tutorial app entries; we merge for simplicity
    const apps = [...map.apps, ...lessons.tutorialApps];
    return apps;
  }

  return { buildLauncher, getApps };
})();
