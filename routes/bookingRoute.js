const express = require("express")
const { auth, isUser } = require("../middleware/auth")
const { bookSeat, getBookingDetails } = require("../controllers/bookingController")
const router = express.Router()


// Route for booking the train seat by user
router.post("/book/:trainID", auth, isUser, bookSeat)

// Route for getting specific booking details
router.get("/booking/details/:bookingID", auth, isUser, getBookingDetails)

module.exports = router