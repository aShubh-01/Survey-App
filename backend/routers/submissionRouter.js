const express = require('express');
const { fetchResponses, submitResponse } = require('../controllers/submission');

const submissionRouter = express.Router();

submissionRouter.get('/responses/:id', fetchResponses);
submissionRouter.post('/', submitResponse)

module.exports = submissionRouter;