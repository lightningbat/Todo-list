const task_schema = require("../schemas/task_schema");
const router = require("express").Router();

router.post("/", async (req, res) => {
    try {
        if (!req.body.id) return res.status(400).send("Please provide task id");
        
        const usersData_coll = req.app.get("usersData_coll");

        let task_data;
        try { task_data = await task_schema.validateAsync(req.body); }
        catch (err) { return res.status(400).send(err.message); }

        const result = await usersData_coll.updateOne(
            { email: req.user.email },
            {
                $set: { 
                    "tasks.$[task].title": task_data.title,
                    "tasks.$[task].description": task_data.description,
                    "tasks.$[task].priority": task_data.priority,
                    "tasks.$[task].completed": task_data.completed
                }
            },
            {
                arrayFilters: [
                    { "task.id": req.body.id }
                ]
            }
        );
        if (result.modifiedCount == 0) return res.status(400).send("Task not found");
        res.status(200).send();
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

module.exports = router