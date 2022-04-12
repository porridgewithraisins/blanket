const ethers = require("ethers");
const ipfsClient = require("ipfs-http-client");
const fs = require("fs/promises");
const { prisma } = require("../db");

const crustio = require("@crustio/type-definitions");

const { waitReady } = require("@polkadot/wasm-crypto");
const { Keyring, WsProvider, ApiPromise } = require("@polkadot/api");

const crustChainEndpoint = "wss://rpc.crust.network";
const wsProvider = new WsProvider(crustChainEndpoint);

module.exports = {
    async addFile(req, res) {
        const file = req.file;
        const { fileName } = req.body;
        const { bucket_id, project_id } = req.params;

        const { cid, size } = await uploadFile(file.path);

        await fs.unlink(file.path);

        const { seed_phrase } = await prisma.project.findUnique({
            where: { id: Number(project_id) },
        });

        await placeCrustOrder(cid, size, seed_phrase);

        await prisma.file.create({
            data: { cid, name: fileName, bucketId: Number(bucket_id) },
        });

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

    const fileStat = await ipfs.files.stat("/ipfs/" + cid);

    return {
        cid: fileStat.cid.toString().slice(),
        size: fileStat.cumulativeSize,
    };
}

async function placeCrustOrder(cid, fileSize, seed_phrase) {
    await waitReady();
    const api = new ApiPromise({
        provider: wsProvider,
        typesBundle: crustio.typesBundleForPolkadot,
    });

    await api.isReady;

    const transaction = api.tx.market.placeStorageOrder(cid, fileSize, 0, "");

    const keyring = new Keyring({ type: "sr25519" });

    const krp = keyring.addFromUri(seed_phrase);

    await api.isReadyOrError;

    return transaction.signAndSend(krp, ({ events = [], status }) => {
        if (!status.isInBlock) return;
        if (events.some(event => event.event.method === "ExtrinsicSuccess")) {
            console.log("✅  StorageOrderPlaced");
        }
    });
}
