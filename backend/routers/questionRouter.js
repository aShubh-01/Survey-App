const express = require('express');
const { createQuestion, updateQuestion, toggleRequirement, deleteQuestion } = require('../controllers/question');

const questionRouter = express.Router();

questionRouter.post('/', createQuestion);
questionRouter.put('/required/:id', toggleRequirement);
questionRouter.put('/:id', updateQuestion)
questionRouter.delete('/:id', deleteQuestion)

module.exports = questionRouter