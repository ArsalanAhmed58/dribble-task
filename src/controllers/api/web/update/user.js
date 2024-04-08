const {wrapRequestHandler, success, error} = require("../../../../helpers/response");
const {updateRouter} = require("../../../../routes/updateRouter")
const {UserAuthMiddleware} = require("../../../../middleware/AuthMiddleware");
const bcrypt = require("bcryptjs")
const {Pool} = require('pg');
const {userAuthMiddleware} = require("../../../../middleware/AuthMiddleware")

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
        if (!location) {
            return res.status(500).send(error('Kindly fill the location field'));
        }

        // // Check if username or email already exists
        const updateUser = 'UPDATE users SET profileImg = $1, location = $2 WHERE email=$3 ';
        const existingUserResult = await client.query(updateUser, [image, location, email]);
        console.log(existingUserResult.rowCount)
        if (existingUserResult.rowCount) {
            return res.send(success('updated Successfully'));
        }
    } catch (err) {
        console.error('Error during sign up:', error);
        res.status(500).send(error("Internal server error", err.message))
    } finally {
        client.release();
    }
}

updateRouter.put("/profile", UserAuthMiddleware(), wrapRequestHandler(handler))