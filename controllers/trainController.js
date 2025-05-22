const db = require("../config/db")

exports.addTrain = async (req, res) => {
    try {
        const {trainNumber, name, source, destination, totalSeats, availableSeats} = req.body
        if(!trainNumber || !name || !source || !destination || !totalSeats || !availableSeats) {
            return res.status(400).json({
                success: false,
                message: "Please Enter all the details"
            })
        }

        const train = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM trains WHERE trainNumber = ?", [trainNumber], (err, result) => {
                if(err) {
                    return reject(err)
                }
                resolve(result)
            })
        })

        if(train.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Train already scheduled for other route"
            })
        }

        const trainEntry = await new Promise((resolve, reject) => {
            db.query("INSERT INTO trains (trainNumber, name, source, destination, totalSeats, availableSeats) VALUES (?, ?, ?, ?, ?, ?)",
                [trainNumber, name, source, destination, totalSeats, availableSeats],
                (err, result) => {
                    if(err) {
                        reject(err)
                    }
                    resolve(result)
                }
            )
        })

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
        const {source, destination} = req.body
        if(!source || !destination) {
            return res.status(400).json({
                success: false,
                message: "Please Enter all the fields"
            })
        }

        const trains = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM trains WHERE source = ? AND destination = ?", [source, destination], (err, result) => {
                if(err) {
                    return reject(err)
                }
                resolve(result)
            })
        })

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