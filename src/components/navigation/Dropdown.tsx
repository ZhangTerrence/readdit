"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { IoCaretDown, IoExit, IoSettings } from "react-icons/io5";

export const Dropdown = () => {
  const { data: session } = useSession();
  const [dropdown, setDropdown] = useState(false);

  if (!session) return null;

  return (
    <div className={"relative flex items-center rounded-md"}>
      <div
        className={`flex min-w-[10rem] cursor-pointer items-center justify-between gap-x-4 rounded-md border border-solid border-gray-400 p-2.5 transition-colors`}
        onClick={() => setDropdown(!dropdown)}
      >
        <div className={"flex items-center gap-x-2 text-lg leading-3"}>
          <Image
            className={"rounded-full border border-solid border-black"}
            src={session.user.image!}
            alt={"user image"}
            width={30}
            height={30}
          />
          <p className={"select-none"}>{session.user.username!}</p>
        </div>
        <IoCaretDown
          className={`${
            dropdown ? "rotate-180" : "rotate-0"
          } transition-[transform] duration-100 ease-in`}
        />
      </div>
      {dropdown ? (
        <>
          <ul
            className={
              "absolute top-full z-20 w-full rounded-md border border-solid border-gray-400 bg-white"
            }
          >
            <Link
              className={
                "flex cursor-pointer items-center gap-x-4 px-3 py-4 text-lg leading-3 transition-colors hover:bg-gray-100"
              }
              href={`/settings/${session.user.id}`}
              onClick={() => {
                setDropdown(false);
              }}
            >
              <IoSettings />
              <button>Settings</button>
            </Link>
            <li
              className={
                "flex cursor-pointer items-center gap-x-4 px-3 py-4 text-lg leading-3 transition-colors hover:bg-gray-100"
              }
              onClick={() => signOut()}
            >
              <IoExit />
              <button>Log Out</button>
            </li>
          </ul>
          <div
            className={"fixed left-0 top-0 h-screen w-screen"}
            onClick={() => setDropdown(false)}
          ></div>
        </>
      ) : null}
    </div>
  );
};
