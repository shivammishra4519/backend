const Joi=require('joi');

const mobileDetailsSchema = Joi.object({
    ownerName: Joi.string().required(),
    ownerMoblieNumber: Joi.number().required(),
    imeiNumber1: Joi.number().required(),
    imeiNumber2: Joi.number().required(),
    brandName: Joi.string().required(),
    modelName: Joi.string().required(),
    lostDate: Joi.date().iso().required(),
    lastMobileNumber: Joi.number().required(),
    losePlace: Joi.string().required(),
    email: Joi.string().required(),
    bill: Joi.string(),
    registerUser:Joi.number(),
    transactionId:Joi.string(),
    transactionStatus:Joi.boolean(),
  });

  const updateDetailsMobile=Joi.object({
    currentNumber:Joi.string().required(),
    currentAddress:Joi.string().required(),
    imeiNumber1:Joi.number().required(),
  })

  module.exports={mobileDetailsSchema,updateDetailsMobile};