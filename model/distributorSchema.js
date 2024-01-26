const Joi=require('joi');

const distributorDetails=Joi.object({
    name:Joi.string().required(),
    number:Joi.number().required(),
    address:Joi.string().required(),
    email:Joi.string().required(),
    password:Joi.string().required(),
    active:Joi.boolean().required(),
})
module.exports={distributorDetails}