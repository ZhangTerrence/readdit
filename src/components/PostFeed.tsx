import type { Post, PostVotes, Comment } from "@prisma/client";
import { PostComponent } from "./PostComponent";
import { getAuthSession } from "@/lib/auth";

type PostFeedProps =
  | {
      type: "single";
      posts: (Post & {
        author: {
          id: string;
          username: string;
        };
        PostVotes: PostVotes[];
        Comments: Comment[];
      })[];
      subreaddit: {
        id: string;
        name: string;
      };
    }
  | {
      type: "multiple";
      posts: (Post & {
        author: {
          id: string;
          username: string;
        };
        subreaddit: {
          id: string;
          name: string;
        };
        PostVotes: PostVotes[];
        Comments: Comment[];
      })[];
    };

export const PostFeed = async (props: PostFeedProps) => {
  const session = await getAuthSession();

  return (
    <div className={"flex flex-col items-center pt-4"}>
      {props.type === "single"
        ? props.posts.map((post, i) => {
            return (
              <PostComponent
                key={i}
                session={session}
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
                session={session}
                subreadditId={post.subreaddit.id}
                subreadditName={post.subreaddit.name}
                post={post}
              />
            );
          })}
    </div>
  );
};
