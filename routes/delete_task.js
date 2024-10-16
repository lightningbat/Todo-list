const router = require("express").Router();

router.delete("/", async (req, res) => {
    try {
        if (!req.body.id) return res.status(400).send("Please provide task id");
        
        const usersData_coll = req.app.get("usersData_coll");

        const result = await usersData_coll.updateOne({ email: req.user.email }, { $pull: { tasks: { id: req.body.id } } });

        if (result.modifiedCount == 0) return res.status(400).send("Task not found");
        res.status(200).send();
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

module.exports = router