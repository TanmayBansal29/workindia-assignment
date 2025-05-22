const express = require("express")
const { auth, isAdmin } = require("../middleware/auth")
const { addTrain } = require("../controllers/trainController")
const router = express.Router()

// Route for adding the train into DB by Admin
router.post("/addTrain", auth, isAdmin, addTrain)


module.exports = router