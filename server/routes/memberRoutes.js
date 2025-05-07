import express from 'express';
import upload from '../middleware/upload.js';
import Member from '../models/Member.js';
import mongoose from 'mongoose';

const router = express.Router();

// GET all members
router.get('/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET single member by ID
router.get('/members/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST new member with image upload
router.post('/members', upload.single('image'), async (req, res) => {
  console.log('Received POST request to /members');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB is not connected. Current state:', mongoose.connection.readyState);
      return res.status(500).json({ message: 'Database connection error' });
    }

    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ message: 'Profile image is required' });
    }

    // Validate required fields
    const requiredFields = ['name', 'role', 'email', 'contact'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    const memberData = {
      name: req.body.name,
      role: req.body.role,
      email: req.body.email,
      contact: req.body.contact,
      imageUrl: imageUrl
    };

    console.log('Creating member with data:', memberData);

    const member = new Member(memberData);
    const newMember = await member.save();
    
    console.log('Member created successfully:', newMember);
    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error creating member:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'A member with this email already exists' 
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors: messages 
      });
    }

    // Handle MongoDB connection errors
    if (error.name === 'MongoServerError') {
      return res.status(500).json({ 
        message: 'Database error occurred' 
      });
    }

    res.status(400).json({ 
      message: error.message || 'Error creating member' 
    });
  }
});

export default router;