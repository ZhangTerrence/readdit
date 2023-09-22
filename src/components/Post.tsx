"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IoArrowDownSharp,
  IoArrowUpSharp,
  IoChatboxOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";

import { formatTimeToNow } from "@/lib/formatter";
import { DeletePostPayload } from "@/lib/validators/post";
import { VoteTypes } from "@prisma/client";

import type { Post, PostVote, Comment } from "@prisma/client";
import type { Session } from "next-auth";
type PostProps = {
  session: Session | null;
  subreadditId: string;
  subreadditName: string;
  post: {
    author: {
      id: string;
      name: string | null;
      username: string | null;
      email: string | null;
      emailVerified: Date | null;
      image: string;
    };
    PostVotes: PostVote[];
    Comments: Comment[];
  } & Post;
};

export const PostComponent = (props: PostProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const votes = props.post.PostVotes.reduce((n, vote) => {
    if (vote.type === VoteTypes.UP) return n + 1;
    if (vote.type === VoteTypes.DOWN) return n - 1;
    return n;
  }, 0);

  const comments = props.post.Comments.length;

  const deletePost = async () => {
    if (!props.session) {
      router.push("/signin");
      return;
    }

    const payload: DeletePostPayload = {
      postId: props.post.id,
      subreadditId: props.subreadditId,
    };

    await fetch("/api/post", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      if (response.status < 200 || response.status >= 300) {
        const error = await response.text();
        toast.error(error);
      } else {
        const success = await response.text();
        toast.success(success);
      }
    });
  };

  return (
    <div
      className={
        "relative mb-4 flex h-fit max-h-[35rem] w-full rounded-md border border-solid border-slate-500 bg-slate-50"
      }
    >
      <div className={"flex h-full w-12 flex-col bg-gray-200 p-2"}>
        <IoArrowUpSharp className={"m-auto block"} />
        <p className={"text-center"}>{votes}</p>
        <IoArrowDownSharp className={"m-auto block"} />
      </div>
      <div className={"grow p-2"}>
        {pathname !== "/" ? null : `r/${props.subreadditName}`}
        <div className={"mb-2 flex text-sm"}>
          <p className={"mr-2"}>
            Posted by <Link href={"/"}>u/{props.post.author.username}</Link>
          </p>
          <p>{formatTimeToNow(props.post.createdAt)}</p>
        </div>
        <Link href={"/"}>
          <h1 className={"my-2 text-2xl font-semibold"}>{props.post.title}</h1>
        </Link>

        <div className={"flex w-full items-center"}>
          <div className={"text-md flex items-center"}>
            <IoChatboxOutline className={"m-auto mr-2 block"} />
            <p>{comments} comments</p>
          </div>
        </div>
      </div>
      {props.session && props.post.authorId === props.session.user.id ? (
        <button
          className={"absolute right-0 top-0 m-4 text-lg"}
          onClick={(e) => {
            e.preventDefault();
            deletePost();
          }}
        >
          <IoTrashBinOutline className={"text-red-700"} />
        </button>
      ) : null}
    </div>
  );
};
