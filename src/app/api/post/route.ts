import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PostValidator } from "@/lib/validators/post";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const body = await req.json();

    const { title, content, subreadditId } = PostValidator.parse(body);

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
      return new Response("Must be subscribed to post.", {
        status: 400,
      });
    }

    await prisma.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subreadditId,
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
