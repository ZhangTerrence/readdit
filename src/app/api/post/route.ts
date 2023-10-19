import { z } from "zod";
import {
  CreatePostValidator,
  DeletePostValidator,
} from "@/lib/validators/post";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const body = await req.json();

    const { subreadditId, title, content } = CreatePostValidator.parse(body);

    const subscription = await prisma.subscription.findFirst({
      where: {
        subreadditId,
        userId: session.user.id,
      },
      include: {
        subreaddit: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!subscription) {
      return new Response("Must be subscribed to subreaddit.", {
        status: 400,
      });
    }

    await prisma.post.create({
      data: {
        subreadditId,
        authorId: session.user.id,
        title,
        content,
      },
    });

    return new Response(
      `Successfully posted to ${subscription.subreaddit.name}`,
      { status: 200 },
    );
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
    const { page, subreadditId } = z
      .object({
        page: z.string(),
        subreadditId: z.string().nullish().optional(),
      })
      .parse({
        page: url.searchParams.get("page"),
        subreadditId: url.searchParams.get("subreaddit"),
      });

    let where = {};
    let include = {};

    if (subreadditId) {
      where = {
        subreadditId,
      };

      include = {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        postVotes: true,
        comments: true,
      };
    } else {
      include = {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        subreaddit: {
          select: {
            id: true,
            name: true,
          },
        },
        postVotes: true,
        comments: true,
      };
    }

    const posts = await prisma.post.findMany({
      where,
      include,
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      skip: parseInt(page) * 10,
    });

    return new Response(JSON.stringify(posts), { status: 200 });
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

    const { postId, subreadditId } = DeletePostValidator.parse(body);

    await prisma.post.delete({
      where: {
        id: postId,
        authorId: session.user.id,
        subreadditId,
      },
    });

    return new Response(`Successfully deleted post.`, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    console.log(error);

    return new Response("Internal server error.", { status: 500 });
  }
}
