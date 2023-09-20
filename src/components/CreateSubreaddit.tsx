"use client";

import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { IoClose, IoInformationCircle } from "react-icons/io5";
import { toast } from "react-toastify";

import { CreateSubreadditPayload } from "@/lib/validators/subreaddit";

type CreateSubreadditProps = {
  session: Session | null;
};

export const CreateSubreaddit = (props: CreateSubreadditProps) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const subreadditNameRef = useRef<HTMLInputElement | null>(null);
  const subreadditDescRef = useRef<HTMLInputElement | null>(null);
  const [charRemaining, setCharRemaining] = useState(21);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const closeModal = () => {
    if (subreadditNameRef.current) subreadditNameRef.current.value = "";
    setCharRemaining(21);
    setError(null);
    modalRef.current?.close();
  };

  const checkName = (input: string) => {
    setCharRemaining(21 - input.length);

    if (!input.match(/^[a-zA-Z0-9_]*$/) || input.length < 3) {
      setError(
        "Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores.",
      );
    } else setError(null);
  };

  const createSubreaddit = async () => {
    if (!props.session) {
      router.push("/signin");
      return;
    }

    if (!subreadditNameRef.current?.value) {
      toast.error("Name is required.");
      return;
    }

    if (error) {
      toast.error(error);
      return;
    }

    const payload: CreateSubreadditPayload = {
      name: subreadditNameRef.current.value,
      description: !subreadditDescRef.current
        ? "A wonderful description"
        : subreadditDescRef.current.value.length === 0
        ? "A wonderful description"
        : subreadditDescRef.current.value,
    };

    await fetch("/api/subreaddit", {
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
        closeModal();
      }
    });
  };

  return (
    <>
      <button
        className={
          "mt-4 w-full rounded-full border border-solid border-slate-500 p-1 text-xl"
        }
        onClick={() => modalRef.current?.showModal()}
      >
        Create Community
      </button>
      <dialog
        className={
          "absolute inset-0 m-auto backdrop:bg-slate-900 backdrop:opacity-30"
        }
        ref={modalRef}
        open={false}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <form
          className={
            "flex w-[40rem] flex-col border border-solid border-slate-950 p-4"
          }
        >
          <div
            className={
              "flex items-center justify-between border-b border-solid border-b-slate-950 pb-4"
            }
          >
            <h1 className={"text-xl"}>Create a community</h1>
            <IoClose
              className={"cursor-pointer text-2xl"}
              onClick={() => closeModal()}
            />
          </div>
          <h2 className={"mt-4 text-xl"}>Name</h2>
          <div className={"mt-1 flex items-center text-sm"}>
            <p className={"mr-2"}>
              Community names including capitalization cannot be changed.
            </p>
            <div className={"relative mt-[1px]"}>
              <IoInformationCircle className={"peer"} />
              <span
                className={
                  "invisible absolute -left-[7.25rem] top-full z-10 mt-2 w-[15rem] break-words rounded-md bg-gray-950 p-2 text-center text-sm text-slate-50 peer-hover:visible"
                }
              >
                {`Names cannot have spaces (e.g., "r/bookclub" not "r/book club"),
                  must be between 3-21 characters, and underscores ("_") are the
                  only special characters allowed. Avoid using solely trademarked
                  names (e.g., "r/FansOfAcme" not "r/Acme").`}
              </span>
            </div>
          </div>
          <div className={"relative mt-4"}>
            <span
              className={
                "absolute bottom-0 left-0 top-0 my-auto ml-3 h-fit w-fit text-gray-500"
              }
            >
              r/
            </span>
            <input
              className={
                "w-full border border-solid border-slate-200 px-7 py-2"
              }
              ref={subreadditNameRef}
              type="text"
              maxLength={21}
              onChange={(e) => checkName(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  e.preventDefault();
                  createSubreaddit();
                }
              }}
            />
          </div>
          <p
            className={`${
              charRemaining === 0 ? "text-red-600" : ""
            } mt-4 text-sm`}
          >
            {charRemaining} Characters remaining
          </p>
          {error ? (
            <p className={"mt-2 text-sm text-red-600"}>{error}</p>
          ) : null}
          <h2 className={"mt-4 flex items-center text-xl"}>
            Description <p className={"ml-1 text-xs italic"}>(Optional)</p>
          </h2>
          <input
            className={"mt-4 w-full border border-solid border-slate-200 p-2"}
            ref={subreadditDescRef}
            type="text"
            placeholder={"A wonderful description."}
          />
          <div className={"mt-8 flex justify-end"}>
            <button
              className={
                "mr-4 rounded-md border border-solid border-slate-950 bg-slate-200 p-3 text-lg"
              }
              onClick={(e) => {
                e.preventDefault();
                closeModal();
              }}
            >
              Cancel
            </button>
            <button
              className={"rounded-md bg-gray-950 p-3 text-lg text-slate-50"}
              onClick={(e) => {
                e.preventDefault();
                createSubreaddit();
              }}
            >
              Create Community
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};
