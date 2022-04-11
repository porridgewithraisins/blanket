const {Project} = require('../models');

const createProject = (req, res) => {
  const { name, description } = req.body;
  const project = new Project({
    name,
    description,
  });
  try {
    project.save();
    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Creating a project failed",
      error,
    });
  }
};

const deleteProject = (req, res) => {
  const { id } = req.params;
  const project = await Project.findByPk(id);
  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }
  try {
    await project.destroy();
    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Deleting project failed",
      error,
    });
  }
};
