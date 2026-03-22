const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("<h1>Bai 2: Node.js + MongoDB OK!</h1>"));
app.listen(3000);
