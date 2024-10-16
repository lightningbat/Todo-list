const joi = require("joi");
const label_schema = require("./label_schema");
const task_schema = require("./task_schema");

module.exports = joi.object({
    email: joi.string().required().email(),
    theme: joi.boolean().default(false),
    labels: joi.array().items( label_schema ),
    tasks: joi.array().items( task_schema )
}).options({ stripUnknown: true })