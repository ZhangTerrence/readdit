import { z } from "zod";

export const UpdateUserValidator = z.object({
  id: z.string(),
  username: z.string().min(3).max(30),
  bio: z.string().max(300),
  image: z.string(),
});

export const DeleteUserValidator = z.object({
  id: z.string(),
});

export type UpdateUserPayload = z.infer<typeof UpdateUserValidator>;
export type DeleteUserPayload = z.infer<typeof DeleteUserValidator>;
