import Image from "next/image";
import Link from "next/link";
import { ProfileInfo } from "./ProfileInfo";
import { Searchbar } from "./Searchbar";
import { getAuthSession } from "@/lib/auth";
import { LogoButton } from "./LogoButton";

export const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <nav
      className={
        "flex-ai-center fixed top-0 z-20 h-16 w-screen justify-between border border-b border-black bg-white px-4"
      }
    >
      <LogoButton />
      <Searchbar />
      {session ? (
        <ProfileInfo session={session} />
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
                "absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"
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
                "absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"
              }
            ></span>
            <span className="relative">Sign In</span>
          </Link>
        </div>
      )}
    </nav>
  );
};
