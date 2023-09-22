import { z } from "zod";

export const CreatePostValidator = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(128, {
      message: "Title must be less than 128 characters long",
    }),
  subreadditId: z.string(),
  content: z.any(),
});

export const DeletePostValidator = z.object({
  postId: z.string(),
  subreadditId: z.string(),
});

export type CreatePostPayload = z.infer<typeof CreatePostValidator>;
export type DeletePostPayload = z.infer<typeof DeletePostValidator>;
