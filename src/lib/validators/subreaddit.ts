import { z } from "zod";

export const SubreadditValidator = z.object({
  name: z.string().min(3).max(21),
  description: z.string(),
});

export const SubreadditSubscriptionValidator = z.object({
  subreadditId: z.string(),
});

export type CreateSubreadditPayload = z.infer<typeof SubreadditValidator>;
export type SubscribeToSubreadditPayload = z.infer<
  typeof SubreadditSubscriptionValidator
>;
