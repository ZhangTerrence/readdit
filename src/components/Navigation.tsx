import Link from "next/link";
import Image from "next/image";
import { getAuthSession } from "@/lib/auth";
import { IoSearch } from "react-icons/io5";
import { ProfileDropdown } from "./ProfileDropdown";

export const Navigation = async () => {
  const session = await getAuthSession();

  return (
    <nav
      className={
        "fixed left-0 right-0 z-20 mx-auto flex h-20 w-screen items-center justify-between border-b border-solid border-b-slate-500 bg-white px-4"
      }
    >
      <Link className={"flex items-center"} href={"/"}>
        <Image
          className={"mr-4"}
          src={"/readdit.png"}
          alt={"readdit"}
          width={35}
          height={35}
        />
        <p className={"text-xl"}>Readdit</p>
      </Link>
      {session ? (
        <ProfileDropdown session={session} />
      ) : (
        <Link
          className={"rounded-lg bg-gray-800 p-3 text-xl text-slate-50"}
          href={"/signin"}
        >
          Sign In
        </Link>
      )}
      <div
        className={
          "fixed left-0 right-0 top-0 m-auto mt-3 flex h-fit w-[40rem] items-center rounded-full border border-solid border-slate-950 bg-white p-3"
        }
      >
        <IoSearch className={"mx-2 text-lg"} />
        <input
          className={"grow text-lg outline-none"}
          type="text"
          name="searchbar"
          placeholder={"Search Readdit"}
        />
      </div>
    </nav>
  );
};
