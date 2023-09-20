"use client";

import { formatDistance } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoArrowDownSharp,
  IoArrowUpSharp,
  IoChatboxOutline,
  IoTrashBinOutline,
} from "react-icons/io5";

import type { Session } from "next-auth";

type Post = {
  id: string;
  subreadditId: string;
  authorId: string;
  title: string;
  content: any;
  createdAt: Date;
  updatedAt: Date;
  author: {
    [key: string]: any;
  };
  PostVotes: any[];
};

type PostFeedTypes = {
  session: Session | null;
  posts: Post[];
  subreadditName: string;
};

export const PostFeed = (props: PostFeedTypes) => {
  const pathname = usePathname();

  return (
    <div className={"flex flex-col items-center pt-4"}>
      {props.posts.map((post, i) => {
        return (
          <div
            key={i}
            className={
              "relative mb-4 flex h-fit w-full border border-solid border-slate-500 bg-slate-50"
            }
          >
            <div
              className={
                "flex h-full w-[5%] flex-col justify-center bg-gray-200 p-2"
              }
            >
              <IoArrowUpSharp className={"m-auto block"} />
              <p className={"text-center"}>0</p>
              <IoArrowDownSharp className={"m-auto block"} />
            </div>
            <div className={"grow p-2"}>
              {pathname !== "/" ? null : `r/${props.subreadditName}`}
              <div className={"mb-2 flex text-sm"}>
                <p className={"mr-2"}>
                  Posted by <Link href={"/"}>u/{post.author.username}</Link>
                </p>
                <p>{formatDistance(new Date(), post.createdAt)} ago</p>
              </div>
              <button className={"mb-2 text-2xl"}>{post.title}</button>
              <div className={"flex w-full items-center"}>
                <div className={"text-md flex items-center"}>
                  <IoChatboxOutline className={"m-auto mr-2 block"} />
                  <p>0 comments</p>
                </div>
              </div>
            </div>
            {props.session && post.author.id === props.session.user.id ? (
              <button className={"absolute right-0 top-0 m-4 text-lg"}>
                <IoTrashBinOutline className={"text-red-700"} />
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
