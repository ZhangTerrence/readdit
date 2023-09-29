import { z } from "zod";
import { CreateCommentVoteValidator } from "@/lib/validators/vote";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { VoteTypes } from "@prisma/client";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const body = await req.json();

    const { commentId, type } = CreateCommentVoteValidator.parse(body);

    if (type !== "UP" && type !== "DOWN") {
      return new Response("Invalid vote type.", { status: 400 });
    }

    const existingVote = await prisma.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    });

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        author: true,
        commentVotes: true,
      },
    });

    if (!comment) {
      return new Response("Comment not found.", { status: 404 });
    }

    if (existingVote) {
      if (existingVote.type === type) {
        await prisma.commentVote.delete({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
        });

        return new Response("Successfully voted comment.");
      }
      if (existingVote.type !== type) {
        await prisma.commentVote.update({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
          data: {
            type,
          },
        });

        return new Response("Successfully voted comment.");
      }
    }

    await prisma.commentVote.create({
      data: {
        userId: session?.user.id ?? "",
        commentId,
        type: type === "UP" ? VoteTypes.UP : VoteTypes.DOWN,
      },
    });

    return new Response("Successfully voted comment.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Internal server error.", { status: 500 });
  }
}
