import { z } from "zod";

export const CreateCommentValidator = z.object({
  postId: z.string(),
  text: z.string(),
  replyingToId: z.string().optional(),
  level: z.number().optional(),
});

export const DeleteCommentValidator = z.object({
  id: z.string(),
});

export type CreateCommentPayload = z.infer<typeof CreateCommentValidator>;
export type DeleteCommentPayload = z.infer<typeof DeleteCommentValidator>;
