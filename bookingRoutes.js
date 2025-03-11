
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const Event = require("../models/Event");

// Create a new booking
router.post("/", async (req, res) => {
    try {
        const { userId, itemId, itemType, startDate, endDate, guests, totalPrice } = req.body;
        
        if (!userId || !itemId || !itemType) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        // Verify the hotel or event exists
        let item;
        if (itemType === 'hotel') {
            item = await Hotel.findById(itemId);
        } else if (itemType === 'event') {
            item = await Event.findById(itemId);
        }
        
        if (!item) {
            return res.status(404).json({ message: `${itemType} not found` });
        }
        
        const booking = new Booking({
            userId,
            itemId,
            itemType,
            startDate,
            endDate,
            guests,
            totalPrice,
            status: 'confirmed'
        });
        
        await booking.save();
        
        res.status(201).json({
            message: "Booking created successfully",
            booking
        });
    } catch (error) {
        console.error("Booking creation error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get user bookings
router.get("/user/:userId", async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId });
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Cancel booking
router.put("/:id/cancel", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        booking.status = 'cancelled';
        await booking.save();
        
        res.status(200).json({
            message: "Booking cancelled successfully",
            booking
        });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
