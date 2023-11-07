/**
 * create database
 * kv get
 * kv put
 * kv delete
 */
const { repo } = require("../orbit");

module.exports.createDb = async (req, res, next) => {
    const { project_id } = req.params;
    await repo.init(project_id).catch(console.log);
    res.send({ msg: "OK" });
};
module.exports.kvGet = async (req, res, next) => {
    const db = repo.getDb(req.params.project_id);
    const { key } = req.params;
    res.send({
        val: db.get(key),
    });
};
module.exports.kvPut = async (req, res, next) => {
    const db = repo.getDb(req.params.project_id);
    const { key, val } = req.body;
    console.log(req.body);
    await db.put(key, val);
    res.send({ msg: "OK" });
};
module.exports.kvDel = async (req, res, next) => {
    const db = repo.getDb(req.params.project_id);
    const { key } = req.params;
    const mh = await db.del(key);
    res.send({ msg: "OK", mh });
};

module.exports.kvAll = async (req, res, next) => {
    const db = repo.getDb(req.params.project_id);
    console.log(db)
    try {
        res.send({ all: db.all });
    } catch (e) {
        console.error(e);
        res.send({ all: null })
    }
};
