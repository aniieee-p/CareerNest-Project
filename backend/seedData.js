import mongoose from 'mongoose';
import dotenv from 'dotenv';
import  User  from './models/user.model.js';
import { Company } from './models/company.model.js';
import { Job } from './models/job.model.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/careernest');
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
};

// Seed function
const seedDatabase = async () => {
    try {
        await connectDB();

        // Get the recruiter user
        const recruiter = await User.findOne({ role: 'recruiter' });
        if (!recruiter) {
            console.log('❌ No recruiter found. Please create a recruiter first.');
            process.exit(1);
        }

        console.log(`✅ Found recruiter: ${recruiter.fullname}`);

        // Clean up existing seed data
        await Company.deleteMany({ userId: recruiter._id });
        await Job.deleteMany({ created_by: recruiter._id });
        console.log('🧹 Cleaned up existing data');

        // Companies data
        const companiesData = [
            {
                name: "Infosys",
                description: "Global leader in next-generation digital services and consulting",
                website: "https://www.infosys.com",
                location: "Pune, Maharashtra",
                userId: recruiter._id
            },
            {
                name: "Wipro",
                description: "Leading global information technology, consulting and business process services company",
                website: "https://www.wipro.com",
                location: "Bangalore, Karnataka",
                userId: recruiter._id
            },
            {
                name: "TCS",
                description: "IT services, consulting and business solutions organization",
                website: "https://www.tcs.com",
                location: "Mumbai, Maharashtra",
                userId: recruiter._id
            },
            {
                name: "Flipkart",
                description: "India's leading e-commerce marketplace",
                website: "https://www.flipkart.com",
                location: "Bangalore, Karnataka",
                userId: recruiter._id
            }
        ];

        // Create companies
        const createdCompanies = await Company.insertMany(companiesData);
        console.log(`✅ Created ${createdCompanies.length} companies`);

        // Jobs data
        const jobsData = [
            // Infosys Jobs
            {
                title: "Java Full Stack Developer",
                description: "Looking for experienced Java developers with Spring Boot and Angular knowledge",
                requirements: ["Java, Spring Boot, Angular, MySQL, REST APIs"],
                salary: "900000",
                location: "Pune",
                jobtype: "Full-time",
                experienceLevel: 3,
                position: "5",
                company: createdCompanies[0]._id,
                created_by: recruiter._id
            },
            {
                title: "Python Developer",
                description: "Python developer needed for data analytics projects",
                requirements: ["Python, Django, PostgreSQL, Data Analysis"],
                salary: "700000",
                location: "Pune",
                jobtype: "Full-time",
                experienceLevel: 2,
                position: "3",
                company: createdCompanies[0]._id,
                created_by: recruiter._id
            },
            {
                title: "Fresher Trainee",
                description: "Hiring fresh graduates for software development training program",
                requirements: ["Any Programming Language, Basic DSA, Communication Skills"],
                salary: "350000",
                location: "Pune",
                jobtype: "Full-time",
                experienceLevel: 0,
                position: "20",
                company: createdCompanies[0]._id,
                created_by: recruiter._id
            },
            // Wipro Jobs
            {
                title: "DevOps Engineer",
                description: "Seeking DevOps engineer with AWS and Docker experience",
                requirements: ["AWS, Docker, Kubernetes, Jenkins, CI/CD"],
                salary: "1200000",
                location: "Bangalore",
                jobtype: "Full-time",
                experienceLevel: 4,
                position: "2",
                company: createdCompanies[1]._id,
                created_by: recruiter._id
            },
            {
                title: "UI/UX Designer",
                description: "Creative UI/UX designer for enterprise applications",
                requirements: ["Figma, Adobe XD, User Research, Prototyping, Wireframing"],
                salary: "650000",
                location: "Bangalore",
                jobtype: "Full-time",
                experienceLevel: 2,
                position: "2",
                company: createdCompanies[1]._id,
                created_by: recruiter._id
            },
            {
                title: "Software Testing Intern",
                description: "Internship opportunity for manual and automation testing",
                requirements: ["Selenium, Manual Testing, Basic Programming"],
                salary: "20000",
                location: "Bangalore",
                jobtype: "Internship",
                experienceLevel: 0,
                position: "10",
                company: createdCompanies[1]._id,
                created_by: recruiter._id
            },
            // TCS Jobs
            {
                title: "Data Scientist",
                description: "Data scientist role for AI/ML projects",
                requirements: ["Python, Machine Learning, TensorFlow, Statistics, SQL"],
                salary: "1500000",
                location: "Mumbai",
                jobtype: "Full-time",
                experienceLevel: 5,
                position: "1",
                company: createdCompanies[2]._id,
                created_by: recruiter._id
            },
            {
                title: "React.js Developer",
                description: "Frontend developer specializing in React ecosystem",
                requirements: ["React.js, Redux, JavaScript, HTML, CSS, REST APIs"],
                salary: "800000",
                location: "Mumbai",
                jobtype: "Full-time",
                experienceLevel: 2,
                position: "4",
                company: createdCompanies[2]._id,
                created_by: recruiter._id
            },
            {
                title: "Business Analyst",
                description: "BA role for requirement gathering and documentation",
                requirements: ["Business Analysis, SQL, Excel, Communication, Agile"],
                salary: "600000",
                location: "Mumbai",
                jobtype: "Part-time",
                experienceLevel: 3,
                position: "2",
                company: createdCompanies[2]._id,
                created_by: recruiter._id
            },
            // Flipkart Jobs
            {
                title: "Backend Developer",
                description: "Node.js backend developer for e-commerce platform",
                requirements: ["Node.js, Express.js, MongoDB, Redis, Microservices"],
                salary: "1100000",
                location: "Bangalore",
                jobtype: "Full-time",
                experienceLevel: 3,
                position: "3",
                company: createdCompanies[3]._id,
                created_by: recruiter._id
            },
            {
                title: "Android Developer",
                description: "Android app development for Flipkart mobile app",
                requirements: ["Kotlin, Java, Android SDK, REST APIs, Firebase"],
                salary: "950000",
                location: "Bangalore",
                jobtype: "Full-time",
                experienceLevel: 3,
                position: "2",
                company: createdCompanies[3]._id,
                created_by: recruiter._id
            },
            {
                title: "Product Management Intern",
                description: "Internship in product management team",
                requirements: ["Product Thinking, Market Research, Communication, Excel"],
                salary: "30000",
                location: "Bangalore",
                jobtype: "Internship",
                experienceLevel: 0,
                position: "5",
                company: createdCompanies[3]._id,
                created_by: recruiter._id
            }
        ];

        // Create jobs
        const createdJobs = await Job.insertMany(jobsData);
        console.log(`✅ Created ${createdJobs.length} jobs`);

        console.log('\n🎉 Database seeded successfully!');
        console.log(`\n📊 Summary:
        - Companies: ${createdCompanies.length}
        - Jobs: ${createdJobs.length}
        - Total Jobs in DB: ${createdJobs.length + 1} (including existing)
        `);

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();

