const express = require("express");
const path = require("path");
const app = express();

app.use("/ECommerceHub", express.static(path.join(__dirname, "dist")));
app.get("/ECommerceHub/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});