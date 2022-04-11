const express = require("express");
const fileupload = require("express-fileupload");
const { addFile } = require("./routes/files");
const { createProject, deleteProject } = require("./routes/project");
const { createBucket, deleteBucket } = require("./routes/buckets");

const app = express();

app.use(fileupload());
app.use(express.urlencoded({ extended: true }));

app.post("/", createProject);
app.delete("/:project_id", deleteProject);
app.post("/:project_id/", createBucket);
app.delete("/:project_id/:bucket_id", deleteBucket);
app.post("/:project_id/:bucket_id/", addFile);

module.exports = app;
