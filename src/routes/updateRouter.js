const {Router} = require("express");
const {apiRouter} = require('./apiRouter');

const updateRouter = Router();

apiRouter.use('/update', updateRouter);

module.exports = {updateRouter};