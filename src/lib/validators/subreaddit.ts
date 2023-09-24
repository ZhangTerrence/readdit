import { z } from "zod";

export const CreateSubreadditValidator = z.object({
  name: z.string().min(3).max(21),
  description: z.string(),
});

export const UpdateSubreadditValidator = z.object({
  subreadditId: z.string(),
});

export const DeleteSubreadditValidator = z.object({
  subreadditId: z.string(),
});

export type CreateSubreadditPayload = z.infer<typeof CreateSubreadditValidator>;
export type UpdateSubreadditPayload = z.infer<typeof UpdateSubreadditValidator>;
export type DeleteSubreadditPayload = z.infer<typeof DeleteSubreadditValidator>;
