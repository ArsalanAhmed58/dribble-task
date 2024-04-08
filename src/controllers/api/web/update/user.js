const {wrapRequestHandler, success, error} = require("../../../../helpers/response");
const {updateRouter} = require("../../../../routes/updateRouter")
const bcrypt = require("bcryptjs")
const {Pool} = require('pg');
const {userAuthMiddleware} = require("../../../../middleware/AuthMiddleware")

const jwt = require("jsonwebtoken");
const {UserAuthMiddleware} = require("../../../../middleware/AuthMiddleware");
const handler = async (req, res) => {
    let {PGHOST, PGDATABASE, PGUSER, PGPASSWORD} = process.env;
    const pool = new Pool({
        host: PGHOST,
        database: PGDATABASE,
        username: PGUSER,
        password: PGPASSWORD,
        port: 5432,
        ssl: {
            require: true,
        },
    });
    const client = await pool.connect();
    try {
        const {location, image} = req.body;
        const {email} = req.login_token[0]
        console.log(email)
        // Basic validation
        // if (!location) {
        //     return res.send(error('Kindly fill the location field'));
        // }
        //
        // // Check if username or email already exists
        const updateUser = 'UPDATE users SET profileImg = $1 WHERE email=$2 ';
        const existingUserResult = await client.query(updateUser, [image, email]);
        console.log(existingUserResult.rowCount)
        if (existingUserResult.rowCount) {
            return res.send(success('updated Successfully'));
        }
    } catch (error) {
        console.error('Error during sign up:', error);
        res.status(500).json({message: 'Internal server error', msg: error.message,});
    } finally {
        client.release();
    }
}

updateRouter.put("/profile", UserAuthMiddleware(), wrapRequestHandler(handler))