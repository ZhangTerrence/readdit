"use client";

import type { Session } from "next-auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IoPencil, IoImage } from "react-icons/io5";

type CreatePostProps = {
  session: Session | null;
};

export const CreatePost = (props: CreatePostProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [titleCharRemaining, setTitleCharRemaining] = useState(300);

  const createPost = async () => {
    if (!props.session) {
      router.push("/signin");
    }
  };

  return (
    <div className={"mr-12"}>
      <div
        className={
          "flex items-center border-b-[2px] border-solid border-slate-50 text-xl"
        }
      >
        <IoPencil className={"-mt-3 mr-2"} />
        <h1 className={"pb-4 font-bold"}>Create a post</h1>
      </div>
      <div className={"mt-4 w-1/2 text-lg"}>
        <input
          className={"w-full rounded-md p-2"}
          defaultValue={
            searchParams.get("subreaddit")
              ? searchParams.get("subreaddit")!
              : undefined
          }
          type="text"
        />
        <button></button>
      </div>
      <div className={"mt-4 flex w-[35rem] flex-col bg-slate-50 p-4"}>
        <div
          className={
            "relative mb-4 rounded-sm border border-solid border-slate-300"
          }
        >
          <input
            className={"w-full bg-transparent p-2 text-sm"}
            type="text"
            maxLength={300}
            placeholder={"Title"}
            onChange={(e) =>
              setTitleCharRemaining(300 - e.currentTarget.value.length)
            }
          />
          <p
            className={
              "absolute bottom-0 right-0 top-0 my-auto mr-2 h-fit select-none text-xs font-semibold"
            }
          >
            {titleCharRemaining}/300
          </p>
        </div>
        <div
          className={
            "mb-4 h-[15rem] rounded-sm border border-solid border-slate-300"
          }
        ></div>
        <div className={"flex items-center justify-between"}>
          <IoImage onClick={async () => {}} />
          <button
            className={
              "rounded-full bg-gray-700 px-6 py-[0.65rem] text-sm leading-normal text-white"
            }
            onClick={(e) => {
              e.preventDefault();
              createPost();
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};
