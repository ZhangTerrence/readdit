"use client";

import type { User } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { DeleteUser } from "./DeleteUser";
import { useRouter } from "next/navigation";
import { UpdateUserPayload } from "@/lib/validators/user";
import { uploadFiles } from "@/lib/uploadthing";
import { FaFileCirclePlus } from "react-icons/fa6";
import { toast } from "react-toastify";

type EditUserTypes = {
  user: User;
};

export const EditUser = (props: EditUserTypes) => {
  const { data: session } = useSession();
  const [profilePicture, setProfilePicture] = useState(props.user.image);
  const usernameRef = useRef<HTMLInputElement>(null);
  const [usernameCharRemaining, setUsernameCharRemaining] = useState(30);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const [bioCharRemaining, setBioCharRemaining] = useState(300);
  const router = useRouter();

  useEffect(() => {
    if (usernameRef.current)
      usernameRef.current.value = props.user.username ?? "";
    if (bioRef.current) bioRef.current.value = props.user.bio;
    setUsernameCharRemaining(
      30 - (props.user.username ? props.user.username.length : 0),
    );
    setBioCharRemaining(300 - props.user.bio.length);
  }, [props.user]);

  const checkUsername = (input: string) => {
    if (!input.match(/^[a-zA-Z0-9_]*$/) || input.length < 3) {
      setUsernameError(
        "Usernames must be between 3-30 characters, and can only contain letters, numbers, or underscores.",
      );
    } else setUsernameError(null);
  };

  const editUser = async () => {
    if (!usernameRef.current?.value || usernameRef.current.value.length === 0) {
      toast.error("Username is required.");
      return;
    }

    if (!session || session.user.id !== props.user.id) {
      toast.error("Unauthorized.");
      return;
    }

    const payload: UpdateUserPayload = {
      id: session.user.id,
      username: usernameRef.current.value,
      bio: bioRef.current ? bioRef.current.value : "",
      image: profilePicture,
    };

    await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      if (response.status < 200 || response.status >= 300) {
        const error = await response.text();
        if (error === "Username already taken.") {
          setUsernameError(error);
        }
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
    <div className={"max-md:w-full max-md:p-8"}>
      <h1
        className={
          "mb-12 border-b border-solid border-black pb-2 text-4xl max-md:w-full max-md:text-2xl"
        }
      >
        Profile Settings
      </h1>
      <div className={"flex flex-col gap-y-12 max-md:w-full"}>
        <div
          className={"flex max-md:flex-col max-md:items-center max-md:gap-y-8"}
        >
          <div
            className={"mr-20 flex flex-col items-center gap-y-4 max-md:mr-0"}
          >
            <h2 className={"text-2xl max-md:text-lg"}>Profile Picture</h2>
            <div
              className={
                "group relative aspect-square w-40 cursor-pointer overflow-hidden rounded-full border border-solid border-black transition-all duration-300"
              }
            >
              <Image
                src={profilePicture}
                alt={"profile picture"}
                fill={true}
                style={{ objectFit: "contain" }}
              />
              <div
                className={
                  "absolute hidden h-full w-full flex-col items-center justify-center gap-y-2 object-cover text-white transition-all duration-300 group-hover:flex group-hover:backdrop-blur-lg"
                }
              >
                <FaFileCirclePlus className={"text-3xl"} />
                <div>Upload file</div>
              </div>
              <input
                className={"absolute h-full w-full opacity-0"}
                type="file"
                onChange={async (e) => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files);

                    const [res] = await uploadFiles({
                      files,
                      endpoint: "imageUploader",
                    });

                    if (res) {
                      setProfilePicture(res.url);
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className={"flex w-[30rem] flex-col gap-y-8 max-sm:w-full"}>
            <div className={"flex flex-col gap-y-2"}>
              <div className={"relative flex flex-col gap-y-2"}>
                <h2 className={"text-2xl max-md:text-lg"}>Username</h2>
                <input
                  className={
                    "min-w-0 rounded-md border border-solid border-gray-500 p-2 outline-none max-sm:text-sm"
                  }
                  ref={usernameRef}
                  type="text"
                  defaultValue={props.user.username ?? ""}
                  maxLength={30}
                  onChange={(e) => {
                    setUsernameCharRemaining(30 - e.currentTarget.value.length);
                    checkUsername(e.currentTarget.value);
                  }}
                />

                <p
                  className={`${
                    usernameCharRemaining === 0 ? "text-red-600" : ""
                  } absolute bottom-0 right-0 m-3 h-fit select-none text-xs font-semibold`}
                >
                  {usernameCharRemaining}/30
                </p>
              </div>
              {usernameError ? (
                <p className={"mt-2 text-sm text-red-600 max-sm:text-sm"}>
                  {usernameError}
                </p>
              ) : null}
            </div>
            <div className={"relative flex flex-col gap-y-2"}>
              <h2 className={"text-2xl max-md:text-lg"}>Bio</h2>
              <textarea
                className={
                  "max-h-60 min-h-[5rem] min-w-0 rounded-md border border-solid border-gray-500 p-2 outline-none max-sm:text-sm"
                }
                ref={bioRef}
                defaultValue={props.user.bio}
                maxLength={300}
                onChange={(e) =>
                  setBioCharRemaining(300 - e.currentTarget.value.length)
                }
              />
              <p
                className={`${
                  bioCharRemaining === 0 ? "text-red-600" : ""
                } absolute bottom-0 right-0 m-4 h-fit select-none text-xs font-semibold`}
              >
                {bioCharRemaining}/300
              </p>
            </div>
          </div>
        </div>
        <div className={"flex w-full justify-between max-md:justify-evenly"}>
          <DeleteUser user={{ id: props.user.id }} />
          <div
            className={
              "group relative inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-6 py-2 text-xl text-white shadow-md active:shadow-none"
            }
            onClick={(e) => {
              e.preventDefault();
              editUser();
            }}
          >
            <span
              className={
                "absolute h-0 max-h-full w-0 rounded-full bg-white opacity-10 transition-all duration-75 ease-out group-hover:h-32 group-hover:w-full"
              }
            ></span>
            <button className={"relative"}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};
