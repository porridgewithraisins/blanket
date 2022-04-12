const ethers = require("ethers");
const ipfsClient = require("ipfs-http-client");
const fs = require("fs/promises");
const { prisma } = require("../db");

const polkadot = require("@polkadot/api");
const crustio = require("@crustio/type-definitions");
// const keyring = require("@polkadot/keyring");
const keyringPair = require("@polkadot/keyring/pair");

const { waitReady } = require("@polkadot/wasm-crypto");
const { Keyring, WsProvider } = require("@polkadot/api");
const { resolve } = require("path");

const crustChainEndpoint = "wss://rpc.crust.network";
const Wsprovider = new polkadot.WsProvider(crustChainEndpoint);

module.exports = {
    async addFile(req, res, next) {
        const file = req.files.file;
        const { fileName } = req.body;
        const { bucket_id, project_id } = req.params;

        const filePath = "files/" + fileName;

        await file.mv(filePath);

        const fileDetail = await uploadFile(filePath);

        await fs.unlink(filePath);

        const cid = fileDetail.cid.toString().slice();

        await prisma.file.create({ data: { cid, name: fileName, bucketId: Number(bucket_id) } });

        const { seed_phrase } = await prisma.project.findUnique({
            where: { id: Number(project_id) },
        });

        await placeCrustOrder(cid, fileDetail.cumulativeSize, seed_phrase);

        res.json({ cid });
    },
};

async function uploadFile(file_path) {
    const pair = ethers.Wallet.createRandom();
    const sig = await pair.signMessage(pair.address);
    const authHeaderRaw = `eth-${pair.address}:${sig}`;
    const authHeader = Buffer.from(authHeaderRaw).toString("base64");
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

async function placeCrustOrder(cid, fileSize, seed_phrase) {
    await waitReady();
    const api = new polkadot.ApiPromise({
        provider: WsProvider,
        typesBundle: crustio.typesBundleForPolkadot,
    });

    await api.isReady;

    const transaction = api.tx.market.placeStorageOrder(cid, fileSize);

    const keyring = new Keyring({ type: "sr25519" });

    const krp = keyring.addFromSeed(new TextEncoder("utf-8").encode(seed_phrase));

    await api.isReadyOrError;

    return transaction.signAndSend(krp, ({ events = [], status }) => {
        if (!status.isInBlock) return;
        if (events.some(event => event.event.method === "ExtrinsicSuccess")) {
            console.log("StorageOrderPlaced");
        }
    });
}
