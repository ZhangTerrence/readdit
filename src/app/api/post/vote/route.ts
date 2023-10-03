import { VoteTypes } from "@prisma/client";
import { z } from "zod";
import { CreatePostVoteValidator } from "@/lib/validators/vote";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const body = await req.json();

    const { postId, type } = CreatePostVoteValidator.parse(body);

    if (type !== "UP" && type !== "DOWN") {
      return new Response("Invalid vote type.", { status: 400 });
    }

    const existingVote = await prisma.postVote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        postVotes: true,
      },
    });

    if (!post) {
      return new Response("Post not found.", { status: 404 });
    }

    if (existingVote) {
      if (existingVote.type === type) {
        await prisma.postVote.delete({
          where: {
            userId_postId: {
              userId: session.user.id,
              postId,
            },
          },
        });

        return new Response("Successfully voted post.");
      }
      if (existingVote.type !== type) {
        await prisma.postVote.update({
          where: {
            userId_postId: {
              userId: session.user.id,
              postId,
            },
          },
          data: {
            type,
          },
        });

        return new Response("Successfully voted post.");
      }
    }

    await prisma.postVote.create({
      data: {
        userId: session?.user.id ?? "",
        postId,
        type: type === "UP" ? VoteTypes.UP : VoteTypes.DOWN,
      },
    });

    return new Response("Successfully voted post.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Internal server error.", { status: 500 });
  }
}
