const express = require('express');
const userRouter = require('../routers/userRouter');
const surveyRouter = require('../routers/surveyRouter')
const questionRouter = require('../routers/questionRouter');
const optionRouter = require('../routers/optionRouter');
const submissionRouter = require('../routers/submissionRouter');
const runScheduledTasks = require('../schedule');
const { port } = require('../config')

const mainRouter = express();

mainRouter.use(express.json())

mainRouter.get('/', (req, res) => {res.send("API Working")});

mainRouter.use('/users', userRouter);
mainRouter.use('/surveys', surveyRouter);
mainRouter.use('/questions', questionRouter);
mainRouter.use('/options', optionRouter);
mainRouter.use('/submission', submissionRouter);

runScheduledTasks()

mainRouter.listen(port, () => {
    console.log("Backend running on " + port)
})