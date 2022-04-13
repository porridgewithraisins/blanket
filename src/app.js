const express = require("express");
const multer = require("multer");
const { addFile } = require("./routes/files");
const {
    createProject,
    deleteProject,
    allProjects,
    readProject,
    updateProject,
} = require("./routes/project");
const { createBucket, deleteBucket, updateBucket, allBuckets, readBucket } = require("./routes/buckets");
const { Router } = require("express");
const { kvAll, kvGet, kvPut, kvDel } = require("./routes/orbit");

const app = express();

const upload = multer({
    dest: "./uploads/",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static("client"));

const projectRouter = new Router();

projectRouter
    .get("/", allProjects)
    .post("/", createProject)
    .get("/:project_id", readProject)
    .put("/:project_id", updateProject)
    .delete("/:project_id", deleteProject)
    .get("/:project_id/buckets", allBuckets)
    .post("/:project_id/buckets", createBucket)
    .get("/:project_id/buckets/:bucket_id", readBucket)
    .put("/:project_id/buckets/:bucket_id", updateBucket)
    .delete("/:project_id/buckets/:bucket_id", deleteBucket)

    .post("/:project_id/buckets/:bucket_id", addFile)

    .get("/:project_id/kv", kvAll)
    .get("/:project_id/kv/:key", kvGet)
    .put("/:project_id/kv", kvPut) //{ key, value }
    .delete("/:project_id/kv/:key", kvDel);

app.use("/api/projects", projectRouter);

module.exports = app;
