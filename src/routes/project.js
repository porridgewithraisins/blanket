const { prisma } = require("../db");

const createProject = async (req, res) => {
    const { name, description } = req.body;

    const project = await prisma.project.create({ data: { name, description } });

    res.json({ id: project.id });
};

const deleteProject = async (req, res) => {
    const { project_id } = req.params;

    await prisma.project.delete({ where: { id: project_id } });

    res.send({ msg: "OK" });
};

module.exports = {
    createProject,
    deleteProject,
};
