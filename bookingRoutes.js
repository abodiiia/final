
const express = require('express');
const router = express.Router();
const Booking = require('./models/Booking');
const Hotel = require('./models/Hotel');
const Event = require('./models/Event');

// Get bookings for the logged-in user
router.get('/my-bookings', async (req, res) => {
    try {
        // In a real app, we would verify the JWT token
        // and extract user ID from it
        const userId = req.headers.authorization ? 
            req.headers.authorization.split(' ')[1] : null;
            
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        // Get bookings from localStorage (simulating database)
        const allBookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const userBookings = allBookings.filter(booking => booking.userId === userId);
        
        res.json(userBookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
});

// Create a new booking
router.post('/', async (req, res) => {
    try {
        const { 
            userId, 
            itemId, 
            itemType, 
            itemName,
            startDate, 
            endDate, 
            eventDate,
            guests, 
            attendees,
            totalPrice 
        } = req.body;
        
        if (!userId || !itemId || !itemType) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        // Create booking object
        const booking = {
            id: Date.now().toString(),
            userId,
            itemId,
            itemType,
            itemName,
            startDate,
            endDate,
            eventDate,
            guests,
            attendees,
            totalPrice,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        // Get existing bookings or create empty array
        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        
        // Add new booking
        bookings.push(booking);
        
        // Save to localStorage (simulating database)
        localStorage.setItem("bookings", JSON.stringify(bookings));
        
        res.status(201).json({
            message: "Booking created successfully",
            booking
        });
    } catch (error) {
        console.error("Booking creation error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Cancel a booking
router.put('/:id/cancel', async (req, res) => {
    try {
        const bookingId = req.params.id;
        
        // Get existing bookings
        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        
        // Find the booking
        const index = bookings.findIndex(b => b.id === bookingId || b._id === bookingId);
        
        if (index === -1) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        // Update booking status
        bookings[index].status = 'cancelled';
        
        // Save updated bookings
        localStorage.setItem("bookings", JSON.stringify(bookings));
        
        res.json({
            message: "Booking cancelled successfully",
            booking: bookings[index]
        });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
