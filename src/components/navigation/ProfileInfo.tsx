"use client";

import type { Session } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { IoCaretDown, IoExit, IoSettings } from "react-icons/io5";

export const ProfileInfo = (props: { session: Session }) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className={"flex-ai-center relative rounded-md"}>
      <div
        className={`flex-ai-center cursor-pointer gap-x-4 rounded-md border border-solid border-gray-400 p-2 transition-colors`}
        onClick={() => setDropdown(!dropdown)}
      >
        <div className={"flex-ai-center gap-x-2 text-lg"}>
          <Image
            className={"rounded-full border border-solid border-black"}
            src={props.session.user.image!}
            alt={"user image"}
            width={30}
            height={30}
          />
          <p className={"select-none"}>{props.session.user.username}</p>
        </div>
        <IoCaretDown
          className={`${
            dropdown ? "rotate-180" : "rotate-0"
          } transition-[transform] duration-100 ease-in`}
        />
      </div>
      <ul
        className={`${
          dropdown ? "block" : "hidden"
        } absolute top-full w-full overflow-hidden rounded-md border border-solid border-gray-400 bg-white`}
      >
        <li
          className={
            "flex-ai-center cursor-pointer gap-x-4 p-3 text-lg transition-colors hover:bg-gray-100"
          }
          onClick={() => {}}
        >
          <IoSettings />
          <button>User Settings</button>
        </li>
        <li
          className={
            "flex-ai-center cursor-pointer gap-x-4 p-3 text-lg transition-colors hover:bg-gray-100"
          }
          onClick={() => signOut()}
        >
          <IoExit />
          <button>Log Out</button>
        </li>
      </ul>
    </div>
  );
};
