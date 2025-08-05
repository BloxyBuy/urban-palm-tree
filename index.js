const express = require('express');
const app = express();

// Respond to root URL to show the bot is alive
app.get('/', (req, res) => {
  res.send('I am alive!');
});

// Use the port Render gives you or fallback to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

const { mineboty } = require("./mineboty");
mineboty();
