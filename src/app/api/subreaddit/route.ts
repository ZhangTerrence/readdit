import { z } from "zod";
import {
  CreateSubreadditValidator,
  UpdateSubreadditValidator,
} from "@/lib/validators/subreaddit";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const body = await req.json();

    const { name, description } = CreateSubreadditValidator.parse(body);

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
        creatorId: session.user.id,
        name,
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

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const body = await req.json();

    const { subreadditId, description, rules } =
      UpdateSubreadditValidator.parse(body);

    const subreadditExists = await prisma.subreaddit.findUnique({
      where: {
        id: subreadditId,
      },
    });

    if (!subreadditExists) {
      return new Response("Subreaddit does not exist.", { status: 404 });
    }

    await prisma.subreaddit.update({
      where: {
        id: subreadditId,
      },
      data: {
        description,
        rules,
      },
    });

    return new Response(`Successfully updated ${subreadditExists.name}.`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Internal server error.", { status: 500 });
  }
}
