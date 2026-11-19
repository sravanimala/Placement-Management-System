/* ============================================================
   company-detail.js — render a single company from ?id=, run a
   live countdown to the deadline, and handle the apply action
   for the logged-in student.
   ============================================================ */

initHeaderInteractions();

const root = document.getElementById("detailRoot");
const companyId = getQueryParam("id");
const company = companyId ? getCompanyById(companyId) : null;

if (!company) {
  root.innerHTML = `
    <div class="empty-state">
      <div class="icon">🚫</div>
      Drive not found.
      <div class="mt-24"><a href="companies.html" class="btn btn-secondary">Back to drives</a></div>
    </div>
  `;
} else {
  renderDetail();
  startCountdown();
  wireApply();
}

function renderDetail() {
  const dl = deadlineLabel(company.deadline);
  root.innerHTML = `
    <a href="companies.html" class="text-muted" style="font-size:13px; display:inline-block; margin-bottom:16px;">&larr; Back to drives</a>
    <div class="detail-grid">
      <div>
        <div class="detail-header">
          <div class="logo-chip">${company.initials}</div>
          <div>
            <div class="detail-name">${company.name}</div>
            <div class="detail-role">${company.role} · ${company.location}</div>
          </div>
        </div>

        <div class="card detail-block">
          <h3>About the role</h3>
          <p class="text-muted" style="font-size:14px;">${company.description}</p>
        </div>

        <div class="card detail-block">
          <h3>Eligibility & JD</h3>
          <ul class="jd-list">
            ${company.jd.map(j => `<li>${j}</li>`).join("")}
          </ul>
        </div>

        <div class="card detail-block">
          <h3>Selection Rounds</h3>
          <div class="rounds-row">
            ${company.rounds.map(r => `<span class="round-chip">${r}</span>`).join("")}
          </div>
        </div>
      </div>

      <div>
        <div class="card detail-block">
          <div class="countdown" id="countdown">—</div>
          <div class="side-stat"><span>Package</span><span><strong>₹${company.package} LPA</strong></span></div>
          <div class="side-stat"><span>Min. CGPA</span><span>${company.minCgpa}+</span></div>
          <div class="side-stat"><span>Eligible branches</span><span>${company.branches.join(", ")}</span></div>
          <div class="side-stat"><span>Deadline</span><span>${formatDate(company.deadline)}</span></div>
          <div class="side-stat"><span>Status</span><span class="badge ${company.status === 'open' ? dl.cls : 'badge-closed'}">${company.status === 'open' ? dl.text : 'Closed'}</span></div>
          <button class="btn btn-primary btn-block mt-24" id="applyBtn"></button>
          <p id="applyNote" class="text-muted" style="font-size:12px; margin-top:10px; text-align:center;"></p>
        </div>
      </div>
    </div>
  `;
}

function startCountdown() {
  const el = document.getElementById("countdown");
  const d = daysLeft(company.deadline);
  el.textContent = d < 0 ? "Applications closed" : d === 0 ? "Closes today" : `${d} day${d === 1 ? "" : "s"} remaining`;
}

function wireApply() {
  const btn = document.getElementById("applyBtn");
  const note = document.getElementById("applyNote");
  const user = getCurrentUser();
  const isOpen = company.status === "open" && daysLeft(company.deadline) >= 0;

  if (!user || user.role !== "student") {
    btn.textContent = "Login as Student to Apply";
    btn.addEventListener("click", () => window.location.href = "login.html");
    note.textContent = "";
    if (!isOpen) btn.disabled = true;
    return;
  }

  const student = getStudentById(user.studentId);
  const existing = student.applications.find(a => a.companyId === company.id);

  if (existing) {
    btn.textContent = "Already Applied";
    btn.disabled = true;
    note.textContent = `Status: ${existing.status}`;
    return;
  }

  if (!isOpen) {
    btn.textContent = "Applications Closed";
    btn.disabled = true;
    return;
  }

  if (!company.branches.includes(student.branch) || student.cgpa < company.minCgpa) {
    btn.textContent = "Not Eligible";
    btn.disabled = true;
    note.textContent = `Requires ${company.branches.join("/")} branch and CGPA ${company.minCgpa}+`;
    return;
  }

  btn.textContent = "Apply Now";
  btn.addEventListener("click", () => {
    const students = getStudents();
    const s = students.find(s => s.id === student.id);
    s.applications.push({ companyId: company.id, status: "Applied" });
    saveStudents(students);
    showToast(`Applied to ${company.name}`);
    setTimeout(() => window.location.reload(), 500);
  });
}
