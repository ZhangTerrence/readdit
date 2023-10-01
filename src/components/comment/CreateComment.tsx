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
    <div className={`flex w-full flex-col gap-y-4`}>
      {props.session ? (
        <h4 className={"text-sm"}>
          Replying as u/{props.session.user.username}
        </h4>
      ) : null}
      <textarea
        id={"editor"}
        className={
          "h-20 max-h-60 rounded-md border border-solid border-black p-2 outline-none"
        }
        ref={textRef}
        placeholder={"Write your comment here..."}
      />
      <div className={"flex gap-x-2 self-end"}>
        {props.closeReplying ? (
          <div
            className={
              "inline-flex cursor-pointer items-center justify-center rounded-xl border border-solid border-black px-4 py-2 text-sm shadow-md active:shadow-none"
            }
            onClick={(e) => {
              e.preventDefault();
              props.closeReplying!();
            }}
          >
            <button className={"relative"}>Cancel</button>
          </div>
        ) : null}
        <div
          className={
            "group relative inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow-md active:shadow-none"
          }
          onClick={(e) => {
            e.preventDefault();
            createComment();
          }}
        >
          <span
            className={
              "absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-75 ease-out group-hover:h-32 group-hover:w-full"
            }
          ></span>
          <button className={"relative"}>Comment</button>
        </div>
      </div>
    </div>
  );
};
