const db = require("../config/db")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

// Controller for user to login into the system
exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the values"
            })
        }

        const [user] = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
                if (err) {
                    return reject(err)
                }
                resolve(result)
            })
        })

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User is not registered. Please register first"
            })
        }

        if(await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                {email: user.email, id: user.ID, role: user.role},
                process.env.JWT_SECRET,
                {expiresIn: '4h'}
            )

            const {password: _, ...userData} = user

            res.cookie("token", token).status(200).json({
                success: true,
                token,
                user: userData,
                message: "Login Successful"
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            })
        }
    } catch (error) {
        console.log("Error while logging in User: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong logging the user"
        })
    }
}