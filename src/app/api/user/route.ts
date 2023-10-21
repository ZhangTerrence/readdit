import { z } from "zod";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const { username } = z
      .object({
        username: z.string(),
      })
      .parse({
        username: url.searchParams.get("username"),
      });

    const users = await prisma.user.findMany({
      where: {
        username: {
          startsWith: username,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
        image: true,
      },
      take: 10,
    });

    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Internal server error.", { status: 500 });
  }
}
