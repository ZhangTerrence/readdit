import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateComponents } from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react/hooks";

export const { uploadFiles } = generateReactHelpers<OurFileRouter>();
export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();
