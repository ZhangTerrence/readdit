import { z } from "zod";

export const DeleteUploadthingValidator = z.object({
  images: z.string().array().optional(),
  image: z.string().optional(),
});

export type DeleteUploadthingPayload = z.infer<
  typeof DeleteUploadthingValidator
>;
