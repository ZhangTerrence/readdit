import { VoteTypes } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UserInfo } from "@/components/user/UserInfo";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { IoSettings } from "react-icons/io5";

export default async function UserPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const session = await getAuthSession();

  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
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
          subreaddit: {
            select: {
              id: true,
              name: true,
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
      comments: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
          commentVotes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!user) return notFound();

  const postKarma = user.posts.reduce((n, post) => {
    const x = post.postVotes.reduce((n, vote) => {
      if (vote.type === VoteTypes.UP) return n + 1;
      if (vote.type === VoteTypes.DOWN) return n - 1;
      return n;
    }, 0);
    return n + x;
  }, 0);

  const commentKarma = user.comments.reduce((n, comment) => {
    const x = comment.commentVotes.reduce((n, vote) => {
      if (vote.type === VoteTypes.UP) return n + 1;
      if (vote.type === VoteTypes.DOWN) return n - 1;
      return n;
    }, 0);
    return n + x;
  }, 0);

  return (
    <main
      className={
        "flex h-fit justify-center gap-12 p-8 max-xl:flex-col-reverse max-xl:items-center"
      }
    >
      <div
        className={"w-[50rem] rounded-md px-8 pb-6 max-md:w-full max-md:px-0"}
      >
        <UserInfo
          user={{ id: user.id }}
          posts={user.posts}
          comments={user.comments}
        />
      </div>
      <div
        className={
          "relative flex h-fit w-[25rem] flex-col gap-y-6 rounded-md border border-solid border-black p-8 max-md:w-full"
        }
      >
        <div
          className={"absolute left-0 top-0 -z-10 h-20 w-full bg-black"}
        ></div>
        {user.id === session?.user.id ? (
          <div className={"flex items-end justify-evenly"}>
            <div className={"flex w-fit flex-col items-center gap-x-4"}>
              <Image
                className={
                  "rounded-full border-[5px] border-solid border-white"
                }
                src={user.image}
                alt={"user profile image"}
                width={80}
                height={80}
              />
              <p>u/{user.username}</p>
            </div>
            <Link
              className={
                "ml-10 flex items-center gap-x-2 rounded-md border border-solid border-gray-500 p-2"
              }
              href={`/settings/${user.id}`}
            >
              <IoSettings />
              Settings
            </Link>
          </div>
        ) : (
          <div className={"flex w-fit flex-col items-center gap-x-4"}>
            <Image
              className={"rounded-full border-[5px] border-solid border-white"}
              src={user.image}
              alt={"user profile image"}
              width={80}
              height={80}
            />
            <p>u/{user.username}</p>
          </div>
        )}
        {user.bio ? (
          <p className={"border-b border-t border-solid border-gray-500 py-4"}>
            {user.bio}
          </p>
        ) : null}
        <div className={"flex w-full justify-evenly gap-x-4"}>
          <div className={"flex flex-col items-center"}>
            <p className={"underline"}>Post Karma</p>
            <p>{postKarma}</p>
          </div>
          <div className={"flex flex-col items-center"}>
            <p className={"underline"}>Comment Karma</p>
            <p>{commentKarma}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
