"use client";

import type { CreateCommentVotePayload } from "@/lib/validators/vote";
import { VoteTypes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const { data: session } = useSession();
  const [commentVotes, setCommentVotes] = useState(props.commentVotes);
  const [previousUserVote, setPreviousUserVote] = useState(props.userVote);
  const [userVote, setUserVote] = useState(props.userVote);
  const router = useRouter();

  useEffect(() => {
    setUserVote(props.userVote);
  }, [props.userVote]);

  const changeVote = async (payload: CreateCommentVotePayload) => {
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

  const createCommentVote = async (type: VoteTypes) => {
    if (!session) {
      router.push("/signin");
      return;
    }

    const payload: CreateCommentVotePayload = {
      commentId: props.comment.id,
      type,
    };

    if (type === "UP") {
      if (userVote === "UP") {
        setCommentVotes((commentVotes) => commentVotes - 1);
        setPreviousUserVote(userVote);
        setUserVote(undefined);
        changeVote(payload);
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
        changeVote(payload);
        return;
      }
      if (userVote === "UP") {
        setCommentVotes((commentVotes) => commentVotes - 1);
      }
      setCommentVotes((commentVotes) => commentVotes - 1);
    }
    setPreviousUserVote(userVote);
    setUserVote(type);
    changeVote(payload);
  };

  return (
    <div className={"flex gap-x-2"}>
      <button onClick={() => createCommentVote(VoteTypes.UP)}>
        <PiArrowFatUpFill
          className={`${
            userVote === "UP" ? "text-blue-700" : ""
          } hover:scale-110 max-sm:text-sm`}
        />
      </button>
      <p className={"text-center max-sm:text-sm"}>{commentVotes}</p>
      <button onClick={() => createCommentVote(VoteTypes.DOWN)}>
        <PiArrowFatDownFill
          className={`${
            userVote === "DOWN" ? "text-red-700" : ""
          } hover:scale-110 max-sm:text-sm`}
        />
      </button>
    </div>
  );
};
