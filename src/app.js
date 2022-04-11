const express = require("express");
const fileupload = require("express-fileupload");
const { sequelize } = require("./models");
const { addFile } = require("./routes/files");

const app = express();

sequelize.sync();

app.use(fileupload());
app.use(express.urlencoded({ extended: true }));

app.post("/upload", addFile);

module.exports = app;
