/* ============================================================
   utils.js — shared helpers: localStorage wrappers, seeding,
   date formatting, toast, and small render helpers used across
   every page.
   ============================================================ */

const STORAGE_KEYS = {
  companies: "pms_companies",
  students: "pms_students",
  currentUser: "pms_current_user",
  checklistPrefix: "pms_checklist_"
};

/* ---- generic localStorage wrappers ---- */
function getData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error("getData failed for", key, e);
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error("saveData failed for", key, e);
    return false;
  }
}

/* ---- seed on first load ---- */
function ensureSeeded() {
  if (!localStorage.getItem(STORAGE_KEYS.companies)) {
    saveData(STORAGE_KEYS.companies, SEED_COMPANIES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.students)) {
    saveData(STORAGE_KEYS.students, SEED_STUDENTS);
  }
}

function getCompanies() { return getData(STORAGE_KEYS.companies, []); }
function saveCompanies(list) { return saveData(STORAGE_KEYS.companies, list); }

function getStudents() { return getData(STORAGE_KEYS.students, []); }
function saveStudents(list) { return saveData(STORAGE_KEYS.students, list); }

function getCompanyById(id) { return getCompanies().find(c => c.id === id); }
function getStudentById(id) { return getStudents().find(s => s.id === id); }

/* ---- date helpers ---- */
function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function daysLeft(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(dateStr + "T00:00:00");
  const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function deadlineLabel(dateStr) {
  const d = daysLeft(dateStr);
  if (d < 0) return { text: "Closed", cls: "badge-closed" };
  if (d === 0) return { text: "Closes today", cls: "badge-warn" };
  if (d <= 3) return { text: `${d} day${d === 1 ? "" : "s"} left`, cls: "badge-shortlisted" };
  return { text: `${d} days left`, cls: "badge-open" };
}

function statusBadgeClass(status) {
  const map = {
    Applied: "badge-applied",
    Shortlisted: "badge-shortlisted",
    Interview: "badge-interview",
    Offered: "badge-offered",
    Rejected: "badge-rejected"
  };
  return map[status] || "badge-applied";
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* ---- toast ---- */
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2400);
}

/* ---- init on every page ---- */
ensureSeeded();
