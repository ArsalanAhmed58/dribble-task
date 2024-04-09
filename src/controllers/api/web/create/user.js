const {wrapRequestHandler, success, error} = require("../../../../helpers/response");
const {createRouter} = require("../../../../routes/createRouter")
const bcrypt = require("bcryptjs")
const {Pool} = require('pg');
const jwt = require("jsonwebtoken");
const {Resend} = require("resend")
const axios = require("axios")
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
        const {name, username, email, password} = req.body;
        console.log(name, username, email, password)
        // Basic validation
        if (!name || !username || !email || !password) {
            return res.send(error('All fields are required'));
        }

        // Check if username or email already exists
        const existingUserQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
        const existingUserResult = await client.query(existingUserQuery, [username, email]);
        console.log(existingUserResult.rowCount)
        if (existingUserResult.rowCount) {
            return res.send(error('Username or email already exists'));
        }

        // Hash password (you can use bcrypt or any other library)
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password here

        // Create user in the database
        const insertQuery = `
        INSERT INTO users (name, username, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *`;
        const values = [name, username, email, hashedPassword];
        const newUser = await client.query(insertQuery, values)
        const user = newUser.rows[0]
        const generatedToken = jwt.sign(
            {user_id: user.id, name: user.name, email: user.email, username: user.username},
            process.env.APP_TOKEN_KEY,
        );
        // console.log(generatedToken)
        const tokenData = await client.query(`
        INSERT INTO usertokens (token, userid)
        VALUES ($1, $2)
        RETURNING *`, [generatedToken, user.id])
        delete newUser.rows[0].password
        const resend = new Resend('re_fA41L2rw_2PUkkjzCEMuxuukC16pGGErm');


        try {
            resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'arsalanahmed11873@gmail.com',
                subject: 'Hello World',
                html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
            });
            console.log('Email sent successfully!');
            console.log('Response:', );
        } catch (error) {
            console.error('Error sending email:', error.response.data);
        }

        res.status(201).send(success('User created successfully', {
            user: newUser.rows[0],
            tokenData: tokenData.rows[0]
        }));

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({message: 'Internal server error', msg: error.message});
    } finally {
        client.release();
    }
}

createRouter.post("/sign-up", wrapRequestHandler(handler))