// Mock data for the HRMS Application

export const USERS = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "admin@fwcit.com",
    password: "admin123",
    role: "admin",
    department: "Administration",
    position: "Management Admin",
    avatar: "RK",
    joinDate: "2020-01-15",
    salary: 150000,
    phone: "+91 98765 43210",
    location: "Mumbai, India",
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "manager@fwcit.com",
    password: "manager123",
    role: "manager",
    department: "Engineering",
    position: "Senior Manager",
    avatar: "PS",
    joinDate: "2019-03-20",
    salary: 120000,
    phone: "+91 98765 43211",
    location: "Bangalore, India",
  },
  {
    id: "3",
    name: "Anita Desai",
    email: "hr@fwcit.com",
    password: "hr123",
    role: "recruiter",
    department: "Human Resources",
    position: "HR Recruiter",
    avatar: "AD",
    joinDate: "2021-06-10",
    salary: 80000,
    phone: "+91 98765 43212",
    location: "Delhi, India",
  },
  {
    id: "4",
    name: "Vikram Patel",
    email: "employee@fwcit.com",
    password: "emp123",
    role: "employee",
    department: "Engineering",
    position: "Software Engineer",
    avatar: "VP",
    joinDate: "2022-08-01",
    salary: 70000,
    phone: "+91 98765 43213",
    location: "Pune, India",
  },
];

export const EMPLOYEES = [
  { id: "E001", name: "Rajesh Kumar", department: "Administration", position: "Management Admin", status: "Active", salary: 150000, joinDate: "2020-01-15", email: "rajesh@fwcit.com", phone: "+91 98765 43210", avatar: "RK", manager: "Board", performance: 95, attendance: 98, leaves: 3 },
  { id: "E002", name: "Priya Sharma", department: "Engineering", position: "Senior Manager", status: "Active", salary: 120000, joinDate: "2019-03-20", email: "priya@fwcit.com", phone: "+91 98765 43211", avatar: "PS", manager: "Rajesh Kumar", performance: 92, attendance: 96, leaves: 5 },
  { id: "E003", name: "Anita Desai", department: "Human Resources", position: "HR Recruiter", status: "Active", salary: 80000, joinDate: "2021-06-10", email: "anita@fwcit.com", phone: "+91 98765 43212", avatar: "AD", manager: "Rajesh Kumar", performance: 88, attendance: 97, leaves: 2 },
  { id: "E004", name: "Vikram Patel", department: "Engineering", position: "Software Engineer", status: "Active", salary: 70000, joinDate: "2022-08-01", email: "vikram@fwcit.com", phone: "+91 98765 43213", avatar: "VP", manager: "Priya Sharma", performance: 82, attendance: 94, leaves: 7 },
  { id: "E005", name: "Sunita Rao", department: "Marketing", position: "Marketing Manager", status: "Active", salary: 90000, joinDate: "2021-02-15", email: "sunita@fwcit.com", phone: "+91 98765 43214", avatar: "SR", manager: "Rajesh Kumar", performance: 90, attendance: 95, leaves: 4 },
  { id: "E006", name: "Amit Joshi", department: "Finance", position: "Financial Analyst", status: "Active", salary: 85000, joinDate: "2020-11-20", email: "amit@fwcit.com", phone: "+91 98765 43215", avatar: "AJ", manager: "Priya Sharma", performance: 87, attendance: 99, leaves: 1 },
  { id: "E007", name: "Deepa Nair", department: "Engineering", position: "Frontend Developer", status: "Active", salary: 75000, joinDate: "2023-01-10", email: "deepa@fwcit.com", phone: "+91 98765 43216", avatar: "DN", manager: "Priya Sharma", performance: 85, attendance: 93, leaves: 6 },
  { id: "E008", name: "Ravi Gupta", department: "Sales", position: "Sales Executive", status: "On Leave", salary: 65000, joinDate: "2022-05-25", email: "ravi@fwcit.com", phone: "+91 98765 43217", avatar: "RG", manager: "Sunita Rao", performance: 78, attendance: 88, leaves: 12 },
  { id: "E009", name: "Meera Singh", department: "Design", position: "UI/UX Designer", status: "Active", salary: 72000, joinDate: "2023-03-15", email: "meera@fwcit.com", phone: "+91 98765 43218", avatar: "MS", manager: "Priya Sharma", performance: 91, attendance: 97, leaves: 3 },
  { id: "E010", name: "Karan Mehta", department: "Engineering", position: "Backend Developer", status: "Active", salary: 78000, joinDate: "2022-10-05", email: "karan@fwcit.com", phone: "+91 98765 43219", avatar: "KM", manager: "Priya Sharma", performance: 84, attendance: 92, leaves: 8 },
  { id: "E011", name: "Pooja Iyer", department: "Customer Support", position: "Support Lead", status: "Active", salary: 60000, joinDate: "2021-09-12", email: "pooja@fwcit.com", phone: "+91 98765 43220", avatar: "PI", manager: "Sunita Rao", performance: 86, attendance: 96, leaves: 4 },
  { id: "E012", name: "Sanjay Verma", department: "Operations", position: "Operations Manager", status: "Active", salary: 95000, joinDate: "2019-12-01", email: "sanjay@fwcit.com", phone: "+91 98765 43221", avatar: "SV", manager: "Rajesh Kumar", performance: 89, attendance: 98, leaves: 2 },
];

