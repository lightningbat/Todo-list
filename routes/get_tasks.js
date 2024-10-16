const router = require("express").Router();

router.post("/", async (req, res) => {
    try {
        if (!req.body.parent_id) return res.status(400).send("Please provide parent label id");

        const usersData_coll = req.app.get("usersData_coll");

        const result = await usersData_coll.aggregate([
            { $match: { email: req.user.email } },
            { "$unwind": "$tasks" },
            { "$match": { "tasks.parent_id": req.body.parent_id } },
            { "$replaceRoot": { "newRoot": "$tasks" } }
        ]).toArray();

        res.status(200).send(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

module.exports = router