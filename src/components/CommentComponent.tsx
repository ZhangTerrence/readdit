import type { Comment, CommentVote } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { formatTimeToNow } from "@/lib/formatter";
import { BsDot } from "react-icons/bs";

type CommentComponentProps = {
  comment: Comment & {
    author: {
      id: string;
      username: string;
      image: string;
    };
    commentVotes: CommentVote[];
  };
};

export const CommentComponent = (props: CommentComponentProps) => {
  return (
    <div className={"mb-4"}>
      <div className={"mb-2 flex items-center"}>
        <Image
          className={"mr-2 rounded-full"}
          src={props.comment.author.image}
          alt={"user image"}
          width={30}
          height={30}
        />
        <Link
          className={"hover:underline"}
          href={`/u/${props.comment.author.id}`}
        >
          u/{props.comment.author.username}
        </Link>
        <BsDot />
        <p>{formatTimeToNow(props.comment.createdAt)}</p>
      </div>
      <p>{props.comment.text}</p>
    </div>
  );
};
