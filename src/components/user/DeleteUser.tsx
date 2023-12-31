"use client";

import { DeleteUserPayload } from "@/lib/validators/user";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-toastify";

type DeleteUserTypes = {
  user: {
    id: string;
  };
};

export const DeleteUser = (props: DeleteUserTypes) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const deleteUser = async () => {
    const payload: DeleteUserPayload = {
      id: props.user.id,
    };

    await fetch("/api/user", {
      method: "DELETE",
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
        setTimeout(() => {
          router.refresh();
          router.push("/");
        }, 500);
      }
    });
  };

  return (
    <>
      <div
        className={
          "inline-flex max-w-full cursor-pointer items-center justify-center rounded-xl border-2 border-solid border-red-600 px-4 py-2 text-lg text-red-600 shadow-md shadow-red-200 active:shadow-none"
        }
        onClick={() => modalRef.current?.showModal()}
      >
        <button>Delete</button>
      </div>
      <dialog
        className={"fixed inset-0 m-auto backdrop:opacity-50"}
        ref={modalRef}
        open={false}
        onClick={(e) => {
          if (e.target === e.currentTarget) modalRef.current?.close();
        }}
      >
        <form
          className={
            "flex flex-col gap-y-10 overflow-hidden rounded-md border border-solid border-black p-8"
          }
        >
          <h1 className={"text-center text-2xl"}>
            Are you sure you want to delete your account?
          </h1>
          <div className={"flex justify-between gap-y-4 max-sm:flex-col"}>
            <div
              className={
                "inline-flex cursor-pointer items-center justify-center rounded-xl border border-solid border-black px-6 py-2 text-xl shadow-md active:shadow-none"
              }
              onClick={(e) => {
                e.preventDefault();
                modalRef.current?.close();
              }}
            >
              <button>Cancel</button>
            </div>
            <div
              className={
                "group relative inline-flex cursor-pointer items-center justify-center rounded-xl bg-red-700 px-6 py-2 text-xl text-white shadow-md active:shadow-none"
              }
              onClick={(e) => {
                e.preventDefault();
                deleteUser();
              }}
            >
              <span
                className={
                  "absolute h-0 max-h-full w-0 rounded-full bg-white opacity-10 transition-all duration-75 ease-out group-hover:h-32 group-hover:w-full"
                }
              ></span>
              <button className={"relative"}>Confirm</button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
};
