"use client";

import type { Session } from "next-auth";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { CreateCommentPayload } from "@/lib/validators/comment";
import { toast } from "react-toastify";

type CreateCommentProps = {
  session: Session | null;
  postId: string;
  replyingToId?: string;
};

export const CreateComment = (props: CreateCommentProps) => {
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();

  const createComment = async () => {
    if (!props.session) {
      router.push("/signin");
    }

    if (!textRef.current?.value) {
      toast.error("Text is required.");
      return;
    }

    const payload: CreateCommentPayload = {
      postId: props.postId,
      text: textRef.current.value,
      replyingToId: props.replyingToId,
    };

    console.log(payload);

    await fetch("/api/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      if (response.status < 200 || response.status >= 300) {
        const error = await response.text();
        toast.error(error);
      } else {
        const success = await response.text();
        toast.success(success);
      }
    });
  };

  return (
    <div className={"flex flex-col"}>
      {props.session ? (
        <h4 className={"mb-2 text-sm text-gray-500"}>
          Replying as u/{props.session.user.username}
        </h4>
      ) : null}
      <textarea
        id={"editor"}
        className={
          "h-40 resize-none rounded-md border border-solid border-slate-950 p-2"
        }
        ref={textRef}
        placeholder={"Write your comment here..."}
      />
      <button
        className={
          "mt-2 w-fit self-end rounded-full bg-gray-700 px-4 py-2 text-sm text-white"
        }
        onClick={(e) => {
          e.preventDefault();
          createComment();
        }}
      >
        Comment
      </button>
    </div>
  );
};
