"use client";

import Image from "next/image";
import type { Session } from "next-auth";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { IoCaretDown, IoSettings, IoExit } from "react-icons/io5";

type ProfileDropdownTypes = {
  session: Session;
};

export const ProfileDropdown = (props: ProfileDropdownTypes) => {
  const [dropdown, toggleDropdown] = useState(false);

  return (
    <div className={"relative flex items-center rounded-md"}>
      <div
        className={
          "flex cursor-pointer items-center rounded-md border border-solid border-slate-200 p-3"
        }
        onClick={() => toggleDropdown(!dropdown)}
      >
        <div className={"mr-12 flex items-center"}>
          <Image
            className={"mr-4 rounded-full border border-solid border-slate-950"}
            src={props.session.user.image!}
            alt={"user image"}
            width={35}
            height={35}
          />
          <p className={"text-xl"}>{props.session.user.name}</p>
        </div>
        <IoCaretDown
          className={`${
            dropdown ? "rotate-180" : "rotate-0"
          } transition-[transform] duration-200 ease-in`}
        />
      </div>
      <ul
        className={`${
          dropdown ? "block" : "hidden"
        } absolute top-full w-full rounded-md border border-solid border-slate-200 bg-white`}
      >
        <li
          className={"flex w-full cursor-pointer items-center p-2"}
          onClick={() => {}}
        >
          <IoSettings className={"ml-2 text-xl"} />
          <button className={"ml-4 text-lg"}>User Settings</button>
        </li>
        <li
          className={"flex w-full cursor-pointer items-center p-2"}
          onClick={() => signOut()}
        >
          <IoExit className={"ml-2 text-xl"} />
          <button className={"ml-4 text-lg"}>Log Out</button>
        </li>
      </ul>
    </div>
  );
};