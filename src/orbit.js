const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

const ipfs = ipfs.create()
const orbitdb = await OrbitDB.createInstance(ipfs)
module.exports = { orbitdb }