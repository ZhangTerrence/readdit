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

    const { title, content, subreadditId } = CreatePostValidator.parse(body);

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

    const subscriptionExists = await prisma.subscription.findFirst({
      where: {
        subreadditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("Must be subscribed to subreaddit.", {
        status: 400,
      });
    }

    await prisma.post.delete({
      where: {
        subreadditId,
        authorId: session.user.id,
        id: postId,
      },
    });

    return new Response(`Successfully deleted post.`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Internal server error.", { status: 500 });
  }
}
