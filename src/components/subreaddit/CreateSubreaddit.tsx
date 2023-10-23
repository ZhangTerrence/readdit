"use client";

import type { CreateSubreadditPayload } from "@/lib/validators/subreaddit";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IoClose, IoInformationCircle } from "react-icons/io5";
import { toast } from "react-toastify";

export const CreateSubreaddit = () => {
  const { data: session } = useSession();
  const modalRef = useRef<HTMLDialogElement>(null);
  const subreadditNameRef = useRef<HTMLInputElement>(null);
  const subreadditDescRef = useRef<HTMLTextAreaElement>(null);
  const [nameCharRemaining, setNameCharRemaining] = useState(21);
  const [nameError, setNameError] = useState<string | null>(null);
  const [descCharRemaining, setDescCharRemaining] = useState(277);
  const router = useRouter();

  const checkName = (input: string) => {
    if (!input.match(/^[a-zA-Z0-9_]*$/) || input.length < 3) {
      setNameError(
        "Community names must be between 3-21 characters, and can only contain letters, numbers, or underscores.",
      );
    } else setNameError(null);
  };

  const closeModal = () => {
    if (subreadditNameRef.current) {
      subreadditNameRef.current.value = "";
    }
    if (subreadditDescRef.current) {
      subreadditDescRef.current.value = "An awesome description.";
    }
    setNameCharRemaining(21);
    setNameError(null);
    modalRef.current?.close();
  };

  const createSubreaddit = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }

    if (!subreadditNameRef.current?.value) {
      toast.error("Name is required.");
      return;
    }

    if (!subreadditDescRef.current?.value) {
      toast.error("Description is required.");
      return;
    }

    if (nameError) {
      toast.error(nameError);
      return;
    }

    const payload: CreateSubreadditPayload = {
      name: subreadditNameRef.current.value,
      description: subreadditDescRef.current.value,
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
      <div
        className={
          "inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-solid border-black px-3.5 py-2 text-xl shadow-md active:shadow-none"
        }
        onClick={() => modalRef.current?.showModal()}
      >
        <button className={"max-xs:text-sm relative"}>Create Community</button>
      </div>
      <dialog
        className={"fixed inset-0 m-auto backdrop:opacity-50"}
        ref={modalRef}
        open={false}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <form
          className={
            "flex w-[40rem] flex-col overflow-hidden rounded-md border border-solid border-black p-8 max-md:w-full"
          }
        >
          <div
            className={
              "flex items-center justify-between border-b border-solid border-b-black pb-3"
            }
          >
            <h1 className={"text-3xl max-md:text-xl"}>Create a community</h1>
            <div
              className={"rounded-full p-2 transition-colors hover:bg-gray-50"}
            >
              <IoClose
                className={"cursor-pointer text-3xl max-md:text-xl"}
                onClick={() => closeModal()}
              />
            </div>
          </div>
          <h2 className={"mt-4 text-xl max-md:text-lg"}>Name</h2>
          <div className={"mt-1 flex items-center gap-x-2 text-sm"}>
            <p className={"max-md:text-xs"}>
              Community names including capitalization cannot be changed.
            </p>
            <div className={"relative"}>
              <IoInformationCircle className={"peer"} />
              <span
                className={
                  "invisible absolute -left-[7.25rem] top-full z-10 mt-2 w-60 break-words rounded-md bg-black p-2 text-center text-sm text-slate-50 peer-hover:visible"
                }
              >
                {`Names cannot have spaces (e.g., "r/bookclub" not "r/book club"),
                  must be between 3-21 characters, and underscores ("_") are the
                  only special characters allowed. Avoid using solely trademarked
                  names (e.g., "r/FansOfAcme" not "r/Acme").`}
              </span>
            </div>
          </div>
          <div className={"relative mt-4 max-md:text-sm"}>
            <span
              className={
                "absolute bottom-0 left-0 top-0 my-auto ml-3 h-fit w-fit text-gray-600"
              }
            >
              r/
            </span>
            <input
              className={
                "w-full rounded-md border border-solid border-gray-400 px-7 py-2 outline-none max-md:text-sm"
              }
              ref={subreadditNameRef}
              type="text"
              maxLength={21}
              onChange={(e) => {
                setNameCharRemaining(21 - e.currentTarget.value.length);
                checkName(e.currentTarget.value);
              }}
            />
            <p
              className={`${
                nameCharRemaining === 0 ? "text-red-600" : ""
              } absolute bottom-0 right-0 top-0 my-auto mr-3 h-fit select-none text-xs font-semibold`}
            >
              {nameCharRemaining}/21
            </p>
          </div>
          {nameError ? (
            <p className={"mt-2 text-sm text-red-600 max-md:text-xs"}>
              {nameError}
            </p>
          ) : null}
          <h2 className={"mt-4 flex items-center text-xl max-md:text-lg"}>
            Description
          </h2>
          <div className={"relative mt-4"}>
            <textarea
              className={
                "max-h-44 min-h-[5rem] w-full rounded-md border border-solid border-gray-400 p-3 outline-none max-md:text-sm"
              }
              ref={subreadditDescRef}
              defaultValue={"An awesome description."}
              placeholder={"Enter description here..."}
              maxLength={300}
              onChange={(e) =>
                setDescCharRemaining(300 - e.currentTarget.value.length)
              }
            />
            <p
              className={`${
                descCharRemaining === 0 ? "text-red-600" : ""
              } absolute bottom-0 right-0 m-4 h-fit select-none text-xs font-semibold`}
            >
              {descCharRemaining}/300
            </p>
          </div>
          <div className={"max-xs:flex-col mt-4 flex justify-end gap-4"}>
            <div
              className={
                "inline-flex cursor-pointer items-center justify-center rounded-xl border border-solid border-black px-6 py-2 text-xl shadow-md active:shadow-none"
              }
              onClick={(e) => {
                e.preventDefault();
                closeModal();
              }}
            >
              <button className={"max-md:text-sm"}>Cancel</button>
            </div>
            <div
              className={
                "group relative inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-6 py-2 text-xl text-white shadow-md active:shadow-none"
              }
              onClick={(e) => {
                e.preventDefault();
                createSubreaddit();
              }}
            >
              <span
                className={
                  "absolute h-0 max-h-full w-0 rounded-full bg-white opacity-10 transition-all duration-75 ease-out group-hover:h-32 group-hover:w-full"
                }
              ></span>
              <button className={"relative max-md:text-sm"}>
                Create Community
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
};
