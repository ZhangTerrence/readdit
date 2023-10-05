import { z } from "zod";
import {
  CreateCommentValidator,
  UpdateCommentValidator,
  DeleteCommentValidator,
} from "@/lib/validators/comment";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const body = await req.json();

    const { postId, text, replyingToId } = CreateCommentValidator.parse(body);

    await prisma.comment.create({
      data: {
        postId,
        authorId: session.user.id,
        text,
        replyingToId,
      },
    });

    return new Response(`Successfully commented.`, { status: 200 });
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

    const { commentId, text } = UpdateCommentValidator.parse(body);

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        authorId: true,
      },
    });

    if (!comment) {
      return new Response("No comment found.", { status: 404 });
    }

    if (comment.authorId !== session.user.id) {
      return new Response(`Not author of comment.`, { status: 401 });
    }

    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        text,
      },
    });

    return new Response(`Successfully updated comment.`, { status: 200 });
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

    const { commentId } = DeleteCommentValidator.parse(body);

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        authorId: true,
      },
    });

    if (!comment) {
      return new Response("No comment found.", { status: 404 });
    }

    if (comment.authorId !== session.user.id) {
      return new Response(`Not author of comment.`, { status: 401 });
    }

    await prisma.comment.update({
      where: {
        id: commentId,
        authorId: session.user.id,
      },
      data: {
        authorId: "[deleted]",
        text: "Comment deleted by user.",
      },
    });

    return new Response(`Successfully deleted comment.`, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    console.log(error);
    return new Response("Internal server error.", { status: 500 });
  }
}
