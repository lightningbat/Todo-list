const router = require("express").Router();

router.post("/", async (req, res) => {
    try {
        const usersData_coll = req.app.get("usersData_coll");

        const result = await usersData_coll.findOne({ email: req.user.email }, { projection: { _id: 0, theme: 1 } });

        res.status(200).send(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

module.exports = router;