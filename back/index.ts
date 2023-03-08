const express = require("express");
const app = express();

app.use(express.json());
app.use("/api/food", require("./routes/food"));

const PORT = process.env.PORT || 3000;
const server = app.listen(3000, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = server;
