import { z } from "zod";
import {
  CreateCommentValidator,
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

    return new Response(`Successfully commented.`);
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

    const { id } = DeleteCommentValidator.parse(body);

    await prisma.comment.update({
      where: {
        id,
        authorId: session.user.id,
      },
      data: {
        authorId: "",
        text: "Comment deleted by user.",
      },
    });

    return new Response(`Successfully deleted comment.`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    console.log(error);
    return new Response("Internal server error.", { status: 500 });
  }
}
