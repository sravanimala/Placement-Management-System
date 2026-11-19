/* ============================================================
   admin-dashboard.js — applicant list across all drives (with
   status updates), manage/add drives, and quick stats built
   with reduce/filter over companies + students.
   ============================================================ */

const adminUser = requireAuth("admin");
if (adminUser) {
  initHeaderInteractions();
  renderStats();
  renderApplicantsTable();
  renderDrivesTable();
  wireTabs();
  wireAddDriveForm();
}

function renderStats() {
  const companies = getCompanies();
  const students = getStudents();
  const allApps = students.flatMap(s => s.applications);
  const offers = allApps.filter(a => a.status === "Offered").length;
  const openDrives = companies.filter(c => c.status === "open").length;

  const stats = [
    { label: "Total Drives", value: companies.length },
    { label: "Open Drives", value: openDrives },
    { label: "Total Applicants", value: allApps.length },
    { label: "Offers Made", value: offers },
  ];
  document.getElementById("adminStats").innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join("");
}

function renderApplicantsTable() {
  const students = getStudents();
  const wrap = document.getElementById("applicantsTableWrap");

  const rows = students.flatMap(s =>
    s.applications.map(app => ({ student: s, app, company: getCompanyById(app.companyId) }))
  ).filter(r => r.company);

  if (!rows.length) {
    wrap.innerHTML = `<div class="empty-state"><div class="icon">🗂️</div>No applications yet.</div>`;
    return;
  }

  const statusOptions = ["Applied", "Shortlisted", "Interview", "Offered", "Rejected"];

  wrap.innerHTML = `
    <table class="app-table">
      <thead><tr><th>Student</th><th>Branch</th><th>CGPA</th><th>Company</th><th>Role</th><th>Status</th></tr></thead>
      <tbody>
        ${rows.map((r, i) => `
          <tr>
            <td>${r.student.name}<br><span class="text-muted" style="font-size:11.5px;">${r.student.roll}</span></td>
            <td>${r.student.branch}</td>
            <td>${r.student.cgpa}</td>
            <td>${r.company.name}</td>
            <td>${r.company.role}</td>
            <td>
              <select class="status-select" data-student="${r.student.id}" data-company="${r.company.id}">
                ${statusOptions.map(opt => `<option value="${opt}" ${opt === r.app.status ? "selected" : ""}>${opt}</option>`).join("")}
              </select>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  wrap.querySelectorAll(".status-select").forEach(sel => {
    sel.addEventListener("change", () => {
      const students = getStudents();
      const s = students.find(s => s.id === sel.dataset.student);
      const app = s.applications.find(a => a.companyId === sel.dataset.company);
      app.status = sel.value;
      saveStudents(students);
      showToast(`Updated ${s.name}'s status to ${sel.value}`);
      renderStats();
    });
  });
}

function renderDrivesTable() {
  const companies = getCompanies();
  const wrap = document.getElementById("drivesTableWrap");

  wrap.innerHTML = `
    <table class="app-table">
      <thead><tr><th>Company</th><th>Role</th><th>Package</th><th>Deadline</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${companies.map(c => `
          <tr>
            <td><a href="company-detail.html?id=${c.id}" class="app-company"><div class="logo-chip">${c.initials}</div>${c.name}</a></td>
            <td>${c.role}</td>
            <td>₹${c.package} LPA</td>
            <td>${formatDate(c.deadline)}</td>
            <td><span class="badge ${c.status === 'open' ? 'badge-open' : 'badge-closed'}">${c.status}</span></td>
            <td><button class="btn btn-secondary btn-sm toggle-status" data-id="${c.id}">${c.status === 'open' ? 'Close' : 'Reopen'}</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  wrap.querySelectorAll(".toggle-status").forEach(btn => {
    btn.addEventListener("click", () => {
      const companies = getCompanies();
      const c = companies.find(c => c.id === btn.dataset.id);
      c.status = c.status === "open" ? "closed" : "open";
      saveCompanies(companies);
      renderDrivesTable();
      renderStats();
      showToast(`${c.name} marked as ${c.status}`);
    });
  });
}

function wireTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`panel-${btn.dataset.tab}`).classList.add("active");
    });
  });
}

function wireAddDriveForm() {
  document.getElementById("addDriveForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("newName").value.trim();
    const role = document.getElementById("newRole").value.trim();
    const pkg = parseFloat(document.getElementById("newPackage").value);
    const cgpa = parseFloat(document.getElementById("newCgpa").value);
    const deadline = document.getElementById("newDeadline").value;
    const location = document.getElementById("newLocation").value.trim();
    const desc = document.getElementById("newDesc").value.trim();
    const branches = Array.from(document.getElementById("newBranches").selectedOptions).map(o => o.value);

    if (!branches.length) { showToast("Select at least one eligible branch"); return; }

    const companies = getCompanies();
    const newCompany = {
      id: "c" + Date.now(),
      name, role, package: pkg, branches, minCgpa: cgpa, deadline, location,
      status: "open",
      description: desc,
      initials: name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(),
      jd: [desc],
      rounds: ["Online Assessment", "Interview"]
    };
    companies.push(newCompany);
    saveCompanies(companies);

    showToast(`${name} added as a new drive`);
    e.target.reset();
    renderStats();
    renderDrivesTable();
    document.querySelector('.tab-btn[data-tab="drives"]').click();
  });
}
