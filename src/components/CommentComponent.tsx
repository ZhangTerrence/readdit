"use client";

import type { Session } from "next-auth";
import type { Comment, CommentVote } from "@prisma/client";
import { useState } from "react";
import { VoteTypes } from "@prisma/client";
import {
  IoArrowDownSharp,
  IoArrowUpSharp,
  IoChatboxOutline,
} from "react-icons/io5";
import { CreateComment } from "./comment/CreateComment";

type CommentComponentProps = {
  session: Session | null;
  postId: string;
  comment: Comment & {
    author: {
      id: string;
      username: string;
      image: string;
    };
    commentVotes: CommentVote[];
  };
};

export const CommentComponent = (props: CommentComponentProps) => {
  const [commenting, setCommenting] = useState(false);

  const votes = props.comment.commentVotes.reduce((n, vote) => {
    if (vote.type === VoteTypes.UP) return n + 1;
    if (vote.type === VoteTypes.DOWN) return n - 1;
    return n;
  }, 0);

  return (
    <div className={`mb-4 border-b border-solid border-slate-300`}>
      <UserComment comment={props.comment} />
      <div className={"flex items-center"}>
        <div className={"mr-2 flex items-center p-2 text-lg"}>
          <IoArrowUpSharp className={"mr-2"} />
          <p className={"text-center"}>{votes}</p>
          <IoArrowDownSharp className={"ml-2"} />
        </div>
        <button
          className={
            "flex items-center rounded-md p-2 text-lg hover:bg-slate-200"
          }
          onClick={() => setCommenting(true)}
        >
          <IoChatboxOutline />
          <p className={"ml-2"}>Comment</p>
        </button>
      </div>
      <div className={``}></div>
    </div>
  );
};
