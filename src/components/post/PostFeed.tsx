"use client";

import type { Post, PostVote, Comment } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { PostPreview } from "./PostPreview";
import { toast } from "react-toastify";

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
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState(props);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (bottomRef.current) {
      observer = new IntersectionObserver(
        async (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            if (data.type === "single") {
              await fetch(
                `/api/post?page=${Math.ceil(
                  data.posts.length / 10,
                )}&subreaddit=${data.subreaddit.id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                },
              ).then(async (response) => {
                if (response.status < 200 || response.status >= 300) {
                  const error = await response.text();
                  toast.error(error);
                } else {
                  const success = await response.json();
                  if (success) {
                    success.map((post: any) => {
                      setData((data) => {
                        return {
                          ...data,
                          posts: [...data.posts, post],
                        };
                      });
                    });
                  }
                }
              });
            } else {
              await fetch(
                `/api/post?page=${Math.ceil(data.posts.length / 10)}`,
              ).then(async (response) => {
                if (response.status < 200 || response.status >= 300) {
                  const error = await response.text();
                  console.log(error);
                  toast.error(error);
                } else {
                  const success = await response.json();
                  if (success) {
                    success.map((post: any) => {
                      setData((data) => {
                        return {
                          ...data,
                          posts: [...data.posts, post],
                        };
                      });
                    });
                  }
                }
              });
            }

            bottomRef.current = null;
          }
        },
        { threshold: 1 },
      );

      observer.observe(bottomRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [data]);

  return (
    <div className={"flex flex-col justify-center"}>
      {data.type === "single"
        ? data.posts.map((post, i) => {
            const userVote = post.postVotes.find(
              (vote: { userId: string }) => vote.userId === session?.user.id,
            );

            if (i === data.posts.length - 1) {
              return (
                <div key={i} ref={bottomRef}>
                  <PostPreview
                    key={post.id}
                    subreaddit={{
                      id: data.subreaddit.id,
                      name: data.subreaddit.name,
                    }}
                    userVote={userVote?.type}
                    post={post}
                  />
                </div>
              );
            } else {
              return (
                <PostPreview
                  key={post.id}
                  subreaddit={{
                    id: data.subreaddit.id,
                    name: data.subreaddit.name,
                  }}
                  userVote={userVote?.type}
                  post={post}
                />
              );
            }
          })
        : data.posts.map((post, i) => {
            const userVote = post.postVotes.find(
              (vote: { userId: string }) => vote.userId === session?.user.id,
            );

            if (i === data.posts.length - 1) {
              return (
                <div key={i} ref={bottomRef}>
                  <PostPreview
                    key={post.id}
                    subreaddit={{
                      id: post.subreaddit.id,
                      name: post.subreaddit.name,
                    }}
                    userVote={userVote?.type}
                    post={post}
                  />
                </div>
              );
            } else {
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
            }
          })}
    </div>
  );
};
