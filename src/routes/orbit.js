/**
 * create database
 * kv get
 * kv put
 * kv delete
 */
const { orbit } = require('../orbit');

const genDbName = (user, projectId) => {
    // todo: replace with deterministic db name generator
    return `${user}.${projectId}`;
}

export const createDb = async (req, res, next) => {
    const { project_id } = req.params;
    await orbit.keyvalue(genDbName('user', project_id));
    res.send({ msg: "OK" });
}
export const kvGet = (req, res, next) => {
    const db = await orbit.keyvalue(genDbName('user', project_id));
    const { key } = req.body;
    res.send({
        val: db.get(key)
    });
}
export const kvPut = (req, res, next) => {
    const db = await orbit.keyvalue(genDbName('user', project_id));
    const { key, val } = req.body;
    await db.put(key, val);
    res.send({ msg: "OK" });

}
export const kvDel = (req, res, next) => {
    const db = await orbit.keyvalue(genDbName('user', project_id));
    const { key } = req.body;
    const mh = await db.del(key);
    res.send({ msg: "OK", mh });
}

export const kvAll = (req, res, next) => {
    const db = await orbit.keyvalue(genDbName('user', project_id));
    res.send({ all: db.all });
}