const userAccount_schema = require("../schemas/userAccount_schema");
const userData_schema = require("../schemas/userData_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

router.post("/", async (req, res) => {
    try {
        // requesting data in [user_info] and [demo_data] objects
        if (!req.body.user_info || !req.body.demo_data) return res.status(400).send("Please provide user information and demo data");

        // database collections
        const users_coll = req.app.get("users_coll");
        const usersData_coll = req.app.get("usersData_coll");

        let user_information; // holds processed/sanitized user information
        try {
            user_information = await userAccount_schema.validateAsync(req.body.user_info);
        }
        catch (err) { return res.status(400).send(err.message); }

        // finding the email that matches with the sanitized email
        if (await users_coll.findOne({ email: user_information.email })) return res.status(400).send("User Already Exist. Please Login");

        // adding email(as an id) to the users data document
        // as the the users data is stored in different collection
        req.body.demo_data.email = user_information.email;

        let demo_data;
        try {
            demo_data = await userData_schema.validateAsync(req.body.demo_data);
        }
        catch (err) { return res.status(400).send(err.message); }

        // replacing password with hashed password
        user_information.password = await bcrypt.hash(user_information.password, 10);

        //  adding date created to the user account
        user_information = { ...user_information, date_created: new Date().toUTCString() };

        // saving user information and creating doc
        await users_coll.insertOne(user_information);
        await usersData_coll.insertOne(demo_data);

        // signing a token with email and username
        const token = jwt.sign(
            { email: user_information.email, username: user_information.username },
            process.env.TOKEN_KEY
        );

        res.status(200).send({ token });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

module.exports = router