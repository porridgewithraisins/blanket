const express = require("express");
const multer = require("multer");
const { addFile } = require("./routes/files");
const { createProject, deleteProject } = require("./routes/project");
const { createBucket, deleteBucket } = require("./routes/buckets");

const app = express();

const upload = multer({
    dest: './uploads/',
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static("client"));

app.post("/", createProject);
app.delete("/:project_id", deleteProject);
app.post("/:project_id", createBucket);
app.delete("/:project_id/:bucket_id", deleteBucket);
app.post("/:project_id/:bucket_id", upload.single('file'), addFile);

module.exports = app;
