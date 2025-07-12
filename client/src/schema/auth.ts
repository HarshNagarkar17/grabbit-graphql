import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Enter valid email address"),
  password: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 8, { message: "Password is required" }),
});

export const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Enter valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

type SignInSchema = z.infer<typeof signInSchema>;
type SignUpSchema = z.infer<typeof signUpSchema>;
export type { SignInSchema, SignUpSchema };
