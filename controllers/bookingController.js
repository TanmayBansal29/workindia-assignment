const db = require("../config/db")

// Controller for user to book the train seats
exports.bookSeat = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const userID = req.user.id
        const trainID = req.params.trainID

        const {journeyDate, numberOfSeats} = req.body
        if(!journeyDate || !numberOfSeats) {
            return res.status(400).json({
                success: false,
                message: "Please Enter all the fields"
            })
        }

        await connection.beginTransaction()

        const [train] = await connection.query("SELECT * FROM trains WHERE ID = ?", [trainID])

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

        const totalFare = bookingTrain.Fare * numberOfSeats

        await connection.query(`INSERT INTO bookings (userID, trainID, journeyDate, numberOfSeats, totalFare) 
            VALUES (?, ?, ?, ?, ?)`,
            [userID, trainID, journeyDate, numberOfSeats, totalFare])

        await connection.query("UPDATE trains SET availableSeats = availableSeats - ? WHERE ID = ?", [numberOfSeats, trainID])

        await connection.commit()

        return res.status(200).json({
            success: true,
            message: "Booking is Successful",
            data: {
                bookedTrain: trainID,
                journeyDate: journeyDate,
                seatsBooked: numberOfSeats,
                totalFare: totalFare
            }
        })

    } catch (error) {
        await connection.rollback()
        console.log("Error while booking train: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong booking the train, Please try again"
        })
    } finally {
        connection.release()
    }
}

// Controller to get specific booking details
exports.getBookingDetails = async (req, res) => {
    try {
        const bookingID = req.params.bookingID
        const [booking] = await db.query("SELECT * from bookings WHERE ID = ?", [bookingID])

        if(booking.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Booking Found"
            })
        }

        const bookingDetails = await db.query(`SELECT b.ID AS bookingID, b.journeyDate, b.numberOfSeats, b.totalFare, b.status,
                u.ID as userID, u.firstName, u.lastName, u.email, 
                t.ID as trainID, t.trainNumber, t.name, t.source, t.destination FROM bookings b 
                JOIN users u on userID = u.ID
                JOIN trains t on trainID = t.ID WHERE b.id = ?`, [bookingID])

        return res.status(200).json({
            success: true,
            message: "Booking Details Fetched Successfully",
            data: bookingDetails[0]
        })

    } catch (error) {
        console.log("Error while fetching the booking details", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the booking details. Please try again"
        })
    }
}