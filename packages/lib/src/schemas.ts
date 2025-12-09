import { z } from "zod";

/**
 * Example User Schema
 * Demonstrates basic field validation with string, number, and date types
 */
export const userSchema = z.object({
  id: z.uuid(),
  email: z.email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  age: z.number().int().positive().max(120).optional(),
  createdAt: z.date().default(() => new Date()),
});

export type User = z.infer<typeof userSchema>;
