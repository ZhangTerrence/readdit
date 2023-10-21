"use client";

import type { Comment, CommentVote, VoteTypes } from "@prisma/client";
import type {
  DeleteCommentPayload,
  UpdateCommentPayload,
} from "@/lib/validators/comment";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CreateComment } from "./CreateComment";
import { CommentVoteButtons } from "./CommentVoteButtons";
import { formatTimeToNow } from "@/lib/formatter";
import { BsDot } from "react-icons/bs";
import {
  IoChatboxOutline,
  IoTrashBinOutline,
  IoPencilOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";

type UserCommentProps = {
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

export const UserComment = (props: UserCommentProps) => {
  const { data: session } = useSession();
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(props.comment.text ?? "");
  const [text, setText] = useState(props.comment.text ?? "");
  const router = useRouter();

  const hide = () => {
    setReplying(false);
  };

  const editComment = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }

    if (editText === "") {
      toast.error("Text is required.");
      return;
    }

    const payload: UpdateCommentPayload = {
      commentId: props.comment.id,
      text: editText,
    };

    await fetch("/api/comment", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      if (response.status < 200 || response.status >= 300) {
        const error = await response.text();
        toast.error(error);
      } else {
        setText(editText);
        setEditing(false);
        setTimeout(() => {
          router.refresh();
        }, 100);
      }
    });
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
        setTimeout(() => {
          router.refresh();
        }, 500);
      }
    });
  };

  return (
    <div className={"relative flex min-w-[35rem] flex-col gap-y-2"}>
      {props.comment.authorId === "[deleted]" ? (
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
            <div className={"flex items-center"}>
              <Link
                className={"hover:underline"}
                href={`/u/${props.comment.author.id}`}
              >
                u/{props.comment.author.username}
              </Link>
              <BsDot />
              <p>{formatTimeToNow(new Date(props.comment.createdAt))}</p>
              {new Date(props.comment.updatedAt).getTime() !==
              new Date(props.comment.createdAt).getTime() ? (
                <p className={"ml-2 italic"}>Edited</p>
              ) : null}
            </div>
          </div>
          {editing ? (
            <textarea
              className={
                "mt-2 max-h-60 min-h-[5rem] rounded-md border border-solid border-black p-2 outline-none"
              }
              value={editText}
              placeholder={"Editing comment..."}
              onChange={(e) => setEditText(e.target.value)}
            ></textarea>
          ) : (
            <p className={"mt-2 min-w-[35rem] break-words pr-4"}>{text}</p>
          )}
        </>
      )}
      <div className={"flex justify-between"}>
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
        {editing ? (
          <div
            className={
              "group relative inline-flex cursor-pointer items-center justify-center self-end rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow-md active:shadow-none"
            }
            onClick={() => editComment()}
          >
            <span
              className={
                "absolute h-0 max-h-full w-0 rounded-full bg-white opacity-10 transition-all duration-75 ease-out group-hover:h-32 group-hover:w-full"
              }
            ></span>
            <button className={"relative"}>Confirm</button>
          </div>
        ) : null}
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
        <div className={"absolute right-0 top-0 m-2 flex text-lg"}>
          <div
            className={"rounded-full p-2 transition-colors hover:bg-gray-50"}
            onClick={() => setEditing(!editing)}
          >
            <IoPencilOutline />
          </div>
          <div
            className={"rounded-full p-2 transition-colors hover:bg-red-50"}
            onClick={() => deleteComment()}
          >
            <IoTrashBinOutline className={"text-red-700"} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
