const express = require("express")
const db = require("./config/db")
require("dotenv").config()
const app = express()
app.use(express.json())

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log("Server is Running on Port: ", PORT)
})

app.get("/", (req, res) => {
    db.query('SELECT NOW()', (err, result) => {
        if(err) {
            res.status(500).json({
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