
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const config = require('./config');

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB database'))
.catch(err => console.error('MongoDB connection error:', err));

async function createBusinessOwner() {
    try {
        // Check if business owner already exists
        const existingUser = await User.findOne({ username: 'business' });
        
        if (existingUser) {
            console.log('Business owner already exists!');
            console.log(`Username: ${existingUser.username}`);
            console.log(`Password: business123`);
            mongoose.disconnect();
            return;
        }
        
        // Create a new business owner user
        const businessOwner = new User({
            name: 'Business Owner',
            email: 'business@example.com',
            phone: '1234567890',
            country: 'Sample Country',
            username: 'business',
            password: 'business123',
            role: 'owner'
        });
        
        await businessOwner.save();
        
        console.log('Business owner created successfully!');
        console.log(`Username: ${businessOwner.username}`);
        console.log(`Password: business123`);
        
        mongoose.disconnect();
    } catch (error) {
        console.error('Error creating business owner:', error);
        mongoose.disconnect();
    }
}

createBusinessOwner();
