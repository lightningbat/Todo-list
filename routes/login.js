const userAccount_schema = require("../schemas/userAccount_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

router.post("/", async (req, res) => {
    try {
        // if (!req.body.email || !req.body.password) return res.status(400).send("Please provide email and password");

        const users_coll = req.app.get("users_coll");

        // adding a temporary username as input-validator requires it              
        req.body.username = "abcdefgh"

        let user_information;
        try {
            user_information = await userAccount_schema.validateAsync(req.body);
        }
        catch (err) { return res.status(400).send(err.message); }

        // finding the email that matches with the sanitized email
        const user = await users_coll.findOne({ email: user_information.email });

        if (!user) return res.status(400).send("User Does Not Exist");

        // matching password with hashed password from database
        const isMatch = await bcrypt.compare(user_information.password, user.password);

        if (!isMatch) return res.status(400).send("Incorrect Password");

        const token = jwt.sign(
            { email: user_information.email, username: user.username },
            process.env.TOKEN_KEY
        );

        res.status(200).send({ token });

    } catch (err) {
        console.log(err);
        res.status(500).send("server side error");
    }
})

module.exports = router