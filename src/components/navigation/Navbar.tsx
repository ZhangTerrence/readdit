import "server-only";

import Image from "next/image";
import Link from "next/link";
import { Searchbar } from "./Searchbar";
import { HomeButton } from "./HomeButton";
import { Dropdown } from "./Dropdown";
import { getAuthSession } from "@/lib/auth";
import { Collapsed } from "./Collapsed";

export const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <nav
      className={
        "fixed top-0 z-10 flex h-16 w-screen items-center justify-between border border-b border-black bg-white px-4 max-md:gap-x-4"
      }
    >
      <HomeButton
        className={
          "flex items-center gap-x-3 text-xl leading-3 max-lg:text-lg max-md:hidden"
        }
      >
        <Image src={"/readdit.png"} alt={"readdit"} width={25} height={25} />
        <p>Readdit</p>
      </HomeButton>
      <Searchbar />
      <Collapsed />
      <div className={"max-md:hidden"}>
        {session ? (
          <Dropdown />
        ) : (
          <div className={"flex gap-x-2 text-lg max-lg:gap-x-0"}>
            <Link
              className={
                "group relative m-1 inline-flex cursor-pointer items-center justify-center rounded-md bg-slate-900 px-3.5 py-2 text-white shadow-lg active:shadow-none max-lg:mr-0"
              }
              href={"/signup"}
            >
              <span
                className={
                  "absolute h-0 max-h-full w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"
                }
              ></span>
              <span className="relative max-lg:text-[1rem]">Sign Up</span>
            </Link>
            <Link
              className={
                "group relative m-1 inline-flex cursor-pointer items-center justify-center rounded-md bg-slate-900 px-3.5 py-2 text-white shadow-lg active:shadow-none max-lg:mr-0"
              }
              href={"/signin"}
            >
              <span
                className={
                  "absolute h-0 max-h-full w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"
                }
              ></span>
              <span className="relative max-lg:text-[1rem]">Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
