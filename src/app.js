const express = require("express");
const os = require("os");
const app = express();
const response = require("./helpers/response")
const fileUpload = require("express-fileupload");
const cors = require("cors");
// const models = require("./models")
app.use(cors(
    {
        origin: "*"
    }
))

app.get("assets/images/*", (req, res) => {
    res.sendfile("assets/images/" + req.params[0]);
});

app.use(fileUpload({
    userTempFiles: true,
    tempFileDir: os.tmpdir(),
    preserveExtension: true,
    parseNested: true
}));

app.use((req, res, next) => {
    req.body = {
        ...req.body,
        ...req.files
    };
    +next();
})

app.use(express.json());
app.use(express.static("assets"));

module.exports = {
    app,
    // models,
    response
}
