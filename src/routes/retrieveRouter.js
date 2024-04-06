const {Router} = require("express");
const {apiRouter} = require('./apiRouter');

const retrieveRouter = Router();

apiRouter.use('/retrieve', retrieveRouter);

module.exports = {retrieveRouter};