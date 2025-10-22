import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project_management');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create test user
    const user = new User({
      email: 'test@example.com',
      password: 'Test@123',
      name: 'Test User'
    });
    await user.save();
    console.log('Test user created');

    // Create projects
    const project1 = new Project({
      title: 'Website Redesign',
      description: 'Complete redesign of company website',
      status: 'active',
      user: user._id
    });

    const project2 = new Project({
      title: 'Mobile App Development',
      description: 'Build a new mobile application',
      status: 'active',
      user: user._id
    });

    await project1.save();
    await project2.save();
    console.log('Projects created');

    // Create tasks for project 1
    const tasks1 = [
      {
        title: 'Design Homepage',
        description: 'Create new homepage design mockups',
        status: 'todo',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        project: project1._id,
        user: user._id
      },
      {
        title: 'Develop Header Component',
        description: 'Implement responsive header navigation',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        project: project1._id,
        user: user._id
      },
      {
        title: 'Test Responsive Design',
        description: 'Ensure website works on all device sizes',
        status: 'done',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        project: project1._id,
        user: user._id
      }
    ];

    // Create tasks for project 2
    const tasks2 = [
      {
        title: 'Set up React Native',
        description: 'Initialize React Native project structure',
        status: 'done',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        project: project2._id,
        user: user._id
      },
      {
        title: 'Build Authentication Flow',
        description: 'Implement login and registration screens',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        project: project2._id,
        user: user._id
      },
      {
        title: 'Design Database Schema',
        description: 'Plan and create database structure',
        status: 'todo',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        project: project2._id,
        user: user._id
      }
    ];

    await Task.insertMany([...tasks1, ...tasks2]);
    console.log('Tasks created');

    console.log('Seed data created successfully!');
    console.log('Test user credentials:');
    console.log('Email: test@example.com');
    console.log('Password: Test@123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();