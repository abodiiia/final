const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: { type: String, enum: ['hotel', 'event'], required: true },
    itemName: { type: String, required: true },
    startDate: { type: Date }, // For hotel bookings
    endDate: { type: Date },   // For hotel bookings
    eventDate: { type: Date }, // For event bookings
    guests: { type: Number, default: 1 },
    attendees: { type: Number, default: 1 }, // For event bookings
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'cancelled'], 
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);