const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Note = require('../models/Note');
const Tag = require('../models/Tag');
require('dotenv').config({ path: __dirname + '/../.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedTestUser = async () => {
  try {
    await connectDB();

    // Create test user
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    let user = await User.findOne({ email: 'testuser@example.com' });
    if (user) {
      console.log('Test user already exists. Deleting existing user and their notes/tags.');
      await Note.deleteMany({ user: user._id });
      await Tag.deleteMany({ user: user._id });
      await User.deleteOne({ _id: user._id });
    }
    
    user = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password,
    });
    await user.save();
    console.log('Test user created');

    const notesData = [
      {
        title: 'Weekly Groceries',
        tagName: 'Shopping',
        content: 'Buy milk, eggs, bread, and coffee beans. Don\'t forget to check if avocados are on sale this week.',
      },
      {
        title: 'Marketing Meeting Notes',
        tagName: 'Work',
        content: 'Discussed the Q4 timeline. We need to finalize the landing page design by Friday. Sarah will handle the social media posts.',
      },
      {
        title: 'App Idea',
        tagName: 'Ideas',
        content: 'A fitness tracker that works like an RPG game. You level up your character by walking steps and drinking water. Need to sketch the UI.',
      },
      {
        title: 'Dentist Appointment',
        tagName: 'Urgent',
        content: 'Appointment is confirmed for Tuesday at 4:00 PM. Remember to bring the insurance card and arrive 10 minutes early.',
      },
      {
        title: 'Movies to Watch',
        tagName: 'Personal',
        content: '1. Inception 2. The Grand Budapest Hotel 3. Spider-Man: Into the Spider-Verse (Recommended by Mike)',
      },
    ];

    for (const noteData of notesData) {
      let tag = await Tag.findOne({ user: user._id, name: noteData.tagName });
      if (!tag) {
        tag = new Tag({
          user: user._id,
          name: noteData.tagName,
        });
        await tag.save();
      }

      const newNote = new Note({
        user: user._id,
        title: noteData.title,
        content: noteData.content,
        tag: tag._id,
      });
      await newNote.save();
    }

    console.log('Test notes created');

    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedTestUser();
