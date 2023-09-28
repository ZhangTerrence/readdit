"use client";

import type { Session } from "next-auth";
import type { Post, PostVote, Comment } from "@prisma/client";
import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ContentRenderer } from "../renderers/ContentRenderer";
import { formatTimeToNow } from "@/lib/formatter";
import { DeletePostPayload } from "@/lib/validators/post";
import { VoteTypes } from "@prisma/client";
import { BsDot } from "react-icons/bs";
import {
  IoArrowDownSharp,
  IoArrowUpSharp,
  IoChatboxOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";

type PostPreviewProps = {
  session: Session | null;
  post: Post & {
    author: {
      id: string;
      username: string | null;
    };
    postVotes: PostVote[];
    comments: Comment[];
  };
  subreadditId: string;
  subreadditName: string;
};

export const PostPreview = (props: PostPreviewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [blurDiv, setBlurDiv] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const votes = props.post.postVotes.reduce((n, vote) => {
    if (vote.type === VoteTypes.UP) return n + 1;
    if (vote.type === VoteTypes.DOWN) return n - 1;
    return n;
  }, 0);

  const comments = props.post.comments.length;

  const checkOverflow = () => {
    contentRef.current?.clientHeight === 560
      ? setBlurDiv(true)
      : setBlurDiv(false);
  };

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
        "relative mb-4 flex h-fit w-full rounded-md border border-solid border-slate-500 bg-slate-50"
      }
    >
      <div className={"w-12 bg-gray-200 p-3 text-xl"}>
        <IoArrowUpSharp className={"m-auto block"} />
        <p className={"text-center"}>{votes}</p>
        <IoArrowDownSharp className={"m-auto block"} />
      </div>
      <div className={"grow px-4 py-2"}>
        <div className={"mb-2 flex text-sm"}>
          {pathname === "/" ? (
            <Link
              className={"hover:underline"}
              href={`/r/${props.subreadditName}`}
            >
              <span>r/{props.subreadditName}</span>
              <BsDot className={"inline-block"} />
            </Link>
          ) : null}
          <p className={"mr-2"}>
            Posted by{" "}
            <Link
              className={"hover:underline"}
              href={`/u/${props.post.author.id}`}
            >
              u/{props.post.author.username}
            </Link>
          </p>
          <p>{formatTimeToNow(props.post.createdAt)}</p>
        </div>
        <Link href={`/r/${props.subreadditName}/post/${props.post.id}`}>
          <h1 className={"my-2 text-2xl font-semibold"}>{props.post.title}</h1>
        </Link>
        <div
          className={
            "relative my-4 max-h-[35rem] w-full cursor-pointer overflow-clip text-sm"
          }
          ref={contentRef}
          onLoad={() => checkOverflow()}
          onClick={() =>
            router.push(`/r/${props.subreadditName}/post/${props.post.id}`)
          }
        >
          <ContentRenderer content={props.post.content} />
          {blurDiv ? (
            <div
              className={
                "absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-slate-50 to-transparent"
              }
            />
          ) : null}
        </div>
        <div className={"flex w-full items-center"}>
          <Link
            className={"text-md flex items-center"}
            href={`/r/${props.subreadditName}/post/${props.post.id}`}
          >
            <IoChatboxOutline className={"m-auto mr-2 block"} />
            <p>{comments} comments</p>
          </Link>
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
