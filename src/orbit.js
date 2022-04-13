const IPFS = require("ipfs");
const OrbitDB = require("orbit-db");

const ipfs = new IPFS();
const orbit = await OrbitDB.createInstance(ipfs);

class Repository {
    constructor() {
        this.dbs = {};
    }

    async init(projectId) {
        this.dbs[projectId] = await orbit.keyvalue(`${projectId}`);
    }

    getDb(projectId) {
        return this.dbs[projectId];
    }
}

const repo = new Repository();

module.exports = { repo };
