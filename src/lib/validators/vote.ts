import { z } from "zod";

export const CreatePostVoteValidator = z.object({
  postId: z.string(),
  type: z.string(),
});

export const CreateCommentVoteValidator = z.object({
  commentId: z.string(),
  type: z.string(),
});

export type CreatePostVotePayload = z.infer<typeof CreatePostVoteValidator>;
export type CreateCommentVotePayload = z.infer<
  typeof CreateCommentVoteValidator
>;
