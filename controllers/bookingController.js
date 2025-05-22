const db = require("../config/db")

// Controller for user to book the train seats
exports.bookSeat = async (req, res) => {
    try {
        const userID = req.user.ID
        const trainID = req.params.trainID

        const {journeyDate, numberOfSeats, fare} = req.body
        if(!journeyDate || !numberOfSeats || !fare) {
            return res.status(400).json({
                success: false,
                message: "Please Enter all the fields"
            })
        }

        const train = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM trains WHERE ID = ?", [trainID], (err, result) => {
                if(err){
                    return reject(err)
                }
                resolve(result)
            })
        })

        if(train.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Train found"
            })
        }

        const bookingTrain = train[0]
        if(bookingTrain.availableSeats <= 0 || numberOfSeats > bookingTrain.availableSeats) {
            return res.status(400).json({
                success: false,
                message: `Seats Not Available. Available Seats: ${bookingTrain.availableSeats}`
            })
        }

        totalFare = bookingTrain.fare * numberOfSeats

        const booking = await new Promise((resolve, reject) => {
            db.query("INSERT INTO bookings (userID, trainID, journeyDate, numberOfSeats, fare) VALUES (?, ?, ?, ?, ?)",
                [userID, trainID, journeyDate, numberOfSeats, totalFare],
                (err, result) => {
                    if(err){
                        return reject(err)
                    }
                    resolve(result)
                }
            )
        })

        await new Promise((resolve, reject) => {
            db.query("UPDATE trains SET availableSeats = availableSeats - ? WHERE ID = ?", [numberOfSeats, trainID], (err, result) => {
                if(err){
                    return reject(err)
                }
                resolve(result)
            })
        })

        return res.status(200).json({
            success: false,
            message: "Booking is Successfuly",
            data: {
                bookedTrain: trainID,
                journeyDate: journeyDate,
                seatsBooked: numberOfSeats,
                totalFare: fare
            }
        })

    } catch (error) {
        console.log("Error while booking train: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong booking the train, Please try again"
        })
    }
}