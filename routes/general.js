const path = require('path');
const express = require('express');
const Controller = require('../controllers/general');
const router = express.Router();
router.post('/get-ai-response', Controller.getAIResponse);
module.exports = router;