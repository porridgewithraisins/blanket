const ethers = require("ethers");
const ipfsClient = require("ipfs-http-client");
const fs = require("fs/promises");
const { File } = require("../models");

module.exports = {
    async addFile(req, res, next) {
        const file = req.files.file;
        const { fileName, bucketId } = req.body;

        const filePath = "files/" + fileName;

        await file.mv(filePath);

        const fileDetail = await addFileAuth(filePath);

        await fs.unlink(filePath);

        const cid = fileDetail.cid.toString().slice();

        await File.create({ cid, fileName, BucketId: bucketId });

        res.json({ cid });
    },
};

async function addFileAuth(file_path) {
    const pair = ethers.Wallet.createRandom();
    console.log(pair);
    const sig = await pair.signMessage(pair.address);
    console.log(sig);
    const authHeaderRaw = `eth-${pair.address}:${sig}`;
    console.log(authHeaderRaw);
    const authHeader = Buffer.from(authHeaderRaw).toString("base64");
    console.log(authHeader);
    const ipfsW3GW = "https://crustipfs.xyz";

    const fileBuffer = await fs.readFile(file_path);

    const ipfs = ipfsClient.create({
        url: `${ipfsW3GW}/api/v0`,
        headers: {
            authorization: `Basic ${authHeader}`,
        },
    });

    const { cid } = await ipfs.add({
        path: file_path,
        content: fileBuffer,
    });
    console.log(cid);

    const fileStat = await ipfs.files.stat("/ipfs/" + cid);
    console.log("FILESTAT");
    console.log(fileStat);

    return {
        cumulativeSize: fileStat.cumulativeSize,
        cid: fileStat.cid,
    };
}
