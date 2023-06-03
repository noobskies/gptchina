// routes/freeMessages.js
const express = require("express");
const router = express.Router();
const { getUserFreeMessages } = require("../controllers/freeMessagesController");

router.post("/get-free-messages", getUserFreeMessages);

module.exports = router;
