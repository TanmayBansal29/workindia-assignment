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

        const [existingUser] = await db.query(`SELECT * FROM users WHERE email = ?`, [email])

        if(existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User already exixts with this email."
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await db.query(`INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)`, 
                [firstName, lastName, email, hashedPassword, 'user'])

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

        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email])

        if(users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User is not registered. Please register first"
            })
        }

        const user = users[0]
        
        if(await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                {ID: user.ID, email: user.email, id: user.ID, role: user.role},
                process.env.JWT_SECRET,
                {expiresIn: '4h'}
            )

            const {password: _, ...userData} = user

            res.cookie("token", token, {expires: new Date(Date.now() + 5 * 3600000)}).status(200).json({
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