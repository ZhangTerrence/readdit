import { z } from "zod";

export const DeleteUploadthingValidator = z.object({
  files: z.string().array(),
});

export type DeleteUploadthingPayload = z.infer<
  typeof DeleteUploadthingValidator
>;
