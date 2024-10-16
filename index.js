require('dotenv').config();
const client = require('./config/database');
const authentication = require('./middlewares/auth');
const express = require('express');

const app = express();

client.connect()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error(err);
    });

(async () => {
    //  making variables global
    try {
        app.set("users_coll", await client.db("ToDo").collection("users"));
        app.set("usersData_coll", await client.db("ToDo").collection("users_data"));
    }
    catch (err) { console.error(err); }
})();

app.use(require('./middlewares/rateLimiter'));
app.use(express.json({ limit: "5kb" }));

// static sites
app.use("/SignUp", express.static("./client-side/To-Do_Auth/register.html"));
app.use("/LogIn", express.static("./client-side/To-Do_Auth/login.html"));
app.use("/", express.static("./client-side/To-Do_list"));

// server side routes
app.use("/register", require('./routes/register'));
app.use("/login", require('./routes/login'));
app.use("/get_theme", authentication, require('./routes/get_theme'));
app.use("/set_theme", authentication, require('./routes/set_theme'));
app.use("/get_tasks", authentication, require('./routes/get_tasks'));
app.use("/get_labels", authentication, require('./routes/get_labels'));
app.use("/add_label", authentication, require('./routes/add_label'));
app.use("/add_task", authentication, require('./routes/add_task'));
app.use("/delete_label", authentication, require('./routes/delete_label'));
app.use("/delete_task", authentication, require('./routes/delete_task'));
app.use("/update_label", authentication, require('./routes/update_label'));
app.use("/update_task", authentication, require('./routes/update_task'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})