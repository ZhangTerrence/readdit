"use client";

import { CreatePostVotePayload } from "@/lib/validators/vote";
import { VoteTypes } from "@prisma/client";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import { PiArrowFatUpFill, PiArrowFatDownFill } from "react-icons/pi";
import { toast } from "react-toastify";

type PostVoteClientProps = {
  session: Session | null;
  postId: string;
  initialVotes: number;
  initialVote: VoteTypes | undefined;
};

export const PostVoteClient = (props: PostVoteClientProps) => {
  const [postVotes, setPostVotes] = useState(props.initialVotes);
  const [currentVote, setCurrentVote] = useState(props.initialVote);

  useEffect(() => {
    setCurrentVote(props.initialVote);
  }, [props.initialVote]);

  const createPostVote = async (type: VoteTypes) => {
    const payload: CreatePostVotePayload = {
      postId: props.postId,
      type,
    };

    await fetch("/api/post/vote", {
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
            setPostVotes((postVotes) => postVotes - 1);
            setCurrentVote(undefined);
            return;
          }
          if (currentVote === "DOWN") {
            setPostVotes((postVotes) => postVotes + 1);
          }
          setPostVotes((postVotes) => postVotes + 1);
        }
        if (type === "DOWN") {
          if (currentVote === "DOWN") {
            setPostVotes((postVotes) => postVotes + 1);
            setCurrentVote(undefined);
            return;
          }
          if (currentVote === "UP") {
            setPostVotes((postVotes) => postVotes - 1);
          }
          setPostVotes((postVotes) => postVotes - 1);
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
          createPostVote(VoteTypes.UP);
        }}
      >
        <PiArrowFatUpFill
          className={`${
            currentVote === "UP" ? "text-blue-700" : ""
          } m-auto block`}
        />
      </button>
      <p className={"text-center"}>{postVotes}</p>
      <button
        onClick={(e) => {
          e.preventDefault();
          createPostVote(VoteTypes.DOWN);
        }}
      >
        <PiArrowFatDownFill
          className={`${
            currentVote === "DOWN" ? "text-red-700" : ""
          } m-auto block`}
        />
      </button>
    </>
  );
};
