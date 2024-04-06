require("dotenv").config();
require("url-search-params-polyfill");
const createRouter = require("./routes/createRouter")
const {error} = require("./helpers/response")
const {PORT, HOST} = process.env;
const {app} = require('./app');
const requireDir = require("require-dir");
const server = require("http").createServer(app);

requireDir("./controllers", {recurse: true});

requireDir("./routes");

app.use(function (err, req, res, next) {
    res.json(error(err.message));
})

server.listen(Number(PORT), HOST, async () => {
    console.log(`listening on http://${HOST}:${PORT}`);
});