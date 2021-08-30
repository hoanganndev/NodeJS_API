const Joi = require('@hapi/joi');
/*
*link: https://www.youtube.com/watch?v=3G_nxiUCj-Q&list=PLU4OBh9yHE95gzQjclK3KJn7Iq8Y9M07u&index=9
*schema: điều kiện cho prams mình muốn validate
*name: tên cho prams mình muốn validate
*schemas: các điều kiện muốn xử lý
*idSchema: xử lý điều kiện _id của mongodb
*/
const validateParam = (schema, name) => {
  return (req, res, next) => {
    // console.log('🔥params', req.params[name]);
    const validatorResult = schema.validate({ param: req.params[name] });
    // console.log('🔥validatorResult', validatorResult);
    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error);
    } else {
      /*
      *req.value.params được tạo ra sau khi đã validate thành công
      *sau khi xử lý từ router user.js thì req.value.params được truyền qua userController xử lý
      * req.params được thay bằng req.value.params
      */
      console.log('🔥step 1', req.value);
      if (!req.value) req.value = {};
      console.log('🔥step 2',);
      if (!req.value['params']) req.value.params = {};
      console.log('🔥step 3',);
      req.value.params[name] = req.params[name];
      console.log('🔥step 4 req value', req.value);
      next();
    }
  }
}
//TODO: vì body thì cần phải validate hết nên không cần điều kiện name
const validateBody = (schema) => {
  return (req, res, next) => {
    const validatorResult = schema.validate(req.body);
    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value['params']) req.value.params = {};
      // console.log('🔥validatorResult', validatorResult);
      req.value.body = validatorResult.value;
      next();
    }

  }
}
const schemas = {
  // validate cho sign in
  authSignUpSchema: Joi.object().keys({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  // validate cho sign up
  authSignInSchema: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  // validate cho deck
  deckSchema: Joi.object().keys({
    name: Joi.string().min(6).required(),
    description: Joi.string().min(10).required(),
  }),
  // validate cho create,replace new deck
  newDeckSchema: Joi.object().keys({
    name: Joi.string().min(6).required(),
    description: Joi.string().min(10).required(),
    owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  // validate cho update new deck
  deckOptionalSchema: Joi.object().keys({
    name: Joi.string().min(6),
    description: Joi.string().min(10),
    owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
  }),
  // validate cho id trong mongodb
  idSchema: Joi.object().keys({
    param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  // validate cho new,replace user
  userSchema: Joi.object().keys({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required()
  }),
  // validate cho update new user
  userOptionalSchema: Joi.object().keys({
    firstName: Joi.string().min(2),
    lastName: Joi.string().min(2),
    email: Joi.string().email()
  })
};
module.exports = {
  validateParam,
  validateBody,
  schemas
}