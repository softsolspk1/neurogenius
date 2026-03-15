
const bcrypt = require('bcryptjs');
const { User, sequelize } = require('./api/models');

async function seedDoctors() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const doctors = [
      {
        name: 'Dr. Ahmed',
        email: 'softsolspk@gmail.com',
        specialty: 'Neurologist',
        city: 'Karachi',
        hospital: 'CHK',
        password: 'password123',
        designation: 'Doctor',
        status: 'active'
      },
      {
        name: 'Dr. Faizan',
        email: 'softsolspak@gmail.com',
        specialty: 'Neurologist',
        city: 'Karachi',
        hospital: 'CHK',
        password: 'password123',
        designation: 'Doctor',
        status: 'active'
      }
    ];

    for (const doc of doctors) {
      const existing = await User.findOne({ where: { email: doc.email } });
      if (existing) {
        console.log(`User ${doc.email} already exists. Updating...`);
        const password_hash = await bcrypt.hash(doc.password, 10);
        await existing.update({ 
          name: doc.name, 
          specialty: doc.specialty, 
          city: doc.city, 
          hospital: doc.hospital,
          password_hash,
          status: 'active'
        });
      } else {
        console.log(`Creating user ${doc.email}...`);
        const password_hash = await bcrypt.hash(doc.password, 10);
        await User.create({
          ...doc,
          password_hash,
          role: 'doctor' // Ensure role is set
        });
      }
    }

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    process.exit();
  }
}

seedDoctors();
