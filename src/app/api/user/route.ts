import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  DeleteUserValidator,
  UpdateUserValidator,
} from "@/lib/validators/user";

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

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const body = await req.json();

    const { id, username, bio, image } = UpdateUserValidator.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      return new Response("User does not exist.", { status: 404 });
    }

    if (user.id !== session.user.id) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const usernameExists = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (usernameExists && user.username !== username) {
      return new Response("Username already taken.", { status: 409 });
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        username,
        bio,
        image,
      },
    });

    return new Response(`Successfully updated user.`, {
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

    const { id } = DeleteUserValidator.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        posts: true,
        comments: true,
      },
    });

    if (!user) {
      return new Response("User does not exist.", { status: 404 });
    }

    if (user.id !== session.user.id) {
      return new Response("Unauthorized.", { status: 401 });
    }

    user.posts.map(async (post) => {
      await prisma.post.delete({
        where: {
          id: post.id,
        },
      });
    });

    user.comments.map(async (comment) => {
      await prisma.comment.update({
        where: {
          id: comment.id,
          authorId: session.user.id,
        },
        data: {
          authorId: "[deleted]",
          text: "Comment deleted by user.",
        },
      });
    });

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return new Response(`Successfully deleted user.`, {
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