export const DEPARTMENTS = [
  { id: "D001", name: "Engineering", head: "Priya Sharma", employees: 4, budget: 5000000, location: "Bangalore" },
  { id: "D002", name: "Human Resources", head: "Anita Desai", employees: 2, budget: 1500000, location: "Delhi" },
  { id: "D003", name: "Marketing", head: "Sunita Rao", employees: 3, budget: 2000000, location: "Mumbai" },
  { id: "D004", name: "Finance", head: "Amit Joshi", employees: 2, budget: 1000000, location: "Mumbai" },
  { id: "D005", name: "Sales", head: "Ravi Gupta", employees: 5, budget: 3000000, location: "Delhi" },
  { id: "D006", name: "Design", head: "Meera Singh", employees: 2, budget: 800000, location: "Bangalore" },
  { id: "D007", name: "Operations", head: "Sanjay Verma", employees: 3, budget: 1200000, location: "Mumbai" },
  { id: "D008", name: "Customer Support", head: "Pooja Iyer", employees: 6, budget: 900000, location: "Pune" },
  { id: "D009", name: "Administration", head: "Rajesh Kumar", employees: 2, budget: 500000, location: "Mumbai" },
];

export const ATTENDANCE = [
  { date: "2026-06-01", employeeId: "E004", checkIn: "09:02", checkOut: "18:05", status: "Present", hours: 9 },
  { date: "2026-06-02", employeeId: "E004", checkIn: "08:55", checkOut: "17:58", status: "Present", hours: 9 },
  { date: "2026-06-03", employeeId: "E004", checkIn: "09:15", checkOut: "18:30", status: "Late", hours: 9 },
  { date: "2026-06-04", employeeId: "E004", checkIn: "", checkOut: "", status: "Absent", hours: 0 },
  { date: "2026-06-05", employeeId: "E004", checkIn: "09:00", checkOut: "18:00", status: "Present", hours: 9 },
];

export const LEAVE_REQUESTS = [
  { id: "L001", employeeId: "E004", employeeName: "Vikram Patel", type: "Sick Leave", from: "2026-05-10", to: "2026-05-12", days: 3, status: "Approved", reason: "Fever and cold", appliedOn: "2026-05-09" },
  { id: "L002", employeeId: "E004", employeeName: "Vikram Patel", type: "Casual Leave", from: "2026-06-20", to: "2026-06-22", days: 3, status: "Pending", reason: "Family function", appliedOn: "2026-06-05" },
  { id: "L003", employeeId: "E008", employeeName: "Ravi Gupta", type: "Annual Leave", from: "2026-06-01", to: "2026-06-12", days: 12, status: "Approved", reason: "Vacation", appliedOn: "2026-05-20" },
  { id: "L004", employeeId: "E007", employeeName: "Deepa Nair", type: "Work From Home", from: "2026-06-08", to: "2026-06-08", days: 1, status: "Pending", reason: "Personal work", appliedOn: "2026-06-05" },
];

