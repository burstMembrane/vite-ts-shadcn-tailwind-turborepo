import { useState, type FormEvent } from "react";
import { Button } from "@repo/ui/button";
import React from "react";
import { userSchema} from '@repo/lib/schemas';

/**
 * Zod validation example using the User schema
 */
export function ZodExample() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setErrors({});

    // Create user data with generated id and default createdAt
    const userData = {
      id: crypto.randomUUID(),
      email,
      username,
      createdAt: new Date(),
    };

    const result = userSchema.safeParse(userData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) {
          fieldErrors[field.toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
    } else {
      setSuccess(true);
      console.log("Validated user:", result.data);
      setEmail("");
      setUsername("");
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4 p-6">
      <div>
        <h2 className="text-2xl font-bold">Zod Validation Example</h2>
        <p className="text-muted-foreground text-sm">
          Try entering invalid data to see Zod validation from the User schema
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors((prev) => ({ ...prev, username: "" }));
            }}
            className="w-full rounded-md border px-3 py-2"
            placeholder="john_doe"
          />
          {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            className="w-full rounded-md border px-3 py-2"
            placeholder="user@example.com"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </div>

        <Button type="submit" className="w-full">
          Validate User
        </Button>

        {success && (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
            User validated successfully!
          </div>
        )}
      </form>
    </div>
  );
}
