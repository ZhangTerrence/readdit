"use client";

import { CreateCommentVotePayload } from "@/lib/validators/vote";
import { VoteTypes } from "@prisma/client";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import { IoArrowDownSharp, IoArrowUpSharp } from "react-icons/io5";
import { toast } from "react-toastify";

type CommentVoteClientProps = {
  session: Session | null;
  commentId: string;
  initialVotes: number;
  initialVote: VoteTypes | undefined;
};

export const CommentVoteClient = (props: CommentVoteClientProps) => {
  const [commentVotes, setCommentVotes] = useState(props.initialVotes);
  const [currentVote, setCurrentVote] = useState(props.initialVote);

  useEffect(() => {
    setCurrentVote(props.initialVote);
  }, [props.initialVote]);

  const createCommentVote = async (type: VoteTypes) => {
    const payload: CreateCommentVotePayload = {
      commentId: props.commentId,
      type,
    };

    await fetch("/api/comment/vote", {
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
        const success = await response.text();
        toast.success(success);
        if (type === "UP") {
          if (currentVote === "UP") {
            setCommentVotes((commentVotes) => commentVotes - 1);
            setCurrentVote(undefined);
            return;
          }
          if (currentVote === "DOWN") {
            setCommentVotes((commentVotes) => commentVotes + 1);
          }
          setCommentVotes((commentVotes) => commentVotes + 1);
        }
        if (type === "DOWN") {
          if (currentVote === "DOWN") {
            setCommentVotes((commentVotes) => commentVotes + 1);
            setCurrentVote(undefined);
            return;
          }
          if (currentVote === "UP") {
            setCommentVotes((commentVotes) => commentVotes - 1);
          }
          setCommentVotes((commentVotes) => commentVotes - 1);
        }
        setCurrentVote(type);
      }
    });
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          createCommentVote(VoteTypes.UP);
        }}
      >
        <IoArrowUpSharp
          className={`${
            currentVote === "UP" ? "text-blue-700" : ""
          } m-auto block`}
        />
      </button>
      <p className={"text-center"}>{commentVotes}</p>
      <button
        onClick={(e) => {
          e.preventDefault();
          createCommentVote(VoteTypes.DOWN);
        }}
      >
        <IoArrowDownSharp
          className={`${
            currentVote === "DOWN" ? "text-red-700" : ""
          } m-auto block`}
        />
      </button>
    </>
  );
};
