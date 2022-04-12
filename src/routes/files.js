const ethers = require("ethers");
const ipfsClient = require("ipfs-http-client");
const fs = require("fs/promises");
const { prisma } = require("../db");
module.exports = {
  async addFile(req, res, next) {
    console.log(req.file);
    if (!req.file) {
      res.status(400).send({ msg: "No files were uploaded." });
      return;
    }
    const file = req.file;
    const { fileName } = req.body;
    const { bucket_id } = req.params;

    const fileDetail = await addFileAuth(file.path);

    await fs.unlink(file.path);

    const cid = fileDetail.cid.toString().slice();

    await prisma.file.create({
      data: { cid, name: fileName, bucketId: Number(bucket_id) },
    });
    console.log(cid);
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
