const {Router} = require("express");
const {apiRouter} = require('./apiRouter');

const deleteRouter = Router();
apiRouter.use('/delete', deleteRouter);

module.exports = {deleteRouter}