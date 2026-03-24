import mongoose from "mongoose";
import dotenv from "dotenv";
import { Job } from "./models/job.model.js";
import { Company } from "./models/company.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/careernest";

// ─── Replace with your actual recruiter _id from the DB ───────────────────────
const RECRUITER_ID = "69b5c1893de43cfc8c80a7e9";

// ─── Companies to create (or reuse if already exist) ──────────────────────────
const COMPANIES = [
  { name: "Infosys",       location: "Pune",       description: "Global IT services & consulting giant.", website: "https://infosys.com" },
  { name: "Wipro",         location: "Bangalore",  description: "Leading IT, consulting & BPS company.", website: "https://wipro.com" },
  { name: "TCS",           location: "Mumbai",     description: "IT services, consulting & business solutions.", website: "https://tcs.com" },
  { name: "Flipkart",      location: "Bangalore",  description: "India's largest e-commerce marketplace.", website: "https://flipkart.com" },
  { name: "Zomato",        location: "Delhi NCR",  description: "Food delivery & restaurant discovery platform.", website: "https://zomato.com" },
  { name: "Swiggy",        location: "Bangalore",  description: "On-demand food & grocery delivery.", website: "https://swiggy.com" },
  { name: "Razorpay",      location: "Bangalore",  description: "Full-stack payments & banking platform.", website: "https://razorpay.com" },
  { name: "Freshworks",    location: "Hyderabad",  description: "Cloud-based SaaS for CRM & support.", website: "https://freshworks.com" },
  { name: "Ola",           location: "Bangalore",  description: "Mobility & EV platform.", website: "https://olacabs.com" },
  { name: "Paytm",         location: "Delhi NCR",  description: "Digital payments & financial services.", website: "https://paytm.com" },
  { name: "Meesho",        location: "Bangalore",  description: "Social commerce platform for small businesses.", website: "https://meesho.com" },
  { name: "CRED",          location: "Bangalore",  description: "Credit card bill payment & rewards app.", website: "https://cred.club" },
  { name: "Zerodha",       location: "Bangalore",  description: "India's largest stock broker.", website: "https://zerodha.com" },
  { name: "PhonePe",       location: "Bangalore",  description: "UPI-based digital payments platform.", website: "https://phonepe.com" },
  { name: "Nykaa",         location: "Mumbai",     description: "Beauty & fashion e-commerce platform.", website: "https://nykaa.com" },
  { name: "Urban Company", location: "Delhi NCR",  description: "Home services marketplace.", website: "https://urbancompany.com" },
  { name: "Groww",         location: "Bangalore",  description: "Investment & mutual funds platform.", website: "https://groww.in" },
  { name: "BrowserStack",  location: "Mumbai",     description: "Cloud web & mobile testing platform.", website: "https://browserstack.com" },
  { name: "Postman",       location: "Bangalore",  description: "API development & collaboration platform.", website: "https://postman.com" },
  { name: "Remote First",  location: "Remote",     description: "Fully distributed remote-first tech company.", website: "https://remotefirst.io" },
];

// ─── Job Templates ─────────────────────────────────────────────────────────────
// experienceLevel: 0=Fresher, 1-3=1–3 yrs, 3-5=3–5 yrs, 5+=5+ yrs
// salary: stored in rupees (100000 = 1 LPA)
// jobtype: must match FilterCard options exactly → "Full-time"|"Part-time"|"Internship"|"Remote"|"Contract"
// location: must match FilterCard options → "Pune"|"Bangalore"|"Mumbai"|"Hyderabad"|"Delhi NCR"|"Remote"
// position: keyword matched by category filter → "Frontend Developer"|"Backend Developer" etc.

