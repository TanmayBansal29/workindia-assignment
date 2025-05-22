const jwt = require("jsonwebtoken")

// auth middleware that verifies whether the jwt token is valid or not
exports.auth = async(req, res, next) => {
    try {
        // Extracting the token
        const token = req.cookies?.token || req.body?.token || req.header("Authorization").replace("Bearer", " ")
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }

        // Verifying the token
        try {
            const decode = jwt.verify(token, process.env.JWT_HEADER)
            req.user = decode
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong while validating the token"
            })
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong validating the user"
        })
    }
}

exports.isAdmin = async(req, res, next) => {
    const key = req.header('api-key-admin')
    if(key !== process.env.API_ADMIN){
        return res.status(403).json({
            success: false,
            message: "Unauthorized Access: Only for admins"
        })
    }
    next();
}

exports.isUser = async(req, res, next) => {
    if(req.user?.role !== "user") {
        return res.status(403).json({
            success: false,
            message: "Unauthorized Access: Only for Users"
        })
    }
    next();
}