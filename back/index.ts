const express = require("express");
const app = express();
const food = require("./routes/food");

app.use(express.json());
app.use("/api/food", food);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = server;
