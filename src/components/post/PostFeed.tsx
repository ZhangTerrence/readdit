"use client";

import type { Session } from "next-auth";
import type { Post, PostVote, Comment } from "@prisma/client";
import { PostPreview } from "./PostPreview";

type PostFeedProps =
  | {
      type: "single";
      session: Session | null;
      posts: (Post & {
        author: {
          id: string;
          username: string;
        };
        postVotes: PostVote[];
        comments: Comment[];
      })[];
      subreaddit: {
        id: string;
        name: string;
      };
    }
  | {
      type: "multiple";
      session: Session | null;
      posts: (Post & {
        author: {
          id: string;
          username: string;
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
  return (
    <div className={"flex flex-col items-center pt-4"}>
      {props.type === "single"
        ? props.posts.map((post, i) => {
            const currentVote = post.postVotes.find(
              (vote: { userId: string }) =>
                vote.userId === props.session?.user.id,
            );

            return (
              <PostPreview
                key={i}
                session={props.session}
                subreadditId={props.subreaddit.id}
                subreadditName={props.subreaddit.name}
                post={post}
                currentVote={currentVote?.type}
              />
            );
          })
        : props.posts.map((post, i) => {
            const currentVote = post.postVotes.find(
              (vote: { userId: string }) =>
                vote.userId === props.session?.user.id,
            );

            return (
              <PostPreview
                key={i}
                session={props.session}
                subreadditId={post.subreaddit.id}
                subreadditName={post.subreaddit.name}
                post={post}
                currentVote={currentVote?.type}
              />
            );
          })}
    </div>
  );
};
