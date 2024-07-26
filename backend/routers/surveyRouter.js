const express = require('express');
const { checkUser } = require('./middlewares/userMiddleware');
const { getSurveys, publishSurvey, getSurvey, createSurvey, updateSurvey, deleteSurvey } = require('../controllers/survey');

const surveyRouter = express.Router();

surveyRouter.use(checkUser);

surveyRouter.get('/all', getSurveys);
surveyRouter.put('/publish/:id', publishSurvey);
surveyRouter.get('/:id', getSurvey);
surveyRouter.post('/', createSurvey);
surveyRouter.put('/:id', updateSurvey);
surveyRouter.delete('/:id', deleteSurvey);

module.exports = surveyRouter