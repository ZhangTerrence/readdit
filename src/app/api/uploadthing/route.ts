import { createNextRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { z } from "zod";
import { DeleteUploadthingValidator } from "@/lib/validators/uploadthing";
import { utapi } from "uploadthing/server";

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const { images, image } = DeleteUploadthingValidator.parse(body);

    await utapi.deleteFiles(images ?? image ?? "");

    return new Response("Successfully deleted files.", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Internal server error.", { status: 500 });
  }
}
