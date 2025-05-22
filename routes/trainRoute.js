const express = require("express")
const { auth, isAdmin } = require("../middleware/auth")
const { addTrain, getTrains } = require("../controllers/trainController")
const router = express.Router()

// Route for adding the train into DB by Admin
router.post("/addTrain", auth, isAdmin, addTrain)

// Route for getting the trains from source to destination
router.get("/getTrains", auth, getTrains)

module.exports = router