"use client";

import { VoteTypes } from "@prisma/client";
import { useEffect, useState } from "react";
import { CreateCommentVotePayload } from "@/lib/validators/vote";
import { PiArrowFatUpFill, PiArrowFatDownFill } from "react-icons/pi";
import { toast } from "react-toastify";

type CommentVoteButtonsProps = {
  comment: {
    id: string;
  };
  commentVotes: number;
  userVote: VoteTypes | undefined;
};

export const CommentVoteButtons = (props: CommentVoteButtonsProps) => {
  const [commentVotes, setCommentVotes] = useState(props.commentVotes);
  const [previousUserVote, setPreviousUserVote] = useState(props.userVote);
  const [userVote, setUserVote] = useState(props.userVote);

  useEffect(() => {
    setUserVote(props.userVote);
  }, [props.userVote]);

  const createCommentVote = async (type: VoteTypes) => {
    const payload: CreateCommentVotePayload = {
      commentId: props.comment.id,
      type,
    };

    if (type === "UP") {
      if (userVote === "UP") {
        setCommentVotes((commentVotes) => commentVotes - 1);
        setPreviousUserVote(userVote);
        setUserVote(undefined);
        return;
      }
      if (userVote === "DOWN") {
        setCommentVotes((commentVotes) => commentVotes + 1);
      }
      setCommentVotes((commentVotes) => commentVotes + 1);
    }
    if (type === "DOWN") {
      if (userVote === "DOWN") {
        setCommentVotes((commentVotes) => commentVotes + 1);
        setPreviousUserVote(userVote);
        setUserVote(undefined);
        return;
      }
      if (userVote === "UP") {
        setCommentVotes((commentVotes) => commentVotes - 1);
      }
      setCommentVotes((commentVotes) => commentVotes - 1);
    }
    setPreviousUserVote(userVote);
    setUserVote(type);

    await fetch("/api/comment/vote", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      if (response.status < 200 || response.status >= 300) {
        const error = await response.text();
        setUserVote(previousUserVote);
        toast.error(error);
      }
    });
  };

  return (
    <div className={"flex gap-x-2"}>
      <button onClick={() => createCommentVote(VoteTypes.UP)}>
        <PiArrowFatUpFill
          className={`${
            userVote === "UP" ? "text-blue-700" : ""
          } hover:scale-110`}
        />
      </button>
      <p className={"text-center"}>{commentVotes}</p>
      <button onClick={() => createCommentVote(VoteTypes.DOWN)}>
        <PiArrowFatDownFill
          className={`${
            userVote === "DOWN" ? "text-red-700" : ""
          } hover:scale-110`}
        />
      </button>
    </div>
  );
};
