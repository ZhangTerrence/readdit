"use client";

import type { Post, PostVote, Comment } from "@prisma/client";
import type { DeletePostPayload } from "@/lib/validators/post";
import { VoteTypes } from "@prisma/client";
import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ContentRenderer } from "../renderers/ContentRenderer";
import { PostVoteButtons } from "./PostVoteButtons";
import { formatTimeToNow } from "@/lib/formatter";
import { BsDot } from "react-icons/bs";
import { IoChatboxOutline, IoTrashBinOutline } from "react-icons/io5";
import { toast } from "react-toastify";

type PostPreviewProps = {
  subreaddit: {
    id: string;
    name: string;
  };
  post: Post & {
    author: {
      id: string;
      username: string | null;
    };
    postVotes: PostVote[];
    comments: Comment[];
  };
  userVote: VoteTypes | undefined;
};

export const PostPreview = (props: PostPreviewProps) => {
  const { data: session } = useSession();
  const contentRef = useRef<HTMLDivElement>(null);
  const [divBlur, setDivBlur] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const postVotes = props.post.postVotes.reduce((n, vote) => {
    if (vote.type === VoteTypes.UP) return n + 1;
    if (vote.type === VoteTypes.DOWN) return n - 1;
    return n;
  }, 0);
  const comments = props.post.comments.length;

  const checkOverflow = () => {
    contentRef.current?.clientHeight === 560
      ? setDivBlur(true)
      : setDivBlur(false);
  };

  const goToSubreaddit = () => {
    router.refresh();
    router.push(`/r/${props.subreaddit.name}`);
  };

  const goToPost = () => {
    router.refresh();
    router.push(`/r/${props.subreaddit.name}/post/${props.post.id}`);
  };

  const goToUser = () => {
    router.refresh();
    router.push(`/u/${props.post.author.id}`);
  };

  const deletePost = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }

    const payload: DeletePostPayload = {
      postId: props.post.id,
      subreadditId: props.subreaddit.id,
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
        setTimeout(() => {
          router.refresh();
        }, 500);
      }
    });
  };

  return (
    <div
      className={
        "relative mb-4 flex h-fit w-full overflow-hidden rounded-md border border-solid border-gray-500"
      }
    >
      <div
        className={"flex w-12 flex-col items-center bg-gray-100 p-3 text-xl"}
      >
        <PostVoteButtons
          post={{
            id: props.post.id,
          }}
          postVotes={postVotes}
          userVote={props.userVote}
        />
      </div>
      <div className={"flex grow flex-col gap-y-2 px-4 py-2"}>
        <div className={"flex text-sm"}>
          {!pathname.includes("/r/") ? (
            <button
              className={"hover:underline"}
              onClick={() => goToSubreaddit()}
            >
              <span>r/{props.subreaddit.name}</span>
              <BsDot className={"inline-block"} />
            </button>
          ) : null}
          <p className={"mr-2"}>
            Posted by
            <a
              className={"cursor-pointer hover:underline"}
              onClick={() => goToUser()}
            >
              u/{props.post.author.username}
            </a>
          </p>
          <p>{formatTimeToNow(new Date(props.post.createdAt))}</p>
        </div>
        <h1
          className={"cursor-pointer text-2xl font-semibold"}
          onClick={() => goToPost()}
        >
          {props.post.title}
        </h1>
        <div
          className={
            "relative max-h-[35rem] w-full cursor-pointer overflow-clip text-sm"
          }
          ref={contentRef}
          onLoad={() => checkOverflow()}
          onClick={() => goToPost()}
        >
          <ContentRenderer content={props.post.content} />
          {divBlur ? (
            <div
              className={
                "absolute bottom-0 left-0 h-24 w-full cursor-pointer bg-gradient-to-t from-slate-100 to-transparent"
              }
            />
          ) : null}
        </div>
        <div className={"flex w-full cursor-pointer items-center"}>
          <button
            className={"text-md flex items-center gap-x-2"}
            onClick={() => goToPost()}
          >
            <IoChatboxOutline />
            <p>{comments} comments</p>
          </button>
        </div>
      </div>
      {session && props.post.authorId === session.user.id ? (
        <div
          className={
            "absolute right-0 top-0 m-2 rounded-full p-2 transition-colors hover:bg-red-50"
          }
          onClick={() => deletePost()}
        >
          <IoTrashBinOutline className={"text-lg text-red-700"} />
        </div>
      ) : null}
    </div>
  );
};
