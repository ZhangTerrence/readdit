"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Searchbar } from "./Searchbar";
import { HomeButton } from "./HomeButton";
import { IoCaretDown, IoExit, IoSettings } from "react-icons/io5";

export const Navbar = () => {
  const { data: session } = useSession();
  const [dropdown, setDropdown] = useState(false);

  return (
    <nav
      className={
        "fixed top-0 z-20 flex h-16 w-screen items-center justify-between border border-b border-black bg-white px-4"
      }
    >
      <HomeButton className={"flex items-center gap-x-3 text-xl leading-3"}>
        <Image src={"/readdit.png"} alt={"readdit"} width={25} height={25} />
        <p>Readdit</p>
      </HomeButton>
      <Searchbar />
      {session ? (
        <div className={"relative flex items-center rounded-md"}>
          <div
            className={`flex cursor-pointer items-center gap-x-4 rounded-md border border-solid border-gray-400 p-2.5 transition-colors`}
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
          <ul
            className={`${
              dropdown ? "block" : "hidden"
            } absolute top-full w-full overflow-hidden rounded-md border border-solid border-gray-400 bg-white`}
          >
            <li
              className={
                "flex cursor-pointer items-center gap-x-4 px-3 py-4 text-lg leading-3 transition-colors hover:bg-gray-100"
              }
              onClick={() => {}}
            >
              <IoSettings />
              <button>Settings</button>
            </li>
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
        </div>
      ) : (
        <div className={"flex gap-x-2 text-lg"}>
          <Link
            className={
              "group relative m-1 inline-flex cursor-pointer items-center justify-center rounded-md bg-slate-900 px-3.5 py-2 text-white shadow-lg active:shadow-none"
            }
            href={"/signup"}
          >
            <span
              className={
                "absolute h-0 max-h-full w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"
              }
            ></span>
            <span className="relative">Sign Up</span>
          </Link>
          <Link
            className={
              "group relative m-1 inline-flex cursor-pointer items-center justify-center rounded-md bg-slate-900 px-3.5 py-2 text-white shadow-lg active:shadow-none"
            }
            href={"/signin"}
          >
            <span
              className={
                "absolute h-0 max-h-full w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"
              }
            ></span>
            <span className="relative">Sign In</span>
          </Link>
        </div>
      )}
    </nav>
  );
};
