const db = require("../config/db")
const validator = require("validator")
const bcrypt = require("bcryptjs")

exports.registerUser = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body
        if(!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please Enter all the fields"
            })
        }

        const emailValidation = validator.isEmail(email)
        if(!emailValidation) {
            return res.status(400).json({
                success: false,
                message: "Please Enter a valid email address"
            })
        }

        const [existingUser] = await new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, result) => {
                if(err) {
                    return reject(err)
                } 
                resolve(result)
            })
        })

        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exixts with this email."
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await new Promise((resolve, reject) => {
            db.query(`INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)`, 
                [firstName, lastName, email, hashedPassword, 'user'],
            (err, result) => {
                if(err) {
                    return reject(err)
                }
                resolve(result)
            })
        })

        return res.status(200).json({
            success: true,
            message: "User Registered Successfully"
        })
        
    } catch (error) {
        console.log("Error while registering the user", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong registering the user",
            error: error
        })
    }
}