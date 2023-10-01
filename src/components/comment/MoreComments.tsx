import type { Session } from "next-auth";
import { ViewMoreComments } from "./ViewMoreComments";
import { CommentSection } from "./CommentSection";
import prisma from "@/lib/prisma";

type MoreCommentsProps = {
  session: Session | null;
  postId: string;
  id: string;
};

export const MoreComments = async (props: MoreCommentsProps) => {
  const comments = await prisma.comment.findFirst({
    where: {
      id: props.id,
    },
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
  });

  if (!(comments && comments.replies.length > 0)) {
    return null;
  }

  return (
    <ViewMoreComments>
      <CommentSection
        session={props.session}
        postId={props.postId}
        comments={comments.replies}
      />
    </ViewMoreComments>
  );
};
