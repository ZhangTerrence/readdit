import Link from "next/link";
import { CreateSubreaddit } from "@/components/subreaddit/CreateSubreaddit";
import { PostFeed } from "@/components/post/PostFeed";
import prisma from "@/lib/prisma";
import { IoChatbox, IoHome } from "react-icons/io5";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
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
  });

  return (
    <main
      className={
        "flex h-fit justify-center gap-12 p-8 max-xl:flex-col-reverse max-xl:items-center"
      }
    >
      <div
        className={"w-[50rem] rounded-md px-8 pb-6 max-md:w-full max-md:px-0"}
      >
        <div
          className={
            "mb-6 flex items-center gap-x-4 border-b border-solid border-black pb-4 text-2xl font-bold"
          }
        >
          <IoChatbox className={"mt-1"} />
          <h1>Your Feed</h1>
        </div>
        <PostFeed type={"multiple"} posts={posts} />
      </div>
      <div
        className={
          "h-fit w-[25rem] rounded-md border border-solid border-black p-8 max-md:w-full"
        }
      >
        <div
          className={
            "flex flex-col gap-y-3 border-b border-solid border-black pb-4"
          }
        >
          <div className={"flex items-center gap-x-4 text-2xl font-bold"}>
            <IoHome />
            <h1>Home</h1>
          </div>
          <p className={"max-xs:text-sm"}>
            Your personal Readdit frontpage. Come here to check in with your
            favorite communities.
          </p>
        </div>
        <div className={"mt-4 flex flex-col gap-y-4"}>
          <Link
            className={
              "group relative inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-slate-900 px-3.5 py-2 text-xl text-white shadow-md active:shadow-none"
            }
            href={"/submit"}
          >
            <span
              className={
                "absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-75 ease-out group-hover:h-32 group-hover:w-full"
              }
            ></span>
            <button className={"relative max-xs:text-sm"}>Create Post</button>
          </Link>
          <CreateSubreaddit />
        </div>
      </div>
    </main>
  );
}