export const PAYROLL = [
  { id: "P001", employeeId: "E004", employeeName: "Vikram Patel", month: "May 2026", basicSalary: 70000, hra: 21000, ta: 5000, da: 7000, pf: 8400, tax: 4200, netSalary: 90400, status: "Paid", paidOn: "2026-05-31" },
  { id: "P002", employeeId: "E004", employeeName: "Vikram Patel", month: "April 2026", basicSalary: 70000, hra: 21000, ta: 5000, da: 7000, pf: 8400, tax: 4200, netSalary: 90400, status: "Paid", paidOn: "2026-04-30" },
  { id: "P003", employeeId: "E004", employeeName: "Vikram Patel", month: "March 2026", basicSalary: 70000, hra: 21000, ta: 5000, da: 7000, pf: 8400, tax: 4200, netSalary: 90400, status: "Paid", paidOn: "2026-03-31" },
];

export const JOB_POSTINGS = [
  { id: "J001", title: "Senior React Developer", department: "Engineering", location: "Bangalore", type: "Full-time", experience: "4-6 years", salary: "₹12L - ₹18L", status: "Active", applications: 47, posted: "2026-05-20", deadline: "2026-07-20", skills: ["React", "TypeScript", "Node.js", "AWS"] },
  { id: "J002", title: "Product Manager", department: "Operations", location: "Mumbai", type: "Full-time", experience: "5-8 years", salary: "₹15L - ₹22L", status: "Active", applications: 32, posted: "2026-05-25", deadline: "2026-07-25", skills: ["Product Strategy", "Agile", "Data Analysis", "Leadership"] },
  { id: "J003", title: "UX Designer", department: "Design", location: "Remote", type: "Full-time", experience: "3-5 years", salary: "₹8L - ₹14L", status: "Active", applications: 28, posted: "2026-06-01", deadline: "2026-07-31", skills: ["Figma", "User Research", "Prototyping", "CSS"] },
  { id: "J004", title: "Data Scientist", department: "Engineering", location: "Hyderabad", type: "Full-time", experience: "2-4 years", salary: "₹10L - ₹16L", status: "Closed", applications: 65, posted: "2026-04-10", deadline: "2026-05-31", skills: ["Python", "ML", "TensorFlow", "SQL"] },
  { id: "J005", title: "HR Business Partner", department: "Human Resources", location: "Delhi", type: "Full-time", experience: "3-6 years", salary: "₹7L - ₹11L", status: "Active", applications: 19, posted: "2026-06-03", deadline: "2026-07-31", skills: ["HR Strategy", "Employee Relations", "Talent Management"] },
];

export const CANDIDATES = [
  { id: "C001", name: "Arjun Menon", jobId: "J001", email: "arjun@email.com", phone: "+91 99887 76655", experience: 5, skills: ["React", "TypeScript", "GraphQL", "Node.js", "AWS"], education: "B.Tech CSE - IIT Bombay", aiScore: 92, status: "Interview Scheduled", appliedOn: "2026-05-22", resumeUrl: "#" },
  { id: "C002", name: "Kavya Reddy", jobId: "J001", email: "kavya@email.com", phone: "+91 99887 76656", experience: 4, skills: ["React", "Vue.js", "JavaScript", "CSS"], education: "B.E CSE - BITS Pilani", aiScore: 78, status: "Shortlisted", appliedOn: "2026-05-23", resumeUrl: "#" },
  { id: "C003", name: "Rohit Bansal", jobId: "J002", email: "rohit@email.com", phone: "+91 99887 76657", experience: 7, skills: ["Product Management", "Agile", "SQL", "Leadership"], education: "MBA - IIM Ahmedabad", aiScore: 88, status: "Under Review", appliedOn: "2026-05-26", resumeUrl: "#" },
  { id: "C004", name: "Divya Krishnan", jobId: "J003", email: "divya@email.com", phone: "+91 99887 76658", experience: 3, skills: ["Figma", "Adobe XD", "User Research", "CSS", "HTML"], education: "B.Des - NID", aiScore: 95, status: "Offer Extended", appliedOn: "2026-06-02", resumeUrl: "#" },
  { id: "C005", name: "Suresh Nambiar", jobId: "J001", email: "suresh@email.com", phone: "+91 99887 76659", experience: 6, skills: ["React", "Angular", "TypeScript", "Docker"], education: "M.Tech CSE - NIT Trichy", aiScore: 85, status: "Shortlisted", appliedOn: "2026-05-24", resumeUrl: "#" },
  { id: "C006", name: "Nisha Kapoor", jobId: "J005", email: "nisha@email.com", phone: "+91 99887 76660", experience: 5, skills: ["HR Strategy", "Talent Acquisition", "Employee Engagement"], education: "MBA HR - XLRI", aiScore: 90, status: "Under Review", appliedOn: "2026-06-04", resumeUrl: "#" },
];

