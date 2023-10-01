import type { Session } from "next-auth";
import type { Comment } from "@prisma/client";
import { VoteTypes } from "@prisma/client";
import { PostComment } from "./PostComment";
import { MoreComments } from "./MoreComments";

type CommentSectionProps = {
  session: Session | null;
  postId: string;
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
};

export const CommentSection = async (props: CommentSectionProps) => {
  return (
    <div
      className={
        "flex flex-col gap-y-4 border-l border-solid border-gray-400 pl-6"
      }
    >
      {props.comments.map((comment) => {
        const votes = comment.commentVotes.reduce((n, vote) => {
          if (vote.type === VoteTypes.UP) return n + 1;
          if (vote.type === VoteTypes.DOWN) return n - 1;
          return n;
        }, 0);

        const currentVote = comment.commentVotes.find(
          (vote: { userId: string }) => vote.userId === props.session?.user.id,
        );

        return (
          <div key={comment.id} className={"flex flex-col"}>
            <div className={"mb-2"}>
              <PostComment
                session={props.session}
                comment={comment}
                initialVotes={votes}
                initialVote={currentVote?.type}
              />
            </div>
            {comment.replies ? (
              <CommentSection
                session={props.session}
                postId={props.postId}
                comments={comment.replies}
              />
            ) : null}
            {!comment.replies ? (
              <MoreComments
                session={props.session}
                postId={props.postId}
                id={comment.id}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
