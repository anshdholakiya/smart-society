require('dotenv').config();
const { User } = require('./models');
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');

async function createAdmin() {
    try {
        // Attempt to authenticate connection first
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // We can also sync the DB here just in case
        await sequelize.sync({ alter: true });

        const adminEmail = 'admin@example.com';
        const adminPassword = 'adminpassword123'; // Change this later

        // Check if admin already exists
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create the admin user
        const admin = await User.create({
            name: 'System Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            isSetup: true
        });

        console.log('✅ Admin user created successfully!');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

createAdmin();
