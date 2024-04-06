const {Router} = require("express");
const {apiRouter} = require("./apiRouter")

const createRouter = Router();

apiRouter.use('/create', createRouter);

module.exports = {createRouter};