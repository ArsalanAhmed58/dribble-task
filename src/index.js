require("dotenv").config();
require("url-search-params-polyfill");
const createRouter = require("./routes/createRouter")
const { HOST} = process.env;
const PORT = process.env.PORT || 3000;
const {error} = require("./helpers/response")
const {app} = require('./app');
const requireDir = require("require-dir");
const server = require("http").createServer(app);

requireDir("./controllers", {recurse: true});

requireDir("./routes");

app.use(function (err, req, res, next) {
    res.json(error(err.message));
})

server.listen(Number(PORT), HOST, async () => {
    console.log(`listening on http://0.0.0.0:3000`);
});