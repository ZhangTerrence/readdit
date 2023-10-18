"use client";

import type { Post, Comment, PostVote } from "@prisma/client";
import { VoteTypes } from "@prisma/client";
import { useState } from "react";
import { PostPreview } from "../post/PostPreview";
import { useSession } from "next-auth/react";
import { UserComment } from "../comment/UserComment";

type UserInfoTypes = {
  posts: (Post & {
    author: {
      id: string;
      username: string | null;
    };
    subreaddit: {
      id: string;
      name: string;
    };
    postVotes: PostVote[];
    comments: Comment[];
  })[];
  comments: (Comment & {
    author: {
      image: string;
      id: string;
      username: string | null;
    };
    commentVotes: {
      userId: string;
      commentId: string;
      type: VoteTypes;
    }[];
  })[];
};

export const UserInfo = (props: UserInfoTypes) => {
  const { data: session } = useSession();
  const [type, setType] = useState<"posts" | "comments">("posts");

  return (
    <div className={"flex flex-col gap-y-4"}>
      <div className={"flex"}>
        <label>
          <input
            className={"peer invisible absolute"}
            type="radio"
            name={"posts"}
            checked={type === "posts"}
            onChange={() => setType("posts")}
          />
          <div
            className={
              "w-20 cursor-pointer border border-solid border-gray-400 p-2 text-center peer-checked:bg-black peer-checked:text-white"
            }
          >
            Posts
          </div>
        </label>
        <label>
          <input
            className={"peer invisible absolute"}
            type="radio"
            name={"comments"}
            checked={type === "comments"}
            onChange={() => setType("comments")}
          />
          <div
            className={
              "w-30 cursor-pointer border border-solid border-gray-400 p-2 text-center peer-checked:bg-black peer-checked:text-white"
            }
          >
            Comments
          </div>
        </label>
      </div>
      <div className={"flex w-full flex-col gap-y-2"}>
        {type === "posts" ? (
          <>
            <h1
              className={
                "mb-4 w-full border-b border-solid border-black pb-2 text-2xl"
              }
            >
              Posts
            </h1>
            {props.posts.map((post) => {
              const userVote = post.postVotes.find(
                (vote: { userId: string }) => vote.userId === session?.user.id,
              );

              return (
                <PostPreview
                  key={post.id}
                  subreaddit={{
                    id: post.subreaddit.id,
                    name: post.subreaddit.name,
                  }}
                  userVote={userVote?.type}
                  post={post}
                />
              );
            })}
          </>
        ) : (
          <>
            <h1
              className={
                "mb-4 w-full border-b border-solid border-black pb-2 text-2xl"
              }
            >
              Comments
            </h1>
            <div className={"flex flex-col gap-y-6"}>
              {props.comments.map((comment) => {
                const commentVotes = comment.commentVotes.reduce((n, vote) => {
                  if (vote.type === VoteTypes.UP) return n + 1;
                  if (vote.type === VoteTypes.DOWN) return n - 1;
                  return n;
                }, 0);

                const userVote = comment.commentVotes.find(
                  (vote: { userId: string }) =>
                    vote.userId === session?.user.id,
                );

                return (
                  <UserComment
                    key={comment.id}
                    comment={comment}
                    commentVotes={commentVotes}
                    userVote={userVote?.type}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
