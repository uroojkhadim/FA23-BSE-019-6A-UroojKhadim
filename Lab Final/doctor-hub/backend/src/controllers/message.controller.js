const messageService = require('../services/message.service');
const asyncHandler = require('../utils/asyncHandler');

exports.send = asyncHandler(async (req, res) => {
  const msg = await messageService.sendMessage(req.user.id, req.body);
  res.status(201).json({ success: true, data: msg });
});

exports.conversation = asyncHandler(async (req, res) => {
  const data = await messageService.getConversation(req.user.id, parseInt(req.params.userId, 10));
  res.json({ success: true, data });
});

exports.contacts = asyncHandler(async (req, res) => {
  const data = await messageService.listContacts(req.user.id);
  res.json({ success: true, data });
});
