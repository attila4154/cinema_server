import { z } from "zod";

export const LoginFormDataSchema = z.object({
  email: z.string().min(2, "Email is required"),
  password: z
    .string()
    .min(8, "Password should have at least 8 characters"),
});
