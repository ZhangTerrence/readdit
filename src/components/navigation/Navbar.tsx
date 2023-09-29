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
        "fixed left-0 right-0 z-20 mx-auto flex h-14 w-screen items-center justify-between border-b border-solid border-b-slate-500 bg-white px-4"
      }
    >
      <LogoButton />
      <Searchbar />
      {session ? (
        <ProfileInfo session={session} />
      ) : (
        <div className={"flex"}>
          <Link
            className={"mr-4 rounded-lg bg-slate-200 p-2 text-lg"}
            href={"/signup"}
          >
            Sign Up
          </Link>
          <Link
            className={"rounded-lg bg-gray-800 p-2 text-lg text-slate-50"}
            href={"/signin"}
          >
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
};