export const PERFORMANCE_REVIEWS = [
  { id: "PR001", employeeId: "E004", reviewPeriod: "Q1 2026", goals: 8, achieved: 7, rating: 4.2, feedback: "Excellent performance on the API integration project. Shows great initiative.", reviewedBy: "Priya Sharma", reviewDate: "2026-04-15", kpis: { codeQuality: 85, delivery: 90, teamwork: 88, innovation: 78 } },
  { id: "PR002", employeeId: "E004", reviewPeriod: "Q4 2025", goals: 6, achieved: 5, rating: 3.8, feedback: "Good work overall, needs improvement in documentation.", reviewedBy: "Priya Sharma", reviewDate: "2026-01-15", kpis: { codeQuality: 80, delivery: 85, teamwork: 82, innovation: 72 } },
];

export const ANNOUNCEMENTS = [
  { id: "A001", title: "Q2 Performance Reviews Starting", content: "Performance reviews for Q2 2026 will begin from June 15th. Please complete your self-assessments by June 12th.", date: "2026-06-05", priority: "High", by: "HR Team" },
  { id: "A002", title: "Company Annual Picnic - July 2026", content: "Join us for the annual company picnic on July 19th at Lonavala. Register by June 30th.", date: "2026-06-04", priority: "Medium", by: "Admin Team" },
  { id: "A003", title: "New Leave Policy Update", content: "The updated leave policy is effective from July 1st. Key changes include additional 2 days of mental health leave.", date: "2026-06-01", priority: "High", by: "HR Team" },
  { id: "A004", title: "Office Closure - June 14th", content: "The office will be closed on June 14th for maintenance work. WFH applicable.", date: "2026-05-30", priority: "Medium", by: "Admin Team" },
];

export const MONTHLY_STATS = [
  { month: "Jan", headcount: 145, hired: 12, resigned: 3, revenue: 4200000 },
  { month: "Feb", headcount: 154, hired: 15, resigned: 6, revenue: 4800000 },
  { month: "Mar", headcount: 163, hired: 14, resigned: 5, revenue: 5100000 },
  { month: "Apr", headcount: 172, hired: 18, resigned: 9, revenue: 5600000 },
  { month: "May", headcount: 181, hired: 16, resigned: 7, revenue: 6200000 },
  { month: "Jun", headcount: 190, hired: 20, resigned: 11, revenue: 6800000 },
];

export const ATTENDANCE_CHART = [
  { day: "Mon", present: 178, absent: 12 },
  { day: "Tue", present: 182, absent: 8 },
  { day: "Wed", present: 175, absent: 15 },
  { day: "Thu", present: 185, absent: 5 },
  { day: "Fri", present: 165, absent: 25 },
];

export const DEPT_PERFORMANCE = [
  { dept: "Engineering", score: 88 },
  { dept: "HR", score: 85 },
  { dept: "Marketing", score: 82 },
  { dept: "Finance", score: 91 },
  { dept: "Sales", score: 79 },
  { dept: "Design", score: 87 },
  { dept: "Operations", score: 84 },
];