const jobTemplates = [

  // ── FRONTEND DEVELOPER ──────────────────────────────────────────────────────
  {
    title: "Frontend Developer",
    description: "Build pixel-perfect, responsive UIs for our consumer-facing web app using React and Tailwind CSS. You will collaborate closely with designers and backend engineers to ship features fast.",
    requirements: ["React", "JavaScript", "Tailwind CSS", "HTML", "CSS", "Git"],
    salary: 500000, location: "Pune",       jobtype: "Full-time",  experienceLevel: 1, position: "Frontend Developer", company: "Infosys",
  },
  {
    title: "Senior Frontend Developer",
    description: "Lead frontend architecture decisions, mentor junior devs, and drive performance optimisation across our React + TypeScript codebase.",
    requirements: ["React", "TypeScript", "Redux", "Webpack", "Performance Optimisation"],
    salary: 1400000, location: "Bangalore",  jobtype: "Full-time",  experienceLevel: 4, position: "Frontend Developer", company: "Razorpay",
  },
  {
    title: "Frontend Developer – Remote",
    description: "Work from anywhere on our SaaS dashboard. Own the component library and collaborate async with a global team.",
    requirements: ["React", "TypeScript", "Storybook", "GraphQL", "Jest"],
    salary: 1100000, location: "Remote",     jobtype: "Remote",     experienceLevel: 2, position: "Frontend Developer", company: "Remote First",
  },
  {
    title: "Junior Frontend Developer",
    description: "Entry-level role for fresh graduates. You will build UI components, fix bugs, and learn from senior engineers in a fast-paced startup.",
    requirements: ["HTML", "CSS", "JavaScript", "React basics", "Git"],
    salary: 350000, location: "Delhi NCR",  jobtype: "Full-time",  experienceLevel: 0, position: "Frontend Developer", company: "Zomato",
  },
  {
    title: "Frontend Developer Intern",
    description: "3-month internship to build real features in our React codebase. Great learning opportunity with mentorship from senior engineers.",
    requirements: ["HTML", "CSS", "JavaScript", "React"],
    salary: 20000,  location: "Hyderabad",  jobtype: "Internship", experienceLevel: 0, position: "Frontend Developer", company: "Freshworks",
  },
  {
    title: "Part-time Frontend Developer",
    description: "20 hrs/week role to maintain and improve our marketing website. Flexible hours, fully remote-friendly.",
    requirements: ["React", "Next.js", "Tailwind CSS", "SEO basics"],
    salary: 420000, location: "Mumbai",     jobtype: "Part-time",  experienceLevel: 1, position: "Frontend Developer", company: "Nykaa",
  },

  // ── BACKEND DEVELOPER ───────────────────────────────────────────────────────
  {
    title: "Backend Developer",
    description: "Design and build scalable REST APIs for our payments platform. Work with Node.js, PostgreSQL, and Redis in a microservices architecture.",
    requirements: ["Node.js", "Express", "PostgreSQL", "Redis", "REST APIs"],
    salary: 800000, location: "Bangalore",  jobtype: "Full-time",  experienceLevel: 2, position: "Backend Developer", company: "PhonePe",
  },
  {
    title: "Senior Backend Developer",
    description: "Own the core transaction engine. Drive system design, code reviews, and on-call reliability for our high-throughput backend.",
    requirements: ["Node.js", "Microservices", "Kafka", "PostgreSQL", "System Design"],
    salary: 1800000, location: "Bangalore",  jobtype: "Full-time",  experienceLevel: 5, position: "Backend Developer", company: "Zerodha",
  },
  {
    title: "Backend Developer – Java",
    description: "Build enterprise-grade backend services using Spring Boot. Integrate with third-party APIs and maintain high availability.",
    requirements: ["Java", "Spring Boot", "MySQL", "REST APIs", "Docker"],
    salary: 950000, location: "Pune",       jobtype: "Full-time",  experienceLevel: 3, position: "Backend Developer", company: "Infosys",
  },
  {
    title: "Backend Developer Intern",
    description: "Internship focused on building and testing REST APIs with Node.js. You will work on real production features under close mentorship.",
    requirements: ["Node.js", "Express", "MongoDB", "Postman"],
    salary: 18000,  location: "Bangalore",  jobtype: "Internship", experienceLevel: 0, position: "Backend Developer", company: "Swiggy",
  },
  {
    title: "Remote Backend Developer",
    description: "Fully remote role building Python microservices for our data pipeline. Async-first culture, strong documentation standards.",
    requirements: ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS Lambda"],
    salary: 1200000, location: "Remote",     jobtype: "Remote",     experienceLevel: 3, position: "Backend Developer", company: "Remote First",
  },
  {
    title: "Fresher Backend Developer",
    description: "Graduate trainee program for backend development. You will learn Node.js, databases, and API design from scratch with structured mentorship.",
    requirements: ["JavaScript", "Node.js basics", "SQL", "Problem Solving"],
    salary: 400000, location: "Hyderabad",  jobtype: "Full-time",  experienceLevel: 0, position: "Backend Developer", company: "Freshworks",
  },

  // ── FULLSTACK DEVELOPER ─────────────────────────────────────────────────────
  {
    title: "FullStack Developer",
    description: "End-to-end ownership of features across React frontend and Node.js backend. Work in a small, high-ownership team shipping weekly.",
    requirements: ["React", "Node.js", "MongoDB", "Express", "REST APIs"],
    salary: 900000, location: "Bangalore",  jobtype: "Full-time",  experienceLevel: 2, position: "FullStack Developer", company: "CRED",
  },
  {
    title: "Senior FullStack Developer",
    description: "Lead full-stack development of our seller dashboard. Architect new features, review PRs, and mentor a team of 4 developers.",
    requirements: ["React", "TypeScript", "Node.js", "PostgreSQL", "System Design"],
    salary: 2000000, location: "Bangalore",  jobtype: "Full-time",  experienceLevel: 5, position: "FullStack Developer", company: "Meesho",
  },
  {
    title: "FullStack Developer – MERN",
    description: "Build and maintain features across the full MERN stack for our logistics platform. Own features from DB schema to UI.",
    requirements: ["MongoDB", "Express", "React", "Node.js", "Redux"],
    salary: 700000, location: "Delhi NCR",  jobtype: "Full-time",  experienceLevel: 1, position: "FullStack Developer", company: "Ola",
  },
  {
    title: "FullStack Developer Intern",
    description: "6-month internship building real features across our React + Node.js stack. Ideal for final-year students or recent graduates.",
    requirements: ["React", "Node.js", "MongoDB", "HTML", "CSS"],
    salary: 25000,  location: "Pune",       jobtype: "Internship", experienceLevel: 0, position: "FullStack Developer", company: "Groww",
  },
  {
    title: "Remote FullStack Developer",
    description: "Remote-first role for a product-focused engineer who can own features end-to-end. Strong async communication skills required.",
    requirements: ["React", "Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
    salary: 1500000, location: "Remote",     jobtype: "Remote",     experienceLevel: 3, position: "FullStack Developer", company: "Remote First",
  },
  {
    title: "Part-time FullStack Developer",
    description: "20 hrs/week contract to build internal tooling. Flexible schedule, fully remote. Ideal for freelancers or moonlighters.",
    requirements: ["React", "Node.js", "MongoDB", "REST APIs"],
    salary: 600000, location: "Mumbai",     jobtype: "Part-time",  experienceLevel: 2, position: "FullStack Developer", company: "BrowserStack",
  },

  // ── UI/UX DESIGNER ──────────────────────────────────────────────────────────
  {
    title: "UI/UX Designer",
    description: "Own the end-to-end design process for our mobile and web products. From user research and wireframes to polished Figma prototypes.",
    requirements: ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems"],
    salary: 700000, location: "Bangalore",  jobtype: "Full-time",  experienceLevel: 2, position: "UI/UX Designer", company: "Swiggy",
  },
  {
    title: "Senior UI/UX Designer",
    description: "Lead design for our core product. Define the design language, run usability tests, and collaborate with PMs and engineers.",
    requirements: ["Figma", "Design Systems", "User Testing", "Interaction Design", "Leadership"],
    salary: 1600000, location: "Mumbai",     jobtype: "Full-time",  experienceLevel: 5, position: "UI/UX Designer", company: "Nykaa",
  },
  {
    title: "UI/UX Designer – Fresher",
    description: "Entry-level design role for graduates with a strong portfolio. You will work on real product screens under senior designer guidance.",
    requirements: ["Figma", "Wireframing", "Basic Prototyping", "Visual Design"],
    salary: 350000, location: "Hyderabad",  jobtype: "Full-time",  experienceLevel: 0, position: "UI/UX Designer", company: "Freshworks",
  },
  {
    title: "UI/UX Design Intern",
    description: "3-month internship to design screens, create user flows, and assist in usability research for our consumer app.",
    requirements: ["Figma", "Wireframing", "Basic User Research"],
    salary: 15000,  location: "Delhi NCR",  jobtype: "Internship", experienceLevel: 0, position: "UI/UX Designer", company: "Urban Company",
  },
  {
    title: "Remote UI/UX Designer",
    description: "Fully remote design role for a SaaS startup. Own the design system and ship high-quality screens for web and mobile.",
    requirements: ["Figma", "Design Systems", "Prototyping", "User Testing", "Async Communication"],
    salary: 1000000, location: "Remote",     jobtype: "Remote",     experienceLevel: 2, position: "UI/UX Designer", company: "Remote First",
  },

  // ── DATA SCIENTIST ──────────────────────────────────────────────────────────
  {
    title: "Data Scientist",
    description: "Build and deploy ML models to personalise the user feed and improve recommendation quality. Work with large-scale data pipelines.",
    requirements: ["Python", "Scikit-learn", "TensorFlow", "SQL", "Pandas", "Statistics"],
    salary: 1400000, location: "Bangalore",  jobtype: "Full-time",  experienceLevel: 3, position: "Data Scientist", company: "Flipkart",
  },
  {
    title: "Senior Data Scientist",
    description: "Lead the ML team. Define model strategy, mentor junior scientists, and present findings to leadership.",
    requirements: ["Python", "Deep Learning", "NLP", "MLflow", "AWS SageMaker", "Leadership"],
    salary: 2800000, location: "Mumbai",     jobtype: "Full-time",  experienceLevel: 5, position: "Data Scientist", company: "TCS",
  },
  {
    title: "Data Scientist – Fresher",
    description: "Entry-level data science role for graduates with strong statistics and Python skills. Structured onboarding and mentorship provided.",
    requirements: ["Python", "Pandas", "NumPy", "Statistics", "SQL"],
    salary: 500000, location: "Hyderabad",  jobtype: "Full-time",  experienceLevel: 0, position: "Data Scientist", company: "Freshworks",
  },
  {
    title: "Data Science Intern",
    description: "6-month internship assisting the data science team in building and evaluating ML models for fraud detection.",
    requirements: ["Python", "Pandas", "NumPy", "Scikit-learn", "Jupyter"],
    salary: 20000,  location: "Bangalore",  jobtype: "Internship", experienceLevel: 0, position: "Data Scientist", company: "Razorpay",
  },
  {
    title: "Remote Data Scientist",
    description: "Fully remote role building NLP models for our customer support automation. Strong Python and ML fundamentals required.",
    requirements: ["Python", "NLP", "Transformers", "FastAPI", "Docker"],
    salary: 1700000, location: "Remote",     jobtype: "Remote",     experienceLevel: 4, position: "Data Scientist", company: "Remote First",
  },
  {
    title: "Data Scientist – Part-time",
    description: "Part-time consulting role to build a churn prediction model. 20 hrs/week, 3-month engagement, fully remote.",
    requirements: ["Python", "Scikit-learn", "SQL", "Data Visualisation"],
    salary: 800000, location: "Pune",       jobtype: "Part-time",  experienceLevel: 2, position: "Data Scientist", company: "Groww",
  },

  // ── DEVOPS ENGINEER ─────────────────────────────────────────────────────────
  {
    title: "DevOps Engineer",
    description: "Own CI/CD pipelines, container orchestration, and cloud infrastructure on AWS. Drive reliability and deployment velocity.",
    requirements: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Linux"],
    salary: 1200000, location: "Bangalore",  jobtype: "Full-time",  experienceLevel: 3, position: "DevOps Engineer", company: "Wipro",
  },
  {
    title: "Senior DevOps Engineer",
    description: "Lead cloud architecture and SRE practices. Define infrastructure-as-code standards and mentor the DevOps team.",
    requirements: ["AWS", "GCP", "Terraform", "Kubernetes", "Prometheus", "System Design"],
    salary: 2500000, location: "Bangalore",  jobtype: "Full-time",  experienceLevel: 5, position: "DevOps Engineer", company: "Postman",
  },
  {
    title: "DevOps Engineer – Hyderabad",
    description: "Manage cloud infrastructure and automate deployments for our SaaS platform. Work closely with dev teams to improve release cycles.",
    requirements: ["AWS", "Docker", "CI/CD", "Ansible", "Linux"],
    salary: 1000000, location: "Hyderabad",  jobtype: "Full-time",  experienceLevel: 2, position: "DevOps Engineer", company: "Freshworks",
  },
  {
    title: "DevOps Intern",
    description: "Learn cloud and DevOps tools in a real production environment. Assist with pipeline automation and monitoring setup.",
    requirements: ["Linux", "Docker basics", "AWS basics", "Shell Scripting"],
    salary: 18000,  location: "Bangalore",  jobtype: "Internship", experienceLevel: 0, position: "DevOps Engineer", company: "Swiggy",
  },
  {
    title: "Remote DevOps Engineer",
    description: "Fully remote role managing multi-cloud infrastructure. Strong Terraform and Kubernetes skills required. Async-first team.",
    requirements: ["AWS", "Terraform", "Kubernetes", "Helm", "Datadog", "CI/CD"],
    salary: 1900000, location: "Remote",     jobtype: "Remote",     experienceLevel: 4, position: "DevOps Engineer", company: "Remote First",
  },
  {
    title: "DevOps Engineer – Delhi NCR",
    description: "Set up and maintain CI/CD pipelines and cloud infrastructure for our fintech platform. On-site role in Gurugram.",
    requirements: ["AWS", "Docker", "Jenkins", "Kubernetes", "Monitoring"],
    salary: 900000, location: "Delhi NCR",  jobtype: "Full-time",  experienceLevel: 1, position: "DevOps Engineer", company: "Paytm",
  },

  // ── QA TESTER ───────────────────────────────────────────────────────────────
  {
    title: "QA Tester",
    description: "Ensure product quality through manual and automated testing. Write test plans, execute regression suites, and file detailed bug reports.",
    requirements: ["Manual Testing", "Selenium", "JIRA", "Test Plans", "API Testing"],
    salary: 600000, location: "Pune",       jobtype: "Full-time",  experienceLevel: 1, position: "QA Tester", company: "Infosys",
  },
  {
    title: "Senior QA Engineer",
    description: "Lead QA strategy for our mobile and web products. Build automation frameworks and drive a quality-first engineering culture.",
    requirements: ["Selenium", "Cypress", "Appium", "CI/CD", "Test Architecture", "Leadership"],
    salary: 1300000, location: "Bangalore",  jobtype: "Full-time",  experienceLevel: 4, position: "QA Tester", company: "BrowserStack",
  },
  {
    title: "QA Tester – Fresher",
    description: "Entry-level QA role for graduates. You will learn manual testing, write test cases, and assist in automation under senior guidance.",
    requirements: ["Manual Testing", "Test Cases", "JIRA", "Basic SQL"],
    salary: 300000, location: "Mumbai",     jobtype: "Full-time",  experienceLevel: 0, position: "QA Tester", company: "TCS",
  },
  {
    title: "QA Intern",
    description: "3-month internship in our QA team. Learn to write test cases, perform exploratory testing, and use bug tracking tools.",
    requirements: ["Manual Testing", "JIRA", "Attention to Detail"],
    salary: 12000,  location: "Hyderabad",  jobtype: "Internship", experienceLevel: 0, position: "QA Tester", company: "Freshworks",
  },
  {
    title: "Remote QA Engineer",
    description: "Fully remote QA role for an experienced tester. Own automation for our web app using Cypress and integrate with GitHub Actions.",
    requirements: ["Cypress", "JavaScript", "API Testing", "GitHub Actions", "Postman"],
    salary: 1000000, location: "Remote",     jobtype: "Remote",     experienceLevel: 2, position: "QA Tester", company: "Remote First",
  },
  {
    title: "QA Tester – Part-time",
    description: "Part-time manual testing role for our e-commerce platform. 20 hrs/week, flexible schedule, can work remotely.",
    requirements: ["Manual Testing", "Regression Testing", "JIRA", "E-commerce domain"],
    salary: 280000, location: "Delhi NCR",  jobtype: "Part-time",  experienceLevel: 1, position: "QA Tester", company: "Urban Company",
  },

  // ── EDGE CASES & EXTRA COVERAGE ─────────────────────────────────────────────
  {
    title: "FullStack Developer – High Package",
    description: "Principal engineer role at a unicorn startup. Own critical infrastructure, drive technical strategy, and work with the CTO.",
    requirements: ["React", "Node.js", "System Design", "Microservices", "Leadership", "AWS"],
    salary: 4000000, location: "Bangalore",  jobtype: "Full-time",  experienceLevel: 5, position: "FullStack Developer", company: "CRED",
  },
  {
    title: "Frontend Developer – 3–5 yrs",
    description: "Mid-senior frontend role. Own the design system, drive performance improvements, and mentor junior developers.",
    requirements: ["React", "TypeScript", "CSS-in-JS", "Web Performance", "Accessibility"],
    salary: 1100000, location: "Mumbai",     jobtype: "Full-time",  experienceLevel: 4, position: "Frontend Developer", company: "Nykaa",
  },
  {
    title: "Backend Developer – Low Salary Fresher",
    description: "Fresher backend developer for a bootstrapped startup. Great learning environment, equity offered.",
    requirements: ["Node.js", "MongoDB", "REST APIs", "Git"],
    salary: 250000, location: "Pune",       jobtype: "Full-time",  experienceLevel: 0, position: "Backend Developer", company: "Groww",
  },
  {
    title: "Data Scientist – Delhi NCR",
    description: "Build recommendation and personalisation models for our hyperlocal services platform.",
    requirements: ["Python", "Machine Learning", "SQL", "Pandas", "A/B Testing"],
    salary: 1100000, location: "Delhi NCR",  jobtype: "Full-time",  experienceLevel: 3, position: "Data Scientist", company: "Urban Company",
  },
  {
    title: "UI/UX Designer – Part-time",
    description: "Part-time design role to refresh our brand identity and redesign key product screens. 15 hrs/week.",
    requirements: ["Figma", "Brand Design", "UI Design", "Illustration"],
    salary: 350000, location: "Bangalore",  jobtype: "Part-time",  experienceLevel: 1, position: "UI/UX Designer", company: "Ola",
  },
  {
    title: "DevOps Engineer – Mumbai",
    description: "Manage on-prem and cloud hybrid infrastructure for our financial services platform. Strong Linux and networking skills needed.",
    requirements: ["Linux", "AWS", "Networking", "Docker", "Ansible", "Security"],
    salary: 1500000, location: "Mumbai",     jobtype: "Full-time",  experienceLevel: 4, position: "DevOps Engineer", company: "Paytm",
  },
  {
    title: "QA Tester – Bangalore 3–5 yrs",
    description: "Experienced QA engineer to own end-to-end test automation for our payments SDK. Strong API and mobile testing skills required.",
    requirements: ["Appium", "Selenium", "API Testing", "Java", "TestNG"],
    salary: 1100000, location: "Bangalore",  jobtype: "Full-time",  experienceLevel: 4, position: "QA Tester", company: "Razorpay",
  },
  {
    title: "FullStack Developer – Hyderabad",
    description: "Build internal tooling and customer-facing features for our CRM platform. Full ownership from DB to UI.",
    requirements: ["React", "Node.js", "PostgreSQL", "Docker", "REST APIs"],
    salary: 850000, location: "Hyderabad",  jobtype: "Full-time",  experienceLevel: 2, position: "FullStack Developer", company: "Freshworks",
  },
  {
    title: "Remote Frontend Developer – Internship",
    description: "Fully remote internship for students. Build UI components in React and contribute to our open-source design system.",
    requirements: ["React", "HTML", "CSS", "JavaScript", "Git"],
    salary: 15000,  location: "Remote",     jobtype: "Internship", experienceLevel: 0, position: "Frontend Developer", company: "Remote First",
  },
  {
    title: "Data Scientist – 6–10 LPA",
    description: "Mid-level data scientist to build churn prediction and LTV models for our subscription business.",
    requirements: ["Python", "Scikit-learn", "SQL", "Pandas", "Data Visualisation", "A/B Testing"],
    salary: 800000, location: "Bangalore",  jobtype: "Full-time",  experienceLevel: 2, position: "Data Scientist", company: "Zerodha",
  },
];

// ─── Seed function ─────────────────────────────────────────────────────────────
const seedJobs = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const recruiterOid = new mongoose.Types.ObjectId(RECRUITER_ID);

    // ── 1. Upsert companies ──────────────────────────────────────────────────
    const companyMap = {}; // name → _id

    for (const c of COMPANIES) {
      let doc = await Company.findOne({ name: c.name });
      if (!doc) {
        doc = await Company.create({ ...c, userId: recruiterOid });
        console.log(`  ➕ Created company: ${c.name}`);
      } else {
        console.log(`  ✔  Reused company:  ${c.name}`);
      }
      companyMap[c.name] = doc._id;
    }

    console.log(`\n✅ ${Object.keys(companyMap).length} companies ready`);

    // ── 2. Delete previous seed jobs ────────────────────────────────────────
    const deleted = await Job.deleteMany({ created_by: recruiterOid });
    console.log(`🗑️  Removed ${deleted.deletedCount} old seed jobs`);

    // ── 3. Build & insert jobs ───────────────────────────────────────────────
    // Spread createdAt across the last 30 days so "Date Posted" filter works
    const now = Date.now();
    const DAY = 86400000;

    const jobDocs = jobTemplates.map((t, i) => {
      const { company: companyName, ...fields } = t;
      const companyId = companyMap[companyName];
      if (!companyId) throw new Error(`Company not found in map: ${companyName}`);

      // Distribute timestamps: first ~10 within 24h, next ~15 within 7d, rest within 30d
      let ageMs;
      if (i < 10)      ageMs = Math.random() * DAY;
      else if (i < 25) ageMs = DAY + Math.random() * 6 * DAY;
      else             ageMs = 7 * DAY + Math.random() * 23 * DAY;

      return {
        ...fields,
        company: companyId,
        created_by: recruiterOid,
        applications: [],
        createdAt: new Date(now - ageMs),
        updatedAt: new Date(now - ageMs),
      };
    });

    await Job.insertMany(jobDocs, { timestamps: false });
    console.log(`\n🎉 ${jobDocs.length} jobs seeded successfully!\n`);

    // ── 4. Coverage summary ──────────────────────────────────────────────────
    const byLocation  = {};
    const byJobType   = {};
    const byExp       = {};
    const bySalary    = {};
    const byCategory  = {};

    jobDocs.forEach(j => {
      byLocation[j.location]  = (byLocation[j.location]  || 0) + 1;
      byJobType[j.jobtype]    = (byJobType[j.jobtype]    || 0) + 1;
      byExp[j.experienceLevel]= (byExp[j.experienceLevel]|| 0) + 1;
      const lpa = j.salary / 100000;
      const band = lpa <= 3 ? "0–3 LPA" : lpa <= 6 ? "3–6 LPA" : lpa <= 10 ? "6–10 LPA" : "10+ LPA";
      bySalary[band]          = (bySalary[band]          || 0) + 1;
      byCategory[j.position]  = (byCategory[j.position]  || 0) + 1;
    });

    console.log("📊 Coverage Summary");
    console.log("  Locations :", byLocation);
    console.log("  Job Types :", byJobType);
    console.log("  Experience:", byExp);
    console.log("  Salary    :", bySalary);
    console.log("  Categories:", byCategory);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seedJobs();


// ✅ MongoDB connected
//   ✔  Reused company:  Infosys
//   ✔  Reused company:  Wipro       
//   ✔  Reused company:  TCS
//   ✔  Reused company:  Flipkart
//   ➕ Created company: Zomato      
//   ➕ Created company: Swiggy      
//   ➕ Created company: Razorpay
//   ➕ Created company: Freshworks  
//   ➕ Created company: Ola
//   ➕ Created company: Paytm       
//   ➕ Created company: Meesho      
//   ➕ Created company: CRED
//   ➕ Created company: Zerodha     
//   ➕ Created company: PhonePe     
//   ➕ Created company: Nykaa       
//   ➕ Created company: Urban Company
//   ➕ Created company: Groww       
//   ➕ Created company: BrowserStack
//   ➕ Created company: Postman     
//   ➕ Created company: Remote First

// ✅ 20 companies ready
// 🗑️  Removed 12 old seed jobs

// 🎉 51 jobs seeded successfully!   

// 📊 Coverage Summary
//   Locations : {
//   Pune: 6,
//   Bangalore: 17,
//   Remote: 8,
//   'Delhi NCR': 6,
//   Hyderabad: 7,
//   Mumbai: 7
// }
//   Job Types : { 'Full-time': 31, Remote: 7, Internship: 8, 'Part-time': 5 }
//   Experience: { '0': 14, '1': 7, '2': 11, '3': 6, '4': 7, '5': 6 }  
//   Salary    : { '3–6 LPA': 9, '10+ LPA': 19, '0–3 LPA': 11, '6–10 LPA': 12 }
//   Categories: {
//   'Frontend Developer': 8,        
//   'Backend Developer': 7,
//   'FullStack Developer': 8,       
//   'UI/UX Designer': 6,
//   'Data Scientist': 8,
//   'DevOps Engineer': 7,
//   'QA Tester': 7
// }