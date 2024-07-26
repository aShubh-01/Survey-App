const express = require('express');
const { createOption, updateOption, deleteOption } = require('../controllers/options');

const optionRouter = express.Router();

optionRouter.post('/', createOption);
optionRouter.put('/:id', updateOption)
optionRouter.delete('/:id', deleteOption)

module.exports = optionRouter