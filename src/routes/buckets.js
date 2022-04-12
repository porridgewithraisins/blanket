const { prisma } = require("../db");

async function createBucket(req, res, next) {
    const { name } = req.body;
    const { project_id } = req.params;

    const bucket = await prisma.bucket.create({
        data: { name, projectId: Number(project_id) },
    });

    res.send({ id: bucket.id });
}

async function deleteBucket(req, res, next) {
    const { project_id } = req.params;

    await prisma.bucket.delete({ where: { id: Number(project_id) } });

    res.send({ msg: "OK" });
}

module.exports = { createBucket, deleteBucket };
