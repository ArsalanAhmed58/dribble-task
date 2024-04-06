const { Pool } = require("pg");
const { success, error } = require("../helpers/response");
const jwt = require("jsonwebtoken")

// ---------------------USER-----------------
const UserAuthMiddleware = () => async (req, res, next) => {
    let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
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
    // console.log(req.headers,"pppppppppppppppppp")
    const errorMessage = "Invalid Token Or Token expired or Unauthorized";
    const code = 401;
    let token_id = req.headers.authorization || req.query?.token_id || "";
    token_id = token_id.replace("Bearer ", "");
    if (!token_id) return res.status(401).send(error(errorMessage));
    try {
        const user = jwt.verify(token_id, process.env.APP_TOKEN_KEY);
    } catch (e) {
        return res.status(401).send(error(errorMessage))
    }

    const token = await client.query(`SELECT u.*, s.*
    FROM usertokens u
    INNER JOIN users s ON u.userid = s.id
    WHERE u.token = $1`, [token_id]);
    // res.json(token)

    if (!(token.rows)) {
        return res.status(401).send(error(errorMessage, code));
    }
    req.login_token = token.rows;

    next();
};

// ---------------------APP-USER-----------------
const AppUserAuthMiddleware = () => async (req, res, next) => {
    const errorMessage = "Invalid Token Or Token expired or Unauthorized";
    const code = 401;
    let token_id = req.headers.authorization || req.query?.token_id || "";
    token_id = token_id.replace("Bearer ", "");
    if (!token_id) return res.status(401).send(error(errorMessage));
    try {
        const user = jwt.verify(token_id, process.env.APP_TOKEN_KEY);
    } catch (e) {
        return res.status(401).send(error(errorMessage))
    }
    
    req.login_token = token;
    next();
};
module.exports = {
    UserAuthMiddleware,
    AppUserAuthMiddleware
};
