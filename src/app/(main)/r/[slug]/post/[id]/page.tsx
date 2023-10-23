import { VoteTypes } from "@prisma/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CommentSection } from "@/components/comment/CommentSection";
import { CreateComment } from "@/components/comment/CreateComment";
import { PostVoteButtons } from "@/components/post/PostVoteButtons";
import { SubreadditButton } from "@/components/subreaddit/SubreadditButton";
import { ContentRenderer } from "@/components/renderers/ContentRenderer";
import { SubscriptionButton } from "@/components/subscription/SubscriptionButtons";
import { formatTimeToNow } from "@/lib/formatter";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FaBirthdayCake, FaUser } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import { UserButton } from "@/components/user/UserButton";

export default async function PostPage({
  params,
  searchParams,
}: {
  params: {
    id: string;
  };
  searchParams: {
    take: string;
  };
}) {
  const session = await getAuthSession();

  const post = await prisma.post.findFirst({
    where: {
      id: params.id,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      subreaddit: true,
      postVotes: true,
      comments: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
          commentVotes: true,
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  image: true,
                },
              },
              commentVotes: true,
              replies: {
                include: {
                  author: {
                    select: {
                      id: true,
                      username: true,
                      image: true,
                    },
                  },
                  commentVotes: true,
                },
                orderBy: {
                  createdAt: "desc",
                },
                take: 10,
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: searchParams.take ? parseInt(searchParams.take) * 10 + 10 : 10,
      },
    },
  });

  if (!post) return notFound();

  const subscription = session?.user
    ? await prisma.subscription.findFirst({
        where: {
          userId: session.user.id,
          subreadditId: post.subreaddit.id,
        },
      })
    : null;
  const isSubscribed = !!subscription;

  const postVotes = post.postVotes.reduce((n, vote) => {
    if (vote.type === VoteTypes.UP) return n + 1;
    if (vote.type === VoteTypes.DOWN) return n - 1;
    return n;
  }, 0);

  const userVote = post.postVotes.find(
    (vote: { userId: string }) => vote.userId === session?.user.id,
  );

  const subscribers = await prisma.subscription.count({
    where: {
      subreadditId: post.subreaddit.id,
    },
  });

  const topLevelComments = post.comments.filter(
    (comment) => !comment.replyingToId,
  );

  const totalTopLevelComments = await prisma.comment.count({
    where: {
      postId: post.id,
      replyingToId: null,
    },
  });

  return (
    <div
      className={"flex h-fit min-h-[calc(100vh-4rem)] justify-center bg-black"}
    >
      <div
        className={
          "flex max-w-[85rem] gap-4 bg-white p-8 max-xl:w-full max-xl:flex-col-reverse"
        }
      >
        <div
          className={
            "flex w-[50rem] flex-col gap-y-2 rounded-md p-4 max-xl:w-full max-xl:p-0"
          }
        >
          <div className={"flex gap-x-3 pb-4 max-xl:flex-col max-xl:gap-y-2"}>
            <div
              className={
                "text-2xl max-xl:flex max-xl:justify-center max-xl:gap-x-2"
              }
            >
              <PostVoteButtons
                post={{
                  id: post.id,
                }}
                postVotes={postVotes}
                userVote={userVote?.type}
              />
            </div>
            <div
              className={
                "flex grow flex-col gap-y-2 border-l border-solid border-gray-400 pl-4"
              }
            >
              <div className={"flex text-sm"}>
                <p className={"mr-2"}>
                  Posted by{" "}
                  <UserButton
                    user={{
                      id: post.author.id,
                    }}
                  >
                    u/{post.author.username}
                  </UserButton>
                </p>
                <p>{formatTimeToNow(post.createdAt)}</p>
              </div>
              <h1 className={"text-4xl"}>{post.title}</h1>
              <ContentRenderer content={post.content} />
            </div>
          </div>
          <hr className={"border-t border-solid border-black pb-4"} />
          <CreateComment
            post={{
              id: post.id,
            }}
          />
          <div className={"overflow-x-scroll"}>
            <CommentSection
              post={{
                id: post.id,
              }}
              comments={topLevelComments}
              totalTopLevelComments={totalTopLevelComments}
            />
          </div>
        </div>
        <div
          className={"flex h-fit w-[22.5rem] flex-col gap-y-4 max-xl:w-full"}
        >
          <div className={"rounded-md border border-solid border-gray-500"}>
            <div className={"flex items-center gap-x-4 px-4 pt-4"}>
              <Image
                className={
                  "aspect-square rounded-full border-2 border-solid border-black"
                }
                src={post.subreaddit.image}
                alt={"subreaddit image"}
                width={65}
                height={65}
              />
              <SubreadditButton
                subreaddit={{
                  name: post.subreaddit.name,
                }}
              >
                <div className={"flex flex-col gap-y-1"}>
                  <h1 className={"text-3xl font-semibold"}>
                    {post.subreaddit.name}
                  </h1>
                  <h2 className={"text-start text-xl"}>
                    r/{post.subreaddit.name}
                  </h2>
                </div>
              </SubreadditButton>
            </div>
            <div className={"flex flex-col gap-y-3 p-4"}>
              <p className={"border-b border-solid border-gray-400 pb-2"}>
                {post.subreaddit.description}
              </p>
              <div
                className={
                  "flex items-center gap-x-2 border-b border-solid border-gray-400 pb-2"
                }
              >
                <FaUser />
                <p>{subscribers} members</p>
              </div>
              <div
                className={
                  "flex items-center gap-x-2 border-b border-solid border-gray-400 pb-2"
                }
              >
                <FaBirthdayCake />
                <p>
                  Created {format(post.subreaddit.createdAt, "MMMM d, yyyy")}
                </p>
              </div>
              {post.subreaddit.creatorId !== session?.user.id ? (
                <SubscriptionButton
                  subreaddit={{
                    id: post.subreaddit.id,
                  }}
                  isSubscribed={isSubscribed}
                  className={"w-full py-1.5"}
                />
              ) : null}
            </div>
          </div>
          <div className={"rounded-md border border-solid border-gray-500"}>
            <h1
              className={"overflow-hidden bg-slate-950 p-4 text-lg text-white"}
            >
              Rules
            </h1>
            <ul className={"ml-4 list-decimal px-4 pb-4 pt-2"}>
              {post.subreaddit.rules.map((rule, i) => {
                return (
                  <li
                    className={
                      "w-full border-b border-solid border-gray-400 py-2"
                    }
                    key={i}
                  >
                    {rule}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
