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

    const subscriptionExists = await prisma.subscription.findFirst({
      where: {
        subreadditId,
        userId: session.user.id,
      },
      include: {
        subreaddit: true,
      },
    });

    if (!subscriptionExists) {
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
      `Successfully posted to ${subscriptionExists.subreaddit.name}`,
    );
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

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
    });

    comments.map(async (comment) => {
      await prisma.commentVote.deleteMany({
        where: {
          commentId: comment.id,
        },
      });

      await prisma.comment.delete({
        where: {
          id: comment.id,
          postId,
        },
      });
    });

    const votes = await prisma.postVote.findMany({
      where: {
        postId,
      },
    });

    if (votes) {
      await prisma.postVote.deleteMany({
        where: {
          postId,
        },
      });
    }

    await prisma.post.delete({
      where: {
        id: postId,
        authorId: session.user.id,
        subreadditId,
      },
    });

    return new Response(`Successfully deleted post.`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    console.log(error);

    return new Response("Internal server error.", { status: 500 });
  }
}
