/* ============================================================
   companies.js — render drive listing, filter by branch/package/
   status, search by name/role, sort by deadline or package.
   ============================================================ */

initHeaderInteractions();

const els = {
  search: document.getElementById("fSearch"),
  branch: document.getElementById("fBranch"),
  pkg: document.getElementById("fPackage"),
  status: document.getElementById("fStatus"),
  sort: document.getElementById("fSort"),
  grid: document.getElementById("companyGrid"),
  count: document.getElementById("resultCount"),
};

function applyFiltersAndRender() {
  let list = getCompanies();

  const q = els.search.value.trim().toLowerCase();
  if (q) {
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)
    );
  }

  if (els.branch.value) {
    list = list.filter(c => c.branches.includes(els.branch.value));
  }

  const minPkg = parseFloat(els.pkg.value) || 0;
  if (minPkg > 0) {
    list = list.filter(c => c.package >= minPkg);
  }

  if (els.status.value) {
    list = list.filter(c => c.status === els.status.value);
  }

  switch (els.sort.value) {
    case "package-desc":
      list = list.slice().sort((a, b) => b.package - a.package);
      break;
    case "package-asc":
      list = list.slice().sort((a, b) => a.package - b.package);
      break;
    default:
      list = list.slice().sort((a, b) => daysLeft(a.deadline) - daysLeft(b.deadline));
  }

  render(list);
}

function render(list) {
  els.count.textContent = `${list.length} drive${list.length === 1 ? "" : "s"} found`;

  if (!list.length) {
    els.grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="icon">🔍</div>No drives match your filters.</div>`;
    return;
  }

  els.grid.innerHTML = list.map(c => {
    const dl = deadlineLabel(c.deadline);
    return `
      <a href="company-detail.html?id=${c.id}" class="card company-card">
        <div class="company-card-top">
          <div class="logo-chip">${c.initials}</div>
          <div>
            <div class="company-card-name">${c.name}</div>
            <div class="company-card-role">${c.role} · ${c.location}</div>
          </div>
        </div>
        <div class="company-card-tags">
          ${c.branches.map(b => `<span class="tag">${b}</span>`).join("")}
          <span class="tag">CGPA ${c.minCgpa}+</span>
        </div>
        <div class="company-card-bottom">
          <span class="company-card-pkg">₹${c.package} LPA</span>
          <span class="badge ${c.status === 'open' ? dl.cls : 'badge-closed'}">${c.status === 'open' ? dl.text : 'Closed'}</span>
        </div>
      </a>
    `;
  }).join("");
}

[els.search, els.branch, els.pkg, els.status, els.sort].forEach(el => {
  el.addEventListener("input", applyFiltersAndRender);
  el.addEventListener("change", applyFiltersAndRender);
});

applyFiltersAndRender();
