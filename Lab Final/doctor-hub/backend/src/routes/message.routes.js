const express = require('express');
const messageController = require('../controllers/message.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', messageController.send);
router.get('/contacts', messageController.contacts);
router.get('/:userId', messageController.conversation);

module.exports = router;
