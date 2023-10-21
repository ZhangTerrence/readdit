"use client";

import type { Post, Comment, PostVote } from "@prisma/client";
import { VoteTypes } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { PostPreview } from "../post/PostPreview";
import { UserComment } from "../comment/UserComment";
import { toast } from "react-toastify";

type UserInfoTypes = {
  user: {
    id: string;
  };
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
  const bottomPostRef = useRef<HTMLDivElement | null>(null);
  const bottomCommentRef = useRef<HTMLDivElement | null>(null);
  const [type, setType] = useState<"posts" | "comments">("posts");
  const [postsData, setPostsData] = useState(props.posts);
  const [commentsData, setCommentsData] = useState(props.comments);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (bottomPostRef.current) {
      observer = new IntersectionObserver(
        async (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            await fetch(
              `/api/post?page=${Math.ceil(postsData.length / 10)}&user=${
                props.user.id
              }`,
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
                    setPostsData((data) => [...data, post]);
                  });
                }
              }
            });
          }
        },
        { threshold: 1 },
      );

      observer.observe(bottomPostRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [postsData, props.user.id, type]);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (bottomCommentRef.current) {
      observer = new IntersectionObserver(
        async (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            console.log("A");
            await fetch(
              `/api/comment?page=${Math.ceil(commentsData.length / 10)}&user=${
                props.user.id
              }`,
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
                  success.map((comment: any) => {
                    setCommentsData((data) => [...data, comment]);
                  });
                }
              }
            });
          }
        },
        { threshold: 1 },
      );

      observer.observe(bottomCommentRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [commentsData, props.user.id, type]);

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
              "w-20 cursor-pointer rounded-bl-md rounded-tl-md border border-solid border-gray-400 p-2 text-center peer-checked:bg-black peer-checked:text-white"
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
              "w-30 cursor-pointer rounded-br-md rounded-tr-md border border-solid border-gray-400 p-2 text-center peer-checked:bg-black peer-checked:text-white"
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
            {postsData.map((post, i) => {
              const userVote = post.postVotes.find(
                (vote: { userId: string }) => vote.userId === session?.user.id,
              );

              if (i === postsData.length - 1) {
                return (
                  <div key={i} ref={bottomPostRef}>
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
              }

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
              {commentsData.map((comment, i) => {
                const commentVotes = comment.commentVotes.reduce((n, vote) => {
                  if (vote.type === VoteTypes.UP) return n + 1;
                  if (vote.type === VoteTypes.DOWN) return n - 1;
                  return n;
                }, 0);

                const userVote = comment.commentVotes.find(
                  (vote: { userId: string }) =>
                    vote.userId === session?.user.id,
                );

                if (i === commentsData.length - 1) {
                  return (
                    <div key={i} ref={bottomCommentRef}>
                      <UserComment
                        key={comment.id}
                        comment={comment}
                        commentVotes={commentVotes}
                        userVote={userVote?.type}
                      />
                    </div>
                  );
                }

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
