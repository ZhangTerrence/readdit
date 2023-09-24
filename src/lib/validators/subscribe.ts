import { z } from "zod";

export const CreateSubscriptionValidator = z.object({
  subreadditId: z.string(),
});

export const DeleteSubscriptionValidator = z.object({
  subreadditId: z.string(),
});

export type CreateSubscriptionPayload = z.infer<
  typeof CreateSubscriptionValidator
>;
export type DeleteSubscriptionPayload = z.infer<
  typeof DeleteSubscriptionValidator
>;
