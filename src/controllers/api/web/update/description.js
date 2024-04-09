const {wrapRequestHandler, success, error} = require("../../../../helpers/response");
const {updateRouter} = require("../../../../routes/updateRouter")
const {UserAuthMiddleware} = require("../../../../middleware/AuthMiddleware");
const bcrypt = require("bcryptjs")
const {validate} = require("../../../../helpers/validations")
const {body} = require("express-validator")
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
        const {description} = req.body;
        const {email} = req.login_token[0]
        // // Check if username or email already exists
        const updateUser = 'UPDATE users SET description = $1 WHERE email=$2 ';
        const existingUserResult = await client.query(updateUser, [description, email]);
        if (existingUserResult.rowCount) {
            return res.send(success('description updated Successfully'));
        }
    } catch (err) {
        console.error('Error during sign up:', error);
        res.status(500).send(error("Internal server error", err.message))
    } finally {
        client.release();
    }
}

updateRouter.put("/description", UserAuthMiddleware(),
    validate([
        body("description").notEmpty().withMessage("Kindly select any one")
    ]),
    wrapRequestHandler(handler))