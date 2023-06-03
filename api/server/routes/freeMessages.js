const express = require("express");
const router = express.Router();
const { getUserFreeMessages, incrementFreeMessages } = require("../controllers/freeMessagesController");

router.post("/get-free-messages", getUserFreeMessages);
router.post("/increment-free-messages", incrementFreeMessages);

module.exports = router;
