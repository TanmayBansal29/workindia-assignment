const express = require("express")
const { registerUser } = require("../controllers/authController")
const router = express.Router()

// Route for user registration
router.get("/register", registerUser)


module.exports = router