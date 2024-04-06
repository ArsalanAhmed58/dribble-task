const {fs} = require("fs");
const {app} = require("../app");
const {wrapRequestHandler} = require("../helpers/response");

// app.get("/*", wrapRequestHandler(async (req, res) => {
//     const data = await new Promise((resolve, reject) => fs.readFile("frontend-assets.json", (error, data) => error ? resolve(error) : reject(data)));
//     const assets = JSON.parse(data);
//     res.render("index", {assets})
// }));