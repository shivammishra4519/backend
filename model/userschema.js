const joi=require('joi')

const userSchema=joi.object({
    userName:joi.string().required(),
    userEmail:joi.string().required(),
    mobileNumber:joi.number().required(),
    city:joi.string().required(),
    passWord:joi.string().required(),
    active:joi.boolean().required()
})

module.exports={userSchema}