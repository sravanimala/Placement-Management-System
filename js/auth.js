/* ============================================================
   auth.js — mock login/session handling. No real auth: the
   person just picks "Student" or "Admin" and we store that
   role (plus, for students, a chosen demo profile) in
   localStorage as the current session.
   ============================================================ */

function getCurrentUser() {
  return getData(STORAGE_KEYS.currentUser, null);
}

function loginAsStudent() {
  ensureSeeded();
  const students = getStudents();
  if (!students.find(s => s.id === DEMO_STUDENT.id)) {
    students.push(DEMO_STUDENT);
    saveStudents(students);
  }
  saveData(STORAGE_KEYS.currentUser, { role: "student", studentId: DEMO_STUDENT.id, name: DEMO_STUDENT.name });
}

function loginAsAdmin() {
  saveData(STORAGE_KEYS.currentUser, { role: "admin", name: "Placement Admin" });
}

function logout() {
  localStorage.removeItem(STORAGE_KEYS.currentUser);
  window.location.href = "login.html";
}

/* Redirects to login.html if no session, or if the session role
   doesn't match what the page requires. Call at the top of any
   protected page's JS file. */
function requireAuth(requiredRole) {
  const user = getCurrentUser();
  if (!user || (requiredRole && user.role !== requiredRole)) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

/* Renders the shared header's user/role area + logout control.
   Call on every page after the header markup is on the DOM. */
function renderNavUser() {
  const el = document.getElementById("navUser");
  if (!el) return;
  const user = getCurrentUser();
  if (!user) {
    el.innerHTML = `<a href="login.html" class="btn btn-primary btn-sm">Login</a>`;
    return;
  }
  el.innerHTML = `
    <span class="role-badge">${user.role}</span>
    <span>${user.name}</span>
    <button class="nav-logout" id="logoutBtn">Logout</button>
  `;
  document.getElementById("logoutBtn").addEventListener("click", logout);
}

/* Wires the mobile nav toggle + renders the user area. Call once
   on every page after the header markup is on the DOM. */
function initHeaderInteractions() {
  renderNavUser();
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }
}
