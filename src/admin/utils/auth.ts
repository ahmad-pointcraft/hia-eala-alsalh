import { z } from 'zod';

export const authFormSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type AuthFormData = z.infer<typeof authFormSchema>;

export const signUpFormSchema = z
  .object({
    mode: z.enum(['create', 'join']),
    name: z.string().min(1, 'Full name is required'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    masjidName_en: z.string().optional(),
    masjidName_ar: z.string().optional(),
    inviteCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
    if (data.mode === 'create') {
      if (!data.masjidName_en?.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'English masjid name is required',
          path: ['masjidName_en'],
        });
      }
      if (!data.masjidName_ar?.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Arabic masjid name is required',
          path: ['masjidName_ar'],
        });
      }
    }
    if (data.mode === 'join') {
      if (!data.inviteCode?.trim() || data.inviteCode.trim().length !== 6) {
        ctx.addIssue({
          code: 'custom',
          message: 'Invite code must be 6 digits',
          path: ['inviteCode'],
        });
      }
    }
  });

export type SignUpFormData = z.infer<typeof signUpFormSchema>;
