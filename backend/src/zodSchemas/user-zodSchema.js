const { z } = require('zod');

const baseFields = {
  name: z
    .string({ required_error: 'Name is required', invalid_type_error: 'Name must be a string' })
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' }),

  email: z
    .string({ required_error: 'Email is required', invalid_type_error: 'Email must be a string' })
    .trim()
    .email({ message: 'Invalid email address' }),

  phoneNumber: z
    .string({ required_error: 'Phone number is required', invalid_type_error: 'Phone number must be a string' })
    .trim()
    .regex(/^(\+234|0)[789][01]\d{8}$/, { message: 'Invalid Nigerian phone number' }),

  password: z
    .string({ required_error: 'Password is required', invalid_type_error: 'Password must be a string' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[a-z]/, { message: 'Password must contain a lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain an uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain a number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain a special character' }),
};

const createCustomerSchema = z.object({
  ...baseFields,
  role: z.literal('customer'),
}).strict();

const createVendorSchema = z.object({
  ...baseFields,
  role: z.literal('vendor'),
  businessName: z
    .string({ required_error: 'Business name is required', invalid_type_error: 'Business name must be a string' })
    .trim()
    .min(5, { message: 'Business name must be at least 5 characters' }),
  businessDescription: z
   .string({ required_error: 'Business description is required', invalid_type_error: 'Business description must be a string' })
    .trim()
    .min(5, { message: 'Business description must be at least 5 characters' }),
  bankDetails: z.object({
    accountNumber: z
      .string({ required_error: 'Account number is required', invalid_type_error: 'Account number must be a string' })
      .trim()
      .regex(/^\d{10,17}$/, { message: 'Account number must be between 10 and 17 digits' }),
    accountName: z
      .string({ required_error: 'Account name is required', invalid_type_error: 'Account name must be a string' })
      .trim()
      .min(5, { message: 'Account name must be at least 5 characters' }),
    bankName: z
      .string({ required_error: 'Bank name is required', invalid_type_error: 'Bank name must be a string' })
      .trim()
      .min(3, { message: 'Bank name must be at least 4 characters' }),
  }).strict().optional(),
}).strict();

//schema to validate incoming create-user request. role specified in teh request is used to choose the correct schema to validate the request against
const createUserSchema = z.discriminatedUnion('role', [
  createCustomerSchema,
  createVendorSchema,
]);


//schema to validate incoming update request
const updateCustomerSchema = createCustomerSchema
  .omit({ role: true, password: true })
  .partial()
  .strict();

const updateVendorSchema = createVendorSchema
  .omit({ role: true, password: true })
  .partial()
  .strict();


const adminRegisterSchema = z.object({
  ...baseFields,
}).strict();

const updateAdminSchema = adminRegisterSchema
  .omit({ password: true })
  .partial()
  .strict();

//schema to validate incoming login request
const loginSchema = z.object({
    email: z
      .string({ required_error: 'Email is required', invalid_type_error: 'Email must be a string' })
      .trim()
      .email({ message: 'Invalid email address' }),
     
    password: z
      .string({ required_error: 'Password is required', invalid_type_error: 'Password must be a string' })
      .min(1, { message: 'Password is required' }),
}) .strict();


const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: 'Current password is required' })
    .min(1, { message: 'Current password is required' }),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[a-z]/, { message: 'Password must contain a lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain an uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain a number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain a special character' }),
}).strict();

module.exports = { 
  createUserSchema, 
  updateCustomerSchema, 
  updateVendorSchema, 
  loginSchema, 
  changePasswordSchema, 
  adminRegisterSchema,
  updateAdminSchema
};