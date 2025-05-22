const db = require("../config/db")

exports.addTrain = async (req, res) => {
    try {
        // Destructuring the fields from req.body
        const {trainNumber, name, source, destination, totalSeats, availableSeats, fare} = req.body

        // Checking - All fields are filled or not
        if(!trainNumber || !name || !source || !destination || !totalSeats || !availableSeats || !fare) {
            return res.status(400).json({
                success: false,
                message: "Please Enter all the details"
            })
        }

        const [train] = await db.query("SELECT * FROM trains WHERE trainNumber = ?", [trainNumber])
        // checking - whether train exists or not
        if(train.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Train with the same train number already exists"
            })
        }

        // Creating a train entry into database table
        const trainEntry = await db.query("INSERT INTO trains (trainNumber, name, source, destination, totalSeats, availableSeats, fare) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [trainNumber, name, source, destination, totalSeats, availableSeats, fare])

        return res.status(200).json({
            success: true,
            message: "Train Added Successfully",
            data: trainEntry
        })

    } catch (error) {
        console.log("Error adding the train: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong adding the train. Please try again"
        })
    }
}

// Controller to get the train from source to destination
exports.getTrains = async(req, res) => {
    try {
        // Destructuring the fields from req.body
        const {source, destination} = req.body

        // Checking - All fields are filled or not
        if(!source || !destination) {
            return res.status(400).json({
                success: false,
                message: "Please Enter all the fields"
            })
        }

        const [trains] = await db.query("SELECT * FROM trains WHERE source = ? AND destination = ?", [source, destination])
        // Checking - whether we have trains from source to destination or not
        if(trains.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No train found for specified source and destination"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Trains fetched successfully",
            data: trains
        })

    } catch (error) {
        console.log("Error while fetching the trains data: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching the trains data"
        })
    }
}