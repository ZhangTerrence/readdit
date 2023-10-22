import "server-only";

import { ViewMoreButton } from "./ViewMoreButton";
import { CommentSection } from "./CommentSection";
import prisma from "@/lib/prisma";

type FetchMoreCommentsProps = {
  comment: {
    id: string;
  };
  post: {
    id: string;
  };
  totalTopLevelComments: number;
};

export const FetchMoreComments = async (props: FetchMoreCommentsProps) => {
  const comments = await prisma.comment.findFirst({
    where: {
      id: props.comment.id,
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

  return comments && comments.replies.length > 0 ? (
    <ViewMoreButton>
      <CommentSection
        post={{
          id: props.post.id,
        }}
        comments={comments.replies}
        totalTopLevelComments={props.totalTopLevelComments}
      />
    </ViewMoreButton>
  ) : null;
};
