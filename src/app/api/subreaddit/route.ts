import { getAuthSession } from "@/lib/auth";
import { SubreadditValidator } from "@/lib/validators/subreaddit";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const body = await req.json();

    const { name, description } = SubreadditValidator.parse(body);

    const subreadditExists = await prisma.subreaddit.findFirst({
      where: {
        name: {
          endsWith: name,
          mode: "insensitive",
        },
      },
    });

    if (subreadditExists) {
      return new Response("Subreaddit already exists.", { status: 409 });
    }

    const subreaddit = await prisma.subreaddit.create({
      data: {
        name,
        creatorId: session.user.id,
        description,
      },
    });

    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        subreadditId: subreaddit.id,
      },
    });

    return new Response(`Successfully created ${subreaddit.name}.`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Internal server error.", { status: 500 });
  }
}
