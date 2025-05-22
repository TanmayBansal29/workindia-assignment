const express = require("express")
const { registerUser, loginUser } = require("../controllers/authController")
const router = express.Router()

// Route for user registration
router.get("/register", registerUser)

// Route for user login
router.get("/login", loginUser)

module.exports = router