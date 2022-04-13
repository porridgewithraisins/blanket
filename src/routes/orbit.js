/**
 * create database
 * kv get
 * kv put
 * kv delete
 */
const { repo } = require('../orbit');

export const createDb = async (req, res, next) => {
    const { project_id } = req.params;
    await repo.init(project_id);
    res.send({ msg: "OK" });
}
export const kvGet = (req, res, next) => {
    const db = repo.getDb(req.params.project_id);
    const { key } = req.params;
    res.send({
        val: db.get(key)
    });
}
export const kvPut = (req, res, next) => {
    const db = repo.getDb(req.params.project_id);
    const { key, val } = req.body;
    await db.put(key, val);
    res.send({ msg: "OK" });

}
export const kvDel = (req, res, next) => {
    const db = repo.getDb(req.params.project_id);
    const { key } = req.params;
    const mh = await db.del(key);
    res.send({ msg: "OK", mh });
}

export const kvAll = (req, res, next) => {
    const db = repo.getDb(req.params.project_id);
    res.send({ all: db.all });
}