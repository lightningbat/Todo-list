const joi = require("joi");

module.exports = joi.object({
    id: joi.string().required().min(5).max(20),
    name: joi.string().default("Untitled").min(1).max(15),
    color: joi.string().default("#000000").max(20)
}).options({ stripUnknown: true })