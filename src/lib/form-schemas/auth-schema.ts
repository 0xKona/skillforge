import * as z from "zod";

export const signUpFormSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    username: z.string().min(2, "Username must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpForm = z.infer<typeof signUpFormSchema>;

export const signInFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "No password provided"),
})

export type SignInForm = z.infer<typeof signInFormSchema>;

export const forgotPasswordRequestSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;

export const resetPasswordFormSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    code: z.string().min(6, "Verification code must be at least 6 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;