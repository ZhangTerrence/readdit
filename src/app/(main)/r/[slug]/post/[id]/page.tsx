import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ContentRenderer } from "@/components/renderers/ContentRenderer";
import { SubscriptionButton } from "@/components/subscription/SubscriptionButton";
import { formatTimeToNow } from "@/lib/formatter";
import { getAuthSession } from "@/lib/auth";
import { VoteTypes } from "@prisma/client";
import prisma from "@/lib/prisma";
import { FaBirthdayCake, FaUser } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import { CommentSection } from "@/components/comment/CommentSection";
import { CreateComment } from "@/components/comment/CreateComment";
import { PostVoteClient } from "@/components/vote/PostVoteClient";
import { GoToSubreaddit } from "@/components/subreaddit/GoToSubreaddit";

export default async function PostPage({
  params,
}: {
  params: {
    id: string;
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
              },
            },
          },
        },
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

  const votes = post.postVotes.reduce((n, vote) => {
    if (vote.type === VoteTypes.UP) return n + 1;
    if (vote.type === VoteTypes.DOWN) return n - 1;
    return n;
  }, 0);

  const currentVote = post.postVotes.find(
    (vote: { userId: string }) => vote.userId === session?.user.id,
  );

  const subscribers = await prisma.subscription.count({
    where: {
      subreadditId: post.subreaddit.id,
    },
  });

  return (
    <div className={"flex h-fit min-h-screen justify-center bg-gray-900"}>
      <div className={"flex max-w-[85rem] bg-slate-200 p-8"}>
        <div
          className={
            "mr-4 flex w-[50rem] flex-col overflow-x-scroll rounded-md border border-solid border-slate-500 bg-slate-50 p-4"
          }
        >
          <div className={"mb-6 flex"}>
            <div className={"mr-3 w-12 text-xl"}>
              <PostVoteClient
                session={session}
                postId={post.id}
                initialVotes={votes}
                initialVote={currentVote?.type}
              />
            </div>
            <div className={"grow"}>
              <div className={"mb-2 flex text-sm"}>
                <GoToSubreaddit
                  style={"hover:underline"}
                  subreadditName={post.subreaddit.name}
                >
                  <span>r/{post.subreaddit.name}</span>
                  <BsDot className={"inline-block"} />
                </GoToSubreaddit>
                <p className={"mr-2"}>
                  Posted by{" "}
                  <Link
                    className={"hover:underline"}
                    href={`/u/${post.author.id}`}
                  >
                    u/{post.author.username}
                  </Link>
                </p>
                <p>{formatTimeToNow(post.createdAt)}</p>
              </div>
              <h1 className={"text-4xl"}>{post.title}</h1>
              <ContentRenderer content={post.content} />
            </div>
          </div>
          <hr className={"border-t border-slate-950 pb-4"} />
          <CreateComment session={session} postId={post.id} />
          <CommentSection
            session={session}
            postId={post.id}
            comments={post.comments.filter((comment) => !comment.replyingToId)}
            indent={0}
          />
        </div>
        <div className={"flex flex-col"}>
          <div
            className={
              "mb-4 h-fit w-[22.5rem] rounded-md border border-solid border-slate-500 bg-slate-50"
            }
          >
            <div className={"flex items-center px-4 pt-4"}>
              <Image
                className={
                  "mr-4 rounded-full border-[2px] border-solid border-slate-950"
                }
                src={post.subreaddit.image}
                alt={"subreaddit image"}
                width={65}
                height={65}
              />
              <GoToSubreaddit
                style={"text-xl font-semibold"}
                subreadditName={post.subreaddit.name}
              >
                r/{post.subreaddit.name}
              </GoToSubreaddit>
            </div>
            <div className={"p-4"}>
              <p>{post.subreaddit.description}</p>
              <div
                className={
                  "mt-3 flex items-center border-b border-t border-solid border-slate-300 py-2"
                }
              >
                <FaUser className={"mr-2"} />
                <p className={"text-gray-500"}>{subscribers} members</p>
              </div>
              <div
                className={
                  "mt-3 flex items-center border-b border-solid border-slate-300 pb-2"
                }
              >
                <FaBirthdayCake className={"mr-2"} />
                <p className={"text-gray-500"}>
                  Created {format(post.subreaddit.createdAt, "MMMM d, yyyy")}
                </p>
              </div>
              {post.subreaddit.creatorId !== session?.user.id ? (
                <SubscriptionButton
                  session={session}
                  subreadditId={post.subreaddit.id}
                  isSubscribed={isSubscribed}
                  classNames={"w-full mt-4 py-[0.5rem]"}
                />
              ) : null}
            </div>
          </div>
          <div
            className={
              "h-fit w-[22.5rem] rounded-md border border-solid border-slate-500 bg-slate-50"
            }
          >
            <h1 className={"bg-slate-950 p-4 text-lg text-slate-50"}>Rules</h1>
            <ul className={"ml-4 list-decimal p-4"}>
              {post.subreaddit.rules.map((rule, i) => {
                return (
                  <li
                    className={
                      "w-full border-b border-solid border-slate-300 py-2"
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
