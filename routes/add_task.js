const task_schema = require("../schemas/task_schema");
const router = require("express").Router();

router.post("/", async (req, res) => {
    try {
        if (!req.body.id || !req.body.parent_id) return res.status(400).send("Please provide task id and parent label id");
        
        const usersData_coll = req.app.get("usersData_coll");

        let task_data;
        try {
            task_data = await task_schema.validateAsync(req.body);
        }
        catch (err) {
            return res.status(400).send(err.message);
        }

        await usersData_coll.updateOne({ email: req.user.email }, { $push: { tasks: task_data } });
        res.status(200).send();
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

module.exports = router