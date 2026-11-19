/* ============================================================
   data.js — Hardcoded seed data for companies + students.
   This is the ONLY place raw seed data lives. utils.js loads
   it into localStorage on first run so every page reads/writes
   through localStorage after that.
   ============================================================ */

const SEED_COMPANIES = [
  {
    id: "c1",
    name: "Nexora Technologies",
    initials: "NX",
    role: "Software Engineer Trainee",
    package: 7.5,
    branches: ["CSE", "IT", "ECE"],
    minCgpa: 7.0,
    deadline: "2026-09-05",
    location: "Hyderabad (Hybrid)",
    status: "open",
    description: "Nexora builds cloud-native data platforms for retail analytics. The trainee program is a 6-month rotation across backend, DevOps, and product teams before a permanent placement.",
    jd: [
      "Strong fundamentals in DSA and at least one of C/Python/Java",
      "Familiarity with Git and basic SQL",
      "Good communication and willingness to learn cloud tooling",
      "Bond: 1 year mandatory service agreement"
    ],
    rounds: ["Online Assessment", "Technical Interview", "HR Interview"]
  },
  {
    id: "c2",
    name: "Verdant Systems",
    initials: "VS",
    role: "Associate Software Developer",
    package: 6.2,
    branches: ["CSE", "IT"],
    minCgpa: 6.5,
    deadline: "2026-08-28",
    location: "Bengaluru",
    status: "open",
    description: "Verdant Systems is a mid-size product company working on HR-tech SaaS tools used by 400+ companies across India.",
    jd: [
      "Working knowledge of HTML, CSS, and JavaScript",
      "Basic understanding of REST APIs",
      "CGPA 6.5+ with no active backlogs",
      "Immediate joiners preferred"
    ],
    rounds: ["Coding Test", "Technical + Managerial Interview"]
  },
  {
    id: "c3",
    name: "Bluepeak Analytics",
    initials: "BA",
    role: "Data Analyst Intern",
    package: 4.8,
    branches: ["CSE", "IT", "ECE", "EEE"],
    minCgpa: 6.0,
    deadline: "2026-08-22",
    location: "Remote",
    status: "open",
    description: "6-month paid internship with a pre-placement offer track. Work on dashboards, reporting pipelines, and light ML-assisted analysis for client accounts.",
    jd: [
      "Comfortable with Python and Excel",
      "Basic statistics knowledge",
      "Strong attention to detail"
    ],
    rounds: ["Aptitude Test", "Case Study Interview"]
  },
  {
    id: "c4",
    name: "Orbital Cloudworks",
    initials: "OC",
    role: "Graduate Engineer Trainee",
    package: 9.0,
    branches: ["CSE", "IT", "ECE", "EEE", "MECH"],
    minCgpa: 7.5,
    deadline: "2026-09-15",
    location: "Pune",
    status: "open",
    description: "Orbital Cloudworks hires GETs into a structured 1-year rotational program spanning infrastructure, security, and applied AI teams.",
    jd: [
      "CGPA 7.5+ with no standing backlogs",
      "Solid problem-solving fundamentals",
      "Exposure to any cloud platform is a plus, not mandatory"
    ],
    rounds: ["Online Assessment", "Technical Interview 1", "Technical Interview 2", "HR"]
  },
  {
    id: "c5",
    name: "Fernwood Retail Labs",
    initials: "FR",
    role: "Junior QA Engineer",
    package: 4.2,
    branches: ["CSE", "IT"],
    minCgpa: 6.0,
    deadline: "2026-08-18",
    location: "Chennai",
    status: "open",
    description: "Fernwood builds e-commerce storefront software. This role focuses on manual + basic automated testing for web and mobile checkout flows.",
    jd: [
      "Basic understanding of software testing concepts",
      "Attention to detail and clear bug-report writing",
      "Any scripting language is a bonus"
    ],
    rounds: ["Written Test", "HR + Technical Interview"]
  },
  {
    id: "c6",
    name: "Ashgrove Fintech",
    initials: "AF",
    role: "Backend Developer",
    package: 11.0,
    branches: ["CSE", "IT"],
    minCgpa: 8.0,
    deadline: "2026-07-30",
    location: "Hyderabad",
    status: "closed",
    description: "Ashgrove builds payment infrastructure for small merchants. This drive has closed for the current placement cycle.",
    jd: [
      "Strong DSA + system design fundamentals",
      "Experience with any backend framework",
      "CGPA 8.0+"
    ],
    rounds: ["Online Assessment", "2 Technical Rounds", "HR"]
  }
];

const SEED_STUDENTS = [
  {
    id: "s1",
    name: "Ananya Rao",
    roll: "21A91A0501",
    branch: "CSE",
    cgpa: 8.4,
    backlogs: 0,
    email: "ananya.rao@college.edu",
    applications: [
      { companyId: "c1", status: "Shortlisted" },
      { companyId: "c4", status: "Applied" }
    ],
    checklist: { resume: true, aptitude: true, mockInterview: false, groupDiscussion: false }
  },
  {
    id: "s2",
    name: "Kiran Mehta",
    roll: "21A91A0512",
    branch: "IT",
    cgpa: 7.1,
    backlogs: 0,
    email: "kiran.mehta@college.edu",
    applications: [
      { companyId: "c2", status: "Interview" },
      { companyId: "c3", status: "Applied" }
    ],
    checklist: { resume: true, aptitude: true, mockInterview: true, groupDiscussion: false }
  },
  {
    id: "s3",
    name: "Divya Patel",
    roll: "21A91A0533",
    branch: "ECE",
    cgpa: 6.8,
    backlogs: 1,
    email: "divya.patel@college.edu",
    applications: [
      { companyId: "c3", status: "Offered" }
    ],
    checklist: { resume: true, aptitude: false, mockInterview: false, groupDiscussion: false }
  }
];

/* Demo student used for the mock "Student" login — kept separate
   from SEED_STUDENTS so admin sample data stays untouched. */
const DEMO_STUDENT = {
  id: "s_demo",
  name: "You (Demo Student)",
  roll: "21A91A0599",
  branch: "CSE",
  cgpa: 7.8,
  backlogs: 0,
  email: "demo.student@college.edu",
  applications: [],
  checklist: { resume: false, aptitude: false, mockInterview: false, groupDiscussion: false }
};
