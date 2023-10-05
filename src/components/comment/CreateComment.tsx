"use client";

import type { CreateCommentPayload } from "@/lib/validators/comment";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type CreateCommentProps = {
  post: {
    id: string;
  };
  replyId?: string;
  hide?: () => void;
};

export const CreateComment = (props: CreateCommentProps) => {
  const { data: session } = useSession();
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();

  const createComment = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }

    if (!textRef.current?.value) {
      toast.error("Text is required.");
      return;
    }

    const payload: CreateCommentPayload = {
      postId: props.post.id,
      text: textRef.current.value,
      replyingToId: props.replyId,
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
        if (textRef.current?.value) textRef.current.value = "";
        if (props.hide) props.hide();
        setTimeout(() => {
          router.refresh();
        }, 100);
      }
    });
  };

  return (
    <div className={`flex w-full flex-col gap-y-4`}>
      {session ? (
        <h4 className={"text-sm"}>Replying as u/{session.user.username}</h4>
      ) : null}
      <textarea
        id={"editor"}
        className={
          "max-h-60 min-h-[5rem] rounded-md border border-solid border-black p-2 outline-none"
        }
        ref={textRef}
        maxLength={2000}
        placeholder={"Write your comment here..."}
      />
      <div className={"flex gap-x-2 self-end"}>
        {props.hide ? (
          <div
            className={
              "inline-flex cursor-pointer items-center justify-center rounded-xl border border-solid border-black px-4 py-2 text-sm shadow-md active:shadow-none"
            }
            onClick={() => props.hide!()}
          >
            <button>Cancel</button>
          </div>
        ) : null}
        <div
          className={
            "group relative inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow-md active:shadow-none"
          }
          onClick={() => createComment()}
        >
          <span
            className={
              "absolute h-0 max-h-full w-0 rounded-full bg-white opacity-10 transition-all duration-75 ease-out group-hover:h-32 group-hover:w-full"
            }
          ></span>
          <button className={"relative"}>Comment</button>
        </div>
      </div>
    </div>
  );
};
