import { z } from "zod";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const params = req.url;
    const name = params.split("/")[5];

    const subreaddits = await prisma.subreaddit.findMany({
      where: {
        name: {
          startsWith: name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        subscribers: true,
      },
      take: 5,
    });

    return new Response(JSON.stringify({ subreaddits }), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Internal server error.", { status: 500 });
  }
}
