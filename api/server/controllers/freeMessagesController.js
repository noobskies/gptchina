// controllers/freeMessagesController.js
const User = require("../../models/User");

const getUserFreeMessages = async (req, res) => {
    try {
      console.log("Received request:", req.body);
      const { userId } = req.body;
  
      if (!userId) {
        res.status(400).json({ error: "UserId is missing" });
        return;
      }

    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const freeMessages = user.getFreeMessages();

    if (typeof freeMessages !== 'number') {
      res.status(500).json({ error: "Error retrieving free messages" });
      return;
    }

    res.status(200).json({ freeMessages });
  } catch (error) {
    console.error("Error in getUserFreeMessages:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserFreeMessages };
