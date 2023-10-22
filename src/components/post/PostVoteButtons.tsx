"use client";

import type { CreatePostVotePayload } from "@/lib/validators/vote";
import { VoteTypes } from "@prisma/client";
import { useEffect, useState } from "react";
import { PiArrowFatUpFill, PiArrowFatDownFill } from "react-icons/pi";
import { toast } from "react-toastify";

type PostVoteButtonsProps = {
  post: {
    id: string;
  };
  postVotes: number;
  userVote: VoteTypes | undefined;
};

export const PostVoteButtons = (props: PostVoteButtonsProps) => {
  const [postVotes, setPostVotes] = useState(props.postVotes);
  const [previousUserVote, setPreviousUserVote] = useState(props.userVote);
  const [userVote, setUserVote] = useState(props.userVote);

  useEffect(() => {
    setUserVote(props.userVote);
  }, [props.userVote]);

  const changeVote = async (payload: CreatePostVotePayload) => {
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
        setUserVote(previousUserVote);
      }
    });
  };

  const createPostVote = async (type: VoteTypes) => {
    const payload: CreatePostVotePayload = {
      postId: props.post.id,
      type,
    };

    if (type === "UP") {
      if (userVote === "UP") {
        setPostVotes((postVotes) => postVotes - 1);
        setPreviousUserVote(userVote);
        setUserVote(undefined);
        changeVote(payload);
        return;
      }
      if (userVote === "DOWN") {
        setPostVotes((postVotes) => postVotes + 1);
      }
      setPostVotes((postVotes) => postVotes + 1);
    }
    if (type === "DOWN") {
      if (userVote === "DOWN") {
        setPostVotes((postVotes) => postVotes + 1);
        setPreviousUserVote(userVote);
        setUserVote(undefined);
        changeVote(payload);
        return;
      }
      if (userVote === "UP") {
        setPostVotes((postVotes) => postVotes - 1);
      }
      setPostVotes((postVotes) => postVotes - 1);
    }
    setPreviousUserVote(userVote);
    setUserVote(type);
    changeVote(payload);
  };

  return (
    <>
      <button onClick={() => createPostVote(VoteTypes.UP)}>
        <PiArrowFatUpFill
          className={`${
            userVote === "UP" ? "text-blue-700" : ""
          } hover:scale-110`}
        />
      </button>
      <p className={"text-center"}>{postVotes}</p>
      <button onClick={() => createPostVote(VoteTypes.DOWN)}>
        <PiArrowFatDownFill
          className={`${
            userVote === "DOWN" ? "text-red-700" : ""
          } hover:scale-110`}
        />
      </button>
    </>
  );
};
