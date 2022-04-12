const { prisma } = require("../db");
function create(req, res) {
    const { address } = req.body;
    const user = await prisma.user.create({ data: { address } });
    res.json(user);
}
