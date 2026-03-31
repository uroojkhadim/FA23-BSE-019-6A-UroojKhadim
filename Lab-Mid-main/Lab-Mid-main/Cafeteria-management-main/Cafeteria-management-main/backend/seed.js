import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';
import Teacher from './models/Teacher.js';
import Administrator from './models/Administrator.js';
import MenuItem from './models/MenuItem.js';
import Discount from './models/Discount.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Administrator.deleteMany({});
    await MenuItem.deleteMany({});
    await Discount.deleteMany({});
    console.log('🗑️  Existing data cleared');

    // Create demo students
    const students = await Student.create([
      {
        fullName: 'Demo Student',
        email: 'student@comsats.edu.pk',
        password: 'password123',
        registrationNumber: 'COMSATS-2026-001',
        contactNumber: '+92 300 1111111',
        whatsappNumber: '+92 300 1111111',
        role: 'student',
        universityName: 'Comsats University',
      },
    ]);
    console.log('✓ Students created');

    // Create demo teachers
    const teachers = await Teacher.create([
      {
        fullName: 'Demo Teacher',
        email: 'teacher@comsats.edu.pk',
        password: 'password123',
        cnicNumber: '12345-1234567-1',
        department: 'Computer Science',
        phoneNumber: '+92 300 2222222',
        role: 'teacher',
      },
    ]);
    console.log('✓ Teachers created');

    // Create demo administrators
    const admins = await Administrator.create([
      {
        fullName: 'Demo Admin',
        email: 'admin@comsats.edu.pk',
        password: 'password123',
        cnicNumber: '12345-7654321-1',
        phoneNumber: '+92 300 3333333',
        adminRole: 'Cafeteria Manager',
        universityName: 'Comsats University',
        role: 'admin',
      },
    ]);
    console.log('✓ Administrators created');

    // Create menu items
    const menuItems = await MenuItem.create([
      {
        itemName: 'Chicken Biryani',
        itemPrice: 5.99,
        itemDescription: 'Spiced rice with tender chicken and fresh herbs.',
        category: 'Lunch',
        dietaryRestrictions: 'Halal',
        isAvailable: true,
        itemImage: 'https://static.wixstatic.com/media/a525c7_81f4b76f50b04205bc0e0661511f5926~mv2.png?originWidth=1280&originHeight=704',
      },
      {
        itemName: 'Club Sandwich',
        itemPrice: 3.75,
        itemDescription: 'Triple layer sandwich with chicken, egg, and fresh vegetables.',
        category: 'Snacks',
        dietaryRestrictions: 'Halal',
        isAvailable: true,
        itemImage: 'https://static.wixstatic.com/media/a525c7_bfb040f3965343e7aa123f1f837df956~mv2.png?originWidth=128&originHeight=128',
      },
      {
        itemName: 'Lemon Mint',
        itemPrice: 1.5,
        itemDescription: 'Fresh lemon and mint drink, served chilled.',
        category: 'Beverages',
        dietaryRestrictions: 'Halal',
        isAvailable: true,
      },
      {
        itemName: 'Beef Karahi',
        itemPrice: 8.99,
        itemDescription: 'Traditional Pakistani beef curry cooked in karahi.',
        category: 'Lunch',
        dietaryRestrictions: 'Halal',
        isAvailable: true,
      },
      {
        itemName: 'Chicken Tikka',
        itemPrice: 6.50,
        itemDescription: 'Grilled chicken marinated in spices and yogurt.',
        category: 'Snacks',
        dietaryRestrictions: 'Halal',
        isAvailable: true,
      },
    ]);
    console.log('✓ Menu items created');

    // Create discounts
    const discounts = await Discount.create([
      {
        discountCode: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minimumOrderAmount: 5,
        isActive: true,
        description: 'Welcome discount for new users',
      },
      {
        discountCode: 'SAVE20',
        discountType: 'percentage',
        discountValue: 20,
        minimumOrderAmount: 10,
        isActive: true,
        description: 'Save 20% on orders above Rs. 10',
      },
    ]);
    console.log('✓ Discounts created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('   Student: student@comsats.edu.pk / password123');
    console.log('   Teacher: teacher@comsats.edu.pk / password123');
    console.log('   Admin: admin@comsats.edu.pk / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
