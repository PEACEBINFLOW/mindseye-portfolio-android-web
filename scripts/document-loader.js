/* Loads XML documents and renders into a readable “seminar card” */

window.MindsEyeDocs = (() => {
  async function fetchText(path) {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load: ${path}`);
    return await res.text();
  }

  function escapeHtml(s) {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function parseXml(xmlText) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");
    const err = xml.querySelector("parsererror");
    if (err) throw new Error("XML parse error");
    return xml;
  }

  function xmlText(xml, selector, fallback = "") {
    const node = xml.querySelector(selector);
    return node ? node.textContent.trim() : fallback;
  }

  function xmlList(xml, selector) {
    return [...xml.querySelectorAll(selector)].map(n => n.textContent.trim()).filter(Boolean);
  }

  function renderDoc(xml, meta = {}) {
    const title = xmlText(xml, "doc > title", meta.title || "Document");
    const subtitle = xmlText(xml, "doc > subtitle", "");
    const repo = xmlText(xml, "doc > repo", meta.repo || "");
    const purpose = xmlText(xml, "doc > purpose", "");
    const concepts = xmlList(xml, "doc > concepts > item");
    const flows = xmlList(xml, "doc > flows > item");
    const codeblocks = [...xml.querySelectorAll("doc > code > block")].map(b => ({
      lang: b.getAttribute("lang") || "text",
      body: b.textContent.trim()
    }));

    const links = [...xml.querySelectorAll("doc > links > link")].map(l => ({
      label: l.getAttribute("label") || "Link",
      href: l.textContent.trim()
    }));

    const flowchart = xmlText(xml, "doc > flowchart", "");

    const conceptsHtml = concepts.length
      ? `<div class="divider"></div><div class="doc-h2">Core Concepts</div>${concepts.map(c => `<div class="doc-p">• ${escapeHtml(c)}</div>`).join("")}`
      : "";

    const flowsHtml = flows.length
      ? `<div class="divider"></div><div class="doc-h2">Workflow</div>${flows.map(f => `<div class="doc-p">→ ${escapeHtml(f)}</div>`).join("")}`
      : "";

    const codeHtml = codeblocks.length
      ? `<div class="divider"></div><div class="doc-h2">Code Examples</div>${codeblocks.map(cb => `
          <div class="badge">${escapeHtml(cb.lang)}</div>
          <pre class="code"><code>${escapeHtml(cb.body)}</code></pre>
        `).join("")}`
      : "";

    const linksHtml = links.length
      ? `<div class="divider"></div><div class="doc-h2">Links</div>${links.map(a => `
          <div class="doc-p"><a href="${escapeHtml(a.href)}" target="_blank" rel="noreferrer">${escapeHtml(a.label)}</a></div>
        `).join("")}`
      : "";

    const flowchartHtml = flowchart
      ? `<div class="divider"></div><div class="doc-h2">Flowchart</div>
         <div class="doc-p">Static diagram artifact:</div>
         <div class="doc-p"><a href="${escapeHtml(flowchart)}" target="_blank" rel="noreferrer">${escapeHtml(flowchart)}</a></div>`
      : "";

    return `
      <div class="card fade-in">
        <h1 class="doc-h1">${escapeHtml(title)}</h1>
        ${subtitle ? `<div class="doc-p">${escapeHtml(subtitle)}</div>` : ""}
        <div class="kv">
          <div class="k">Repository</div>
          <div class="v">${repo ? `<a href="${escapeHtml(repo)}" target="_blank" rel="noreferrer">${escapeHtml(repo)}</a>` : "—"}</div>
          <div class="k">Purpose</div>
          <div class="v">${escapeHtml(purpose || "—")}</div>
        </div>
        ${conceptsHtml}
        ${flowsHtml}
        ${codeHtml}
        ${flowchartHtml}
        ${linksHtml}
      </div>
    `;
  }

  async function loadDoc(path, meta) {
    const xmlTextData = await fetchText(path);
    const xml = parseXml(xmlTextData);
    return renderDoc(xml, meta);
  }

  return { loadDoc };
})();
