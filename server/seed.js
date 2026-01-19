import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { HumanResources } from './models/HR.model.js';
import { Organization } from './models/Organization.model.js';

dotenv.config();

const seedHRAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB...");

        const orgData = {
            name: "FPT Software",
            description: "Leading technology corporation in Vietnam",
            OrganizationURL: "https://fpt-software.com",
            OrganizationMail: "contact@fpt.com"
        };

        const hrData = {
            firstname: "Admin",
            lastname: "System",
            email: "admin@fpt.com",
            password: "AdminPassword123",
            contactnumber: "0987654321"
        };

        const existingHR = await HumanResources.findOne({ email: hrData.email });
        if (existingHR) {
            console.log("⚠️  HR Admin already exists. Seed aborted.");
            process.exit();
        }

        const newOrg = await Organization.create(orgData);
        console.log("🏢 Organization created.");

        const hashedPassword = await bcrypt.hash(hrData.password, 10);
        const newHR = await HumanResources.create({
            ...hrData,
            password: hashedPassword,
            role: "HR-Admin",
            organizationID: newOrg._id,
            isverified: true 
        });

        newOrg.HRs.push(newHR._id);
        await newOrg.save();

        console.log("👤 HR Admin created successfully!");
        console.log(`📧 Email: ${hrData.email}`);
        console.log(`🔑 Password: ${hrData.password}`);
        
        process.exit();
    } catch (error) {
        console.error("❌ Error seeding data:", error.message);
        process.exit(1);
    }
};

seedHRAdmin();