const { Bucket } = require('../models');

function createBucket(req, res, next) {
    const { name } = req.body;
    const { projectId } = req.params;

    const bucket = await Bucket.create({
        name, projectId
    });

    res.send({ "msg": "OK" });
}

function deleteBucket(req, res, next) {
    const { name } = req.body;
    const { projectId } = req.params;

    const bucket = await Bucket.findOne({
        name, projectId
    })

    bucket.destroy();
    res.send({ "msg": "OK" });
}