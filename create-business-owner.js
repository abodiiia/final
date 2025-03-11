const mongoose = require('mongoose');
const express = require('express');
const User = require('./models/User'); // Assuming the path is correct, adjust if needed
const bcrypt = require('bcryptjs');
const config = require('./config');

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB database'))
.catch(err => console.error('MongoDB connection error:', err));

// Function to create a business owner
async function createBusinessOwner(userData) {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return { success: false, message: 'User with this email already exists' };
        }

        // Create new user with owner role
        const user = new User({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            phone: userData.phone,
            country: userData.country,
            username: userData.username,
            role: 'owner' // Ensure role is set to owner
        });

        // Save the user
        await user.save();
        return { success: true, user };
    } catch (error) {
        console.error('Error creating business owner:', error);
        return { success: false, message: 'Server error', error: error.message };
    }
}

module.exports = { createBusinessOwner };