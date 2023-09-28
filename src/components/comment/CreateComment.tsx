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
  closeReplying?: () => void;
};

export const CreateComment = (props: CreateCommentProps) => {
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();

  const createComment = async () => {
    if (!props.session) {
      router.push("/signin");
      return;
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
    <div className={`flex w-full flex-col`}>
      {props.session ? (
        <h4 className={"mb-2 text-sm text-gray-500"}>
          Replying as u/{props.session.user.username}
        </h4>
      ) : null}
      <textarea
        id={"editor"}
        className={
          "resize-none rounded-md border border-solid border-slate-950 p-2"
        }
        ref={textRef}
        placeholder={"Write your comment here..."}
      />
      <div className={"self-end"}>
        {props.closeReplying ? (
          <button
            className={
              "mr-4 mt-2 w-fit self-end rounded-full bg-slate-300 px-4 py-2 text-sm text-slate-950"
            }
            onClick={(e) => {
              e.preventDefault();
              props.closeReplying!();
            }}
          >
            Cancel
          </button>
        ) : null}
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
    </div>
  );
};
