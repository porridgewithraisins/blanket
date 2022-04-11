const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
});

const Project = sequelize.define("Project", {
    name: {
        type: String,
        allowNull: false,
    },
    description: { type: String },
});

const Bucket = sequelize.define("Bucket", {
    name: {
        type: String,
        allowNull: false,
    },
});

const File = sequelize.define("File", {
    cid: {
        type: String,
        allowNull: false,
    },
    filename: {
        type: String,
        allowNull: false,
    },
});

Project.hasMany(Bucket);
Bucket.belongsTo(Project);

Bucket.hasMany(File);
File.belongsTo(Bucket);

module.exports = {
    Project,
    Bucket,
    File,
};
