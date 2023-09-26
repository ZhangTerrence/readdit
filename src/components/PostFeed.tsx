import type { Post, PostVote, Comment } from "@prisma/client";
import { PostComponent } from "./PostComponent";
import { getAuthSession } from "@/lib/auth";
import { Session } from "next-auth";

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
            return (
              <PostComponent
                key={i}
                session={props.session}
                subreadditId={props.subreaddit.id}
                subreadditName={props.subreaddit.name}
                post={post}
              />
            );
          })
        : props.posts.map((post, i) => {
            return (
              <PostComponent
                key={i}
                session={props.session}
                subreadditId={post.subreaddit.id}
                subreadditName={post.subreaddit.name}
                post={post}
              />
            );
          })}
    </div>
  );
};
