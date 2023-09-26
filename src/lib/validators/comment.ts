import { z } from "zod";

export const CreateCommentValidator = z.object({
  postId: z.string(),
  text: z.string(),
  replyingToId: z.string().optional(),
});

export type CreateCommentPayload = z.infer<typeof CreateCommentValidator>;
