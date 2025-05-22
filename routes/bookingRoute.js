const express = require("express")
const { auth, isUser } = require("../middleware/auth")
const { bookSeat } = require("../controllers/bookingController")
const router = express.Router()


// Route for booking the train seat by user
router.post("/book/:trainID", auth, isUser, bookSeat)

module.exports = router