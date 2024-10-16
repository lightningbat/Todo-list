const router = require("express").Router();

router.post("/", async (req, res) => {
    try {
        if (!req.body.hasOwnProperty("theme")) return res.status(400).send("Please provide theme");
        if (typeof req.body.theme !== "boolean") return res.status(400).send("Theme must be boolean");

        const usersData_coll = req.app.get("usersData_coll");

        const result = await usersData_coll.updateOne({ email: req.user.email }, { $set: { theme: req.body.theme } });

        if (result.modifiedCount == 0) return res.status(400).send("User not found/no changes made");

        res.status(200).send();
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

module.exports = router;