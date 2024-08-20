import { z } from 'zod';

export const SignUpSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Username must be more than 3 characters' })
      .max(25, { message: 'Username must be less than 25 characters' }),
    email: z
      .string()
      .email()
      .refine((value) => !!value, {
        message: 'Email should be a valid email address!',
      }),
    password: z
      .string()
      .min(8, { message: 'Password must be more than 8 characters' })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one lowercase character, one uppercase character, one special character and one number .'
      )
      .refine((value) => !!value, {
        message: 'Password is required!',
      }),
    confirmpassword: z.string().refine((value) => !!value, {
      message: 'Password is required!',
    }),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: 'Password did not match!',
    path: ['confirmpassword'],
  });
export const PasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be more than 8 characters' })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one lowercase character, one uppercase character, one special character and one number .'
      )
      .refine((value) => !!value, {
        message: 'Password is required',
      }),
    newpassword: z
      .string()
      .min(8, { message: 'Password must be more than 8 characters' })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one lowercase character, one uppercase character, one special character and one number .'
      )
      .refine((value) => !!value, {
        message: 'Password is required!',
      }),
  })
  .refine((data) => data.password === data.newpassword, {
    message: 'Password did not match',
    path: ['newpassword'],
  });

export const SignInSchema = z.object({
  email: z
    .string()
    .email({ message: 'This Email is not valid!' })
    .refine((value) => !!value, {
      message: 'Email is required',
    }),
  password: z
    .string()
    .min(8, { message: 'Password must be more than 8 characters' })
    .refine((value) => !!value, {
      message: 'Password is required!',
    }),
});
