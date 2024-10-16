const label_schema = require("../schemas/label_schema");
const router = require("express").Router();

router.post("/", async (req, res) => {
    try {
        if (!req.body.id) return res.status(400).send("Please provide label id");

        const usersData_coll = req.app.get("usersData_coll");

        let label_data;
        try {
            label_data = await label_schema.validateAsync(req.body);
        }
        catch (err) {
            return res.status(400).send(err.message);
        }
        
        await usersData_coll.updateOne({ email: req.user.email }, { $push: { labels: label_data } });
        res.status(200).send();
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

module.exports = router