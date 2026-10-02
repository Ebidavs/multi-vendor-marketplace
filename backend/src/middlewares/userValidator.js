const {  updateCustomerSchema, updateVendorSchema, updateAdminSchema } = require('../zodSchemas/user-zodSchema');


const validator = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  
  if (!result.success){
    return res.status(400).json({
      success: false,
      message: 'Input data did not pass validation',
      data: null,
      errors: result.error.issues.map((err) => {
        return {
          path: err.path.join('.'),
          errorMessage: err.message,
        }
      })
    })
  }

  req[source] = result.data;
  next();
};

const updateValidator = (req, res, next) => {
  let schema;
  if (req.user.role === 'vendor') schema = updateVendorSchema;
  else if (req.user.role === 'admin') schema = updateAdminSchema;
  else schema = updateCustomerSchema;

  return validator(schema)(req, res, next)
}

module.exports = { validator, updateValidator }