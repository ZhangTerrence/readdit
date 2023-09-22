"use client";

import type { Session } from "next-auth";
import type { Post, PostVote, Comment } from "@prisma/client";
import { PostComponent } from "./Post";

type PostFeedProps = {
  session: Session | null;
  subreadditId: string;
  subreadditName: string;
  posts: ({
    author: {
      id: string;
      name: string | null;
      username: string | null;
      email: string | null;
      emailVerified: Date | null;
      image: string;
    };
    PostVotes: PostVote[];
    Comments: Comment[];
  } & Post)[];
};

export const PostFeed = (props: PostFeedProps) => {
  return (
    <div className={"flex flex-col items-center pt-4"}>
      {props.posts.map((post, i) => {
        return (
          <PostComponent
            key={i}
            session={props.session}
            post={post}
            subreadditId={props.subreadditId}
            subreadditName={props.subreadditName}
          />
        );
      })}
    </div>
  );
};
