const joi = require("joi");

module.exports = joi.object({
    parent_id: joi.string().required().min(5).max(20),
    id: joi.string().required().min(5).max(20),
    title: joi.string().default("Untitled").max(30).allow(""),
    description: joi.string().default("").max(300).allow(""),
    priority: joi.number().default(-1),
    completed: joi.boolean().default(false),
    date_created: joi.date().default(new Date().toUTCString())
}).options({ stripUnknown: true })