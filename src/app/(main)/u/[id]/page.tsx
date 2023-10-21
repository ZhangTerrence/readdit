import { VoteTypes } from "@prisma/client";
import { notFound } from "next/navigation";
import { UserInfo } from "@/components/user/UserInfo";
import prisma from "@/lib/prisma";
import Image from "next/image";

export default async function UserPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
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
      postVotes: true,
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
      commentVotes: true,
    },
  });

  if (!user) return notFound();

  const postKarma = user.postVotes.reduce((n, vote) => {
    if (vote.type === VoteTypes.UP) return n + 1;
    if (vote.type === VoteTypes.DOWN) return n - 1;
    return n;
  }, 0);

  const commentKarma = user.commentVotes.reduce((n, vote) => {
    if (vote.type === VoteTypes.UP) return n + 1;
    if (vote.type === VoteTypes.DOWN) return n - 1;
    return n;
  }, 0);

  return (
    <main className={"flex h-fit justify-center gap-x-12 py-8"}>
      <div className={"w-[50rem] rounded-md px-8 pb-6"}>
        <UserInfo
          user={{ id: user.id }}
          posts={user.posts}
          comments={user.comments}
        />
      </div>
      <div
        className={
          "relative flex h-fit w-[25rem] flex-col gap-y-6 rounded-md border border-solid border-black p-8"
        }
      >
        <div
          className={"absolute left-0 top-0 -z-10 h-20 w-full bg-black"}
        ></div>
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
