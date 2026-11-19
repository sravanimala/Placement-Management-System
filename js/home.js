/* ============================================================
   home.js — announcements, upcoming drives, quick stats.
   ============================================================ */

initHeaderInteractions();

function renderStats() {
  const companies = getCompanies();
  const students = getStudents();
  const openDrives = companies.filter(c => c.status === "open").length;
  const totalApplications = students.reduce((sum, s) => sum + s.applications.length, 0);
  const offers = students.reduce(
    (sum, s) => sum + s.applications.filter(a => a.status === "Offered").length, 0
  );
  const avgPackage = companies.length
    ? (companies.reduce((sum, c) => sum + c.package, 0) / companies.length).toFixed(1)
    : "0.0";

  const stats = [
    { label: "Open Drives", value: openDrives },
    { label: "Registered Students", value: students.length },
    { label: "Applications Sent", value: totalApplications },
    { label: "Offers Made", value: offers },
  ];

  document.getElementById("statsGrid").innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join("");
}

function renderUpcoming() {
  const companies = getCompanies()
    .filter(c => c.status === "open" && daysLeft(c.deadline) >= 0)
    .sort((a, b) => daysLeft(a.deadline) - daysLeft(b.deadline))
    .slice(0, 3);

  const grid = document.getElementById("upcomingGrid");
  if (!companies.length) {
    grid.innerHTML = `<div class="empty-state"><div class="icon">📭</div>No upcoming drives right now.</div>`;
    return;
  }

  grid.innerHTML = companies.map(c => {
    const dl = deadlineLabel(c.deadline);
    return `
      <a href="company-detail.html?id=${c.id}" class="card mini-card">
        <div class="mini-card-top">
          <div class="logo-chip">${c.initials}</div>
          <div>
            <div class="mini-card-name">${c.name}</div>
            <div class="mini-card-role">${c.role}</div>
          </div>
        </div>
        <div class="mini-card-meta">
          <span class="mini-card-pkg">₹${c.package} LPA</span>
          <span class="badge ${dl.cls}">${dl.text}</span>
        </div>
      </a>
    `;
  }).join("");
}

function renderAnnouncements() {
  const companies = getCompanies();
  const items = [
    { dt: "Today", text: `${companies.filter(c => c.status === "open").length} placement drives currently accepting applications.` },
    ...companies
      .filter(c => c.status === "open")
      .sort((a, b) => daysLeft(a.deadline) - daysLeft(b.deadline))
      .slice(0, 3)
      .map(c => ({ dt: formatDate(c.deadline), text: `${c.name} — application deadline for ${c.role}.` }))
  ];

  document.getElementById("announceList").innerHTML = items.map(i => `
    <li class="announce-item"><span class="dt">${i.dt}</span><span>${i.text}</span></li>
  `).join("");
}

renderStats();
renderUpcoming();
renderAnnouncements();
