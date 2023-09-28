"use client";

import type { Session } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { IoCaretDown, IoExit, IoSettings } from "react-icons/io5";

export const ProfileInfo = (props: { session: Session }) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className={"relative flex items-center rounded-md"}>
      <div
        className={
          "flex cursor-pointer items-center rounded-md border border-solid border-slate-300 p-2"
        }
        onClick={() => setDropdown(!dropdown)}
      >
        <div className={"mr-2 flex items-center"}>
          <Image
            className={
              "m-auto block rounded-full border border-solid border-slate-950"
            }
            src={props.session.user.image!}
            alt={"user image"}
            width={30}
            height={30}
          />
          <p className={"ml-2 text-xl"}>{props.session.user.username}</p>
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
        } absolute top-full w-full rounded-md border border-solid border-slate-300 bg-white`}
      >
        <li
          className={"flex w-full cursor-pointer items-center p-2"}
          onClick={() => {}}
        >
          <IoSettings className={"ml-1 mr-[.85rem] block text-xl"} />
          <button className={"mb-[0.15rem] text-lg"}>User Settings</button>
        </li>
        <li
          className={"flex w-full cursor-pointer items-center p-2"}
          onClick={() => signOut()}
        >
          <IoExit className={"ml-1 mr-[.85rem] block text-xl"} />
          <button className={"mb-[0.15rem] text-lg"}>Log Out</button>
        </li>
      </ul>
    </div>
  );
};
