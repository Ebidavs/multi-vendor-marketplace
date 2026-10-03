// zodSchemas/otp-zodSchema.js
const { z } = require('zod');



const emailOnlySchema = z.object({
  email: z.string({ required_error: 'Email is required' }).trim().email({ message: 'Invalid email address' }),
}).strict();

const emailAndOtpSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).trim().email({ message: 'Invalid email address' }),
  otp: z.string({ required_error: 'OTP is required' }).trim().regex(/^\d{6}$/, { message: 'OTP must be exactly 6 digits' }),
}).strict();

const resetPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Invalid email address' }),
  otp: z
    .string({ required_error: 'OTP is required' })
    .trim()
    .regex(/^\d{6}$/, { message: 'OTP must be exactly 6 digits' }),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[a-z]/, { message: 'Password must contain a lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain an uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain a number' })
    .regex(/[^a-zA-Z0-9\s]/, { message: 'Password must contain a special character' })
    .regex(/^\S+$/, { message: 'Password must not contain spaces' }),
}).strict();

module.exports = {resetPasswordSchema,   emailOnlySchema, 
  emailAndOtpSchema,  };