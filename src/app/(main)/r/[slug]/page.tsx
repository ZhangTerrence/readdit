import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CreatePostPreview } from "@/components/post/CreatePostPreview";
import { PostFeed } from "@/components/post/PostFeed";
import { SubscriptionButton } from "@/components/subscription/SubscriptionButtons";
import { EditSubreaddit } from "@/components/subreaddit/EditSubreaddit";
import { DeleteSubreaddit } from "@/components/subreaddit/DeleteSubreaddit";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FaBirthdayCake, FaUser } from "react-icons/fa";

export default async function SubreadditPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const session = await getAuthSession();

  const subreaddit = await prisma.subreaddit.findFirst({
    where: {
      name: {
        endsWith: params.slug,
        mode: "insensitive",
      },
    },
    include: {
      posts: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          postVotes: true,
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!subreaddit) return notFound();

  const subscription = session?.user
    ? await prisma.subscription.findFirst({
        where: {
          userId: session.user.id,
          subreadditId: subreaddit.id,
        },
      })
    : null;
  const isSubscribed = !!subscription;

  const subscribers = await prisma.subscription.count({
    where: {
      subreadditId: subreaddit.id,
    },
  });

  return (
    <div className={"relative"}>
      <main className={"flex h-fit flex-col items-center py-8"}>
        <div
          className={"flex w-[75rem] border-b-2 border-solid border-black pb-4"}
        >
          <div className={"flex w-full items-center justify-between"}>
            <div className={"flex gap-x-4"}>
              <Image
                className={"rounded-full border-2 border-solid border-black"}
                src={subreaddit.image}
                alt={"subreaddit image"}
                width={100}
                height={100}
              />
              <div className={"flex flex-col gap-y-1 self-end"}>
                <h1 className={"text-6xl font-semibold"}>{subreaddit.name}</h1>
                <h2 className={"text-2xl"}>r/{subreaddit.name}</h2>
              </div>
            </div>
            {subreaddit.creatorId !== session?.user.id ? (
              <SubscriptionButton
                subreaddit={{
                  id: subreaddit.id,
                }}
                isSubscribed={isSubscribed}
              />
            ) : (
              <div className={"flex flex-col gap-y-2"}>
                <EditSubreaddit
                  subreaddit={{
                    id: subreaddit.id,
                    name: subreaddit.name,
                    description: subreaddit.description,
                    rules: subreaddit.rules,
                    image: subreaddit.image,
                  }}
                />
                <DeleteSubreaddit
                  subreaddit={{
                    id: subreaddit.id,
                    name: subreaddit.name,
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div className={"flex gap-x-10 pt-8"}>
          <div className={"flex w-[50rem] flex-col gap-y-4"}>
            <CreatePostPreview
              subreaddit={{
                id: subreaddit.id,
              }}
            />
            <PostFeed
              type={"single"}
              posts={subreaddit.posts}
              subreaddit={{ id: subreaddit.id, name: subreaddit.name }}
            />
          </div>
          <div className={"flex h-fit w-[22.5rem] flex-col gap-y-4"}>
            <div
              className={
                "overflow-hidden rounded-md border border-solid border-black"
              }
            >
              <h1 className={"bg-slate-950 p-4 text-lg text-white"}>
                About Community
              </h1>
              <div className={"flex flex-col gap-y-3 p-4"}>
                <p className={"border-b border-solid border-gray-400 pb-3"}>
                  {subreaddit.description}
                </p>
                <div
                  className={
                    "flex items-center gap-x-2 border-b border-solid border-gray-400 pb-3"
                  }
                >
                  <FaUser />
                  <p>{subscribers} members</p>
                </div>
                <div
                  className={
                    "flex items-center gap-x-2 border-b border-solid border-gray-400 pb-3"
                  }
                >
                  <FaBirthdayCake />
                  <p>Created {format(subreaddit.createdAt, "MMMM d, yyyy")}</p>
                </div>
                <Link
                  className={
                    "group relative inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-slate-900 px-3.5 py-2 text-lg text-white shadow-md active:shadow-none"
                  }
                  href={{
                    pathname: `/submit/${subreaddit.id}`,
                  }}
                >
                  <span
                    className={
                      "absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-75 ease-out group-hover:h-32 group-hover:w-full"
                    }
                  ></span>
                  <button className={"relative"}>Create Post</button>
                </Link>
              </div>
            </div>
            <div
              className={
                "overflow-hidden rounded-md border border-solid border-black "
              }
            >
              <h1 className={"bg-slate-950 p-4 text-lg text-slate-50"}>
                Rules
              </h1>
              <ul className={"ml-4 list-decimal p-4"}>
                {subreaddit.rules.map((rule, i) => {
                  return (
                    <li
                      className={
                        "w-full border-b border-solid border-gray-400 py-2"
                      }
                      key={i}
                    >
                      {rule}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
