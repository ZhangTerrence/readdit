import { z } from "zod";
import {
  CreateSubreadditValidator,
  DeleteSubreadditValidator,
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
      select: {
        id: true,
        name: true,
      },
    });

    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        subreadditId: subreaddit.id,
      },
    });

    return new Response(`Successfully created ${subreaddit.name}.`, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Internal server error.", { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const { subreadditName } = z
      .object({
        subreadditName: z.string(),
      })
      .parse({
        subreadditName: url.searchParams.get("subreaddit"),
      });

    const subreaddits = await prisma.subreaddit.findMany({
      where: {
        name: {
          startsWith: subreadditName,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        subscribers: true,
      },
      take: 10,
    });

    return new Response(JSON.stringify({ subreaddits }), { status: 200 });
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

    const { subreadditId, description, rules, image } =
      UpdateSubreadditValidator.parse(body);

    const subreaddit = await prisma.subreaddit.findUnique({
      where: {
        id: subreadditId,
      },
      select: {
        name: true,
      },
    });

    if (!subreaddit) {
      return new Response("Subreaddit does not exist.", { status: 404 });
    }

    await prisma.subreaddit.update({
      where: {
        id: subreadditId,
      },
      data: {
        description,
        rules,
        image,
      },
    });

    return new Response(`Successfully updated ${subreaddit.name}.`, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Internal server error.", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const body = await req.json();

    const { subreadditId } = DeleteSubreadditValidator.parse(body);

    const subreaddit = await prisma.subreaddit.findUnique({
      where: {
        id: subreadditId,
      },
      select: {
        name: true,
        posts: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!subreaddit) {
      return new Response("Subreaddit does not exist.", { status: 404 });
    }

    await prisma.subreaddit.delete({
      where: {
        id: subreadditId,
      },
    });

    return new Response(`Successfully deleted ${subreaddit.name}.`, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    console.log(error);
    return new Response("Internal server error.", { status: 500 });
  }
}
