"use client";

import type { Post, PostVote, Comment } from "@prisma/client";
import { useSession } from "next-auth/react";
import { PostPreview } from "./PostPreview";

type PostFeedProps =
  | {
      type: "single";
      subreaddit: {
        id: string;
        name: string;
      };
      posts: (Post & {
        author: {
          id: string;
          username: string | null;
        };
        postVotes: PostVote[];
        comments: Comment[];
      })[];
    }
  | {
      type: "multiple";
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
    };

export const PostFeed = (props: PostFeedProps) => {
  const { data: session } = useSession();

  return (
    <div className={"flex flex-col justify-center"}>
      {props.type === "single"
        ? props.posts.map((post) => {
            const userVote = post.postVotes.find(
              (vote: { userId: string }) => vote.userId === session?.user.id,
            );

            return (
              <PostPreview
                key={post.id}
                subreaddit={{
                  id: props.subreaddit.id,
                  name: props.subreaddit.name,
                }}
                userVote={userVote?.type}
                post={post}
              />
            );
          })
        : props.posts.map((post) => {
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
    </div>
  );
};
