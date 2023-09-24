import { z } from "zod";
import {
  CreateSubscriptionValidator,
  DeleteSubscriptionValidator,
} from "@/lib/validators/subscribe";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { subreadditId } = CreateSubscriptionValidator.parse(body);

    const subscriptionExists = await prisma.subscription.findFirst({
      where: {
        subreadditId,
        userId: session.user.id,
      },
    });

    if (subscriptionExists) {
      return new Response("Already subscribed to this subreaddit.", {
        status: 400,
      });
    }

    const subscription = await prisma.subscription.create({
      data: {
        subreadditId,
        userId: session.user.id,
      },
      include: {
        subreaddit: true,
      },
    });

    return new Response(
      `Successfully subscribed to ${subscription.subreaddit.name}`,
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
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { subreadditId } = DeleteSubscriptionValidator.parse(body);

    const subscriptionExists = await prisma.subscription.findFirst({
      where: {
        subreadditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("You were not subscribed to this subreaddit.", {
        status: 400,
      });
    }

    const subscription = await prisma.subscription.delete({
      where: {
        userId_subreadditId: {
          subreadditId,
          userId: session.user.id,
        },
      },
      include: {
        subreaddit: true,
      },
    });

    return new Response(
      `Successfully unsubscribed from ${subscription.subreaddit.name}`,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Internal server error.", { status: 500 });
  }
}
