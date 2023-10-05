import { z } from "zod";

export const CreateCommentValidator = z.object({
  postId: z.string(),
  text: z.string().max(2000),
  replyingToId: z.string().optional(),
});

export const UpdateCommentValidator = z.object({
  commentId: z.string(),
  text: z.string(),
});

export const DeleteCommentValidator = z.object({
  commentId: z.string(),
});

export type CreateCommentPayload = z.infer<typeof CreateCommentValidator>;
export type UpdateCommentPayload = z.infer<typeof UpdateCommentValidator>;
export type DeleteCommentPayload = z.infer<typeof DeleteCommentValidator>;
