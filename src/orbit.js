const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

const ipfs = new IPFS()
const orbitdb = await OrbitDB.createInstance(ipfs)
module.exports = { orbitdb }