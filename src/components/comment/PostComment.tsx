"use client";

import type { Comment, CommentVote, VoteTypes } from "@prisma/client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatTimeToNow } from "@/lib/formatter";
import { BsDot } from "react-icons/bs";
import { IoChatboxOutline, IoTrashBinOutline } from "react-icons/io5";
import { CreateComment } from "./CreateComment";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { DeleteCommentPayload } from "@/lib/validators/comment";
import { toast } from "react-toastify";
import { CommentVoteClient } from "../vote/CommentVoteClient";

type PostCommentProps = {
  session: Session | null;
  comment: Comment & {
    author: {
      id: string;
      username: string;
      image: string;
    };
    commentVotes: CommentVote[];
  };
  initialVotes: number;
  initialVote: VoteTypes | undefined;
};

export const PostComment = (props: PostCommentProps) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const [isReplying, setIsReplying] = useState(false);

  const router = useRouter();

  const closeReplying = () => {
    setIsReplying(false);
  };

  const deleteComment = async () => {
    if (!props.session) {
      router.push("/signin");
      return;
    }

    const payload: DeleteCommentPayload = {
      id: props.comment.id,
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
    <div ref={commentRef} className={"relative flex flex-col gap-y-2"}>
      {props.comment.authorId === "" ? (
        <div className={"flex items-center"}>
          <Image
            className={"mr-2 rounded-full"}
            src={props.comment.author.image}
            alt={"user image"}
            width={30}
            height={30}
          />
          <p className={"mt-1"}>{props.comment.text}</p>
        </div>
      ) : (
        <>
          <div className={"flex items-center"}>
            <Image
              className={"mr-2 rounded-full"}
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
          <p className={"mt-1"}>{props.comment.text}</p>
        </>
      )}
      <div className={"flex items-center"}>
        <div className={"mr-2 flex items-center p-2 text-lg"}>
          <CommentVoteClient
            session={props.session}
            commentId={props.comment.id}
            initialVotes={props.initialVotes}
            initialVote={props.initialVote}
          />
        </div>
        <button
          className={
            "flex items-center rounded-md p-2 text-lg hover:bg-slate-200"
          }
          onClick={() => setIsReplying(!isReplying)}
        >
          <IoChatboxOutline />
          <p className={"ml-2"}>Reply</p>
        </button>
      </div>
      {isReplying ? (
        <CreateComment
          session={props.session}
          postId={props.comment.postId}
          replyingToId={props.comment.id}
          closeReplying={closeReplying}
        />
      ) : null}
      {props.session && props.comment.authorId === props.session.user.id ? (
        <button
          className={"absolute right-0 top-0 m-4 text-lg"}
          onClick={(e) => {
            e.preventDefault();
            deleteComment();
          }}
        >
          <IoTrashBinOutline className={"text-red-700"} />
        </button>
      ) : null}
    </div>
  );
};
