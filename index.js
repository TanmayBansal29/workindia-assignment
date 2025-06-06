const express = require("express")
const db = require("./config/db")
require("dotenv").config()
const authRoutes = require("./routes/authRoute")
const trainRoutes = require("./routes/trainRoute")
const bookingRoutes = require("./routes/bookingRoute")
const cookieParser = require("cookie-parser")

const app = express()
app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log("Server is Running on Port: ", PORT)
})

app.use("/api/v1/user", authRoutes)
app.use("/api/v1/train", trainRoutes)
app.use("/api/v1", bookingRoutes)

app.get("/", (req, res) => {
    db.query('SELECT NOW()', (err, result) => {
        if(err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            })
        }
        res.status(200).json({
            success: true,
            message: "Default Route Successfully Running",
            data: result
        })
    })
})