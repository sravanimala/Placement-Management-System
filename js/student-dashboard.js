/* ============================================================
   student-dashboard.js — logged-in student's profile, applied
   companies with status tracker, and a placement-prep checklist
   persisted per student in localStorage.
   ============================================================ */

const user = requireAuth("student");
if (user) {
  initHeaderInteractions();
  render();
}

function render() {
  const student = getStudentById(user.studentId);
  const root = document.getElementById("dashRoot");

  const checklistItems = [
    { key: "resume", label: "Resume uploaded & reviewed" },
    { key: "aptitude", label: "Aptitude test practice done" },
    { key: "mockInterview", label: "Mock interview completed" },
    { key: "groupDiscussion", label: "Group discussion practice done" },
  ];
  const doneCount = checklistItems.filter(i => student.checklist[i.key]).length;
  const progressPct = Math.round((doneCount / checklistItems.length) * 100);

  root.innerHTML = `
    <div class="dash-grid">
      <div>
        <div class="card profile-card">
          <div class="avatar">${initialsOf(student.name)}</div>
          <div class="profile-name">${student.name}</div>
          <div class="profile-meta">${student.roll} · ${student.branch}</div>
          <div class="profile-stats">
            <div class="profile-stat"><b>${student.cgpa}</b><span>CGPA</span></div>
            <div class="profile-stat"><b>${student.applications.length}</b><span>Applied</span></div>
            <div class="profile-stat"><b>${student.backlogs}</b><span>Backlogs</span></div>
          </div>
        </div>

        <div class="card checklist-card">
          <div class="section-title" style="font-size:15px; margin-bottom:10px;"><span class="dot"></span>Prep Checklist</div>
          <div id="checklistWrap">
            ${checklistItems.map(i => `
              <label class="checklist-item ${student.checklist[i.key] ? 'done' : ''}" data-key="${i.key}">
                <input type="checkbox" ${student.checklist[i.key] ? "checked" : ""}>
                <span>${i.label}</span>
              </label>
            `).join("")}
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${progressPct}%"></div></div>
          <div class="text-muted" style="font-size:11.5px; margin-top:6px;">${doneCount}/${checklistItems.length} completed</div>
        </div>
      </div>

      <div>
        <div class="flex-between mb-24">
          <div class="section-title" style="margin-bottom:0;"><span class="dot"></span>Your Applications</div>
          <a href="companies.html" class="btn btn-secondary btn-sm">Browse more drives</a>
        </div>
        <div class="card" style="overflow-x:auto;">
          ${renderApplicationsTable(student)}
        </div>
      </div>
    </div>
  `;

  wireChecklist(student);
}

function renderApplicationsTable(student) {
  if (!student.applications.length) {
    return `<div class="empty-state"><div class="icon">📄</div>You haven't applied to any drives yet.</div>`;
  }
  const rows = student.applications.map(app => {
    const c = getCompanyById(app.companyId);
    if (!c) return "";
    return `
      <tr>
        <td>
          <a href="company-detail.html?id=${c.id}" class="app-company">
            <div class="logo-chip">${c.initials}</div>${c.name}
          </a>
        </td>
        <td>${c.role}</td>
        <td>₹${c.package} LPA</td>
        <td><span class="badge ${statusBadgeClass(app.status)}">${app.status}</span></td>
      </tr>
    `;
  }).join("");

  return `
    <table class="app-table">
      <thead><tr><th>Company</th><th>Role</th><th>Package</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function wireChecklist(student) {
  document.querySelectorAll(".checklist-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const key = item.dataset.key;
      const students = getStudents();
      const s = students.find(s => s.id === student.id);
      s.checklist[key] = !s.checklist[key];
      saveStudents(students);
      render();
    });
  });
}

function initialsOf(name) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}
