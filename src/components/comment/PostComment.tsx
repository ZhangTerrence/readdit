"use client";

import type { Comment, CommentVote, VoteTypes } from "@prisma/client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreateComment } from "./CreateComment";
import { CommentVoteButtons } from "./CommentVoteButtons";
import { DeleteCommentPayload } from "@/lib/validators/comment";
import { formatTimeToNow } from "@/lib/formatter";
import { BsDot } from "react-icons/bs";
import { IoChatboxOutline, IoTrashBinOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

type PostCommentProps = {
  comment: Comment & {
    author: {
      id: string;
      username: string | null;
      image: string;
    };
    commentVotes: CommentVote[];
  };
  commentVotes: number;
  userVote: VoteTypes | undefined;
};

export const PostComment = (props: PostCommentProps) => {
  const { data: session } = useSession();
  const commentRef = useRef<HTMLDivElement>(null);
  const [replying, setReplying] = useState(false);

  const router = useRouter();

  const hide = () => {
    setReplying(false);
  };

  const deleteComment = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }

    const payload: DeleteCommentPayload = {
      commentId: props.comment.id,
    };

    await fetch("/api/comment", {
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
      ref={commentRef}
      className={"relative flex min-w-[35rem] flex-col gap-y-2"}
    >
      {props.comment.authorId === "" ? (
        <div className={"flex items-center gap-x-2"}>
          <Image
            className={"rounded-full"}
            src={props.comment.author.image}
            alt={"user image"}
            width={30}
            height={30}
          />
          <p className={"mt-2"}>{props.comment.text}</p>
        </div>
      ) : (
        <>
          <div className={"flex items-center gap-x-2"}>
            <Image
              className={"rounded-full"}
              src={props.comment.author.image}
              alt={"user image"}
              width={30}
              height={30}
            />
            <Link
              className={"hover:underline"}
              href={`/u/${props.comment.author.id}`}
            >
              u/{props.comment.author.username}
            </Link>
            <BsDot />
            <p>{formatTimeToNow(props.comment.createdAt)}</p>
          </div>
          <p className={"mt-2 min-w-[35rem] break-words pr-4"}>
            {props.comment.text}
          </p>
        </>
      )}
      <div className={"flex items-center gap-x-2"}>
        <div className={"flex items-center text-lg"}>
          <CommentVoteButtons
            comment={{
              id: props.comment.id,
            }}
            commentVotes={props.commentVotes}
            userVote={props.userVote}
          />
        </div>
        <button
          className={
            "flex items-center gap-x-2 rounded-md p-2 text-lg hover:bg-gray-50"
          }
          onClick={() => setReplying(!replying)}
        >
          <IoChatboxOutline />
          <p>Reply</p>
        </button>
      </div>
      {replying ? (
        <CreateComment
          post={{
            id: props.comment.postId,
          }}
          replyId={props.comment.id}
          hide={hide}
        />
      ) : null}
      {session && props.comment.authorId === session.user.id ? (
        <div
          className={
            "absolute right-0 top-0 m-2 rounded-full p-2 transition-colors hover:bg-red-50"
          }
          onClick={() => deleteComment()}
        >
          <IoTrashBinOutline className={"text-lg text-red-700"} />
        </div>
      ) : null}
    </div>
  );
};
