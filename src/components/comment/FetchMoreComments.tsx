import { ViewMoreButton } from "./ViewMoreButton";
import { CommentSection } from "./CommentSection";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

type MoreCommentsProps = {
  comment: {
    id: string;
  };
  post: {
    id: string;
  };
};

export const FetchMoreComments = async (props: MoreCommentsProps) => {
  const session = await getAuthSession();

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

  if (!(comments && comments.replies.length > 0)) {
    return null;
  }

  return (
    <ViewMoreButton>
      <CommentSection
        post={{
          id: props.post.id,
        }}
        comments={comments.replies}
      />
    </ViewMoreButton>
  );
};
