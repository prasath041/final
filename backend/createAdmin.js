const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Admin credentials - CHANGE THESE!
    const adminData = {
      name: 'Prasath Shan',
      email: 'prasathshan041@gmail.com',
      password: 'Shan@2025',
      phone: '9876543210',
      address: 'Admin Office',
      role: 'admin'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('\n📧 Email: ' + adminData.email);
      console.log('🔐 Password: Shan@2025 (or your previously set password)');
      process.exit(0);
    }

    // Create admin user (password will be hashed by the model's pre-save hook)
    const admin = await User.create(adminData);
    
    console.log('\n🎉 Admin user created successfully!');
    console.log('\n=============================');
    console.log('ADMIN LOGIN CREDENTIALS');
    console.log('=============================');
    console.log('📧 Email: prasathshan041@gmail.com');
    console.log('🔐 Password: Shan@2025');
    console.log('=============================');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('\nTo access admin dashboard:');
    console.log('1. Go to http://localhost:3000/login');
    console.log('2. Login with admin credentials');
    console.log('3. You will see Admin Dashboard link in navbar');
    console.log('4. Go to http://localhost:3000/admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
