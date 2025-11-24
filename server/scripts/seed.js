const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const connectDB = require('../config/db');
const User = require('../models/User');
const Note = require('../models/Note');

const seed = async () => {
  try {
    await connectDB();
    console.log(`Connected to database: ${mongoose.connection.name}`);

    // Clear existing data
    await User.deleteMany({});
    await Note.deleteMany({});
    console.log('Existing data cleared.');

    // Create dummy users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
      });
    }
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} dummy users created:`);
    createdUsers.forEach(user => console.log(user.email));

    // Create dummy notes for each user
    const notes = [];
    for (const user of createdUsers) {
      // Create 3 notes for today
      for (let i = 0; i < 3; i++) {
        notes.push({
          user: user._id,
          title: `Today's Note ${i + 1}`,
          content: faker.lorem.paragraph(),
          tags: faker.lorem.words(1),
          createdAt: new Date(),
        });
      }

      // Create 7 more notes with random dates
      for (let i = 0; i < 7; i++) {
        notes.push({
          user: user._id,
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          tags: faker.lorem.words(1),
          createdAt: faker.date.recent({ days: 30 }),
        });
      }
    }
    await Note.insertMany(notes);
    console.log(`${notes.length} dummy notes created.`);

    console.log('Database seeded successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.connection.close();
  }
};

seed();
