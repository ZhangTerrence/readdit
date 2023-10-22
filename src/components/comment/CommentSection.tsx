import type { Comment } from "@prisma/client";
import { VoteTypes } from "@prisma/client";
import { UserComment } from "./UserComment";
import { FetchMoreComments } from "./FetchMoreComments";
import { getAuthSession } from "@/lib/auth";
import { MoreComments } from "./MoreComments";

type CommentSectionProps = {
  post: {
    id: string;
  };
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
    replies?: (Comment & {
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
  })[];
  totalTopLevelComments: number;
};

export const CommentSection = async (props: CommentSectionProps) => {
  const session = await getAuthSession();

  const moreComments =
    props.comments.length > 0 &&
    !props.comments[0].replyingToId &&
    props.comments.length !== props.totalTopLevelComments;

  return (
    <>
      <div
        className={
          "mt-4 flex flex-col gap-y-1 border-l border-solid border-gray-400 pl-6"
        }
      >
        {props.comments.map((comment) => {
          const commentVotes = comment.commentVotes.reduce((n, vote) => {
            if (vote.type === VoteTypes.UP) return n + 1;
            if (vote.type === VoteTypes.DOWN) return n - 1;
            return n;
          }, 0);

          const userVote = comment.commentVotes.find(
            (vote: { userId: string }) => vote.userId === session?.user.id,
          );

          return (
            <div key={comment.id} className={"flex flex-col"}>
              <div className={"mb-2"}>
                <UserComment
                  key={comment.id}
                  comment={comment}
                  commentVotes={commentVotes}
                  userVote={userVote?.type}
                />
              </div>
              {comment.replies ? (
                <CommentSection
                  key={comment.id}
                  post={{
                    id: props.post.id,
                  }}
                  comments={comment.replies}
                  totalTopLevelComments={props.totalTopLevelComments}
                />
              ) : (
                <FetchMoreComments
                  key={comment.id}
                  comment={{
                    id: comment.id,
                  }}
                  post={{
                    id: props.post.id,
                  }}
                  totalTopLevelComments={props.totalTopLevelComments}
                />
              )}
            </div>
          );
        })}
      </div>
      {moreComments ? (
        <MoreComments commentAmount={props.comments.length} />
      ) : null}
    </>
  );
};
