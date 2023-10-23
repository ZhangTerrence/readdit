"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { FaBars } from "react-icons/fa6";
import { IoExit, IoSettings } from "react-icons/io5";

export const Collapsed = () => {
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(true);

  return session ? (
    <div className={"hidden max-md:block"}>
      <button onClick={() => setCollapsed(!collapsed)}>
        <FaBars />
      </button>
      {collapsed ? null : (
        <ul
          className={
            "absolute left-0 top-full z-20 w-full rounded-b-md border border-solid border-gray-400 bg-white transition-all"
          }
        >
          <Link
            className={
              "flex cursor-pointer items-center gap-x-4 px-3 py-4 text-lg leading-3 transition-colors hover:bg-gray-100"
            }
            href={`/settings/${session.user.id}`}
            onClick={() => setCollapsed(false)}
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
      )}
    </div>
  ) : (
    <div className={"hidden max-md:block"}>
      <button onClick={() => setCollapsed(!collapsed)}>
        <FaBars />
      </button>
      {collapsed ? null : (
        <div
          className={
            "absolute left-0 top-full z-20 flex w-full justify-evenly rounded-b-md border border-solid border-gray-400 bg-white py-2 transition-all"
          }
        >
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
    </div>
  );
};
