import Link from "next/link";
import Image from "next/image";
import { getAuthSession } from "@/lib/auth";
import { IoCaretDown } from "react-icons/io5";

export const ProfileButton = async () => {
  const session = await getAuthSession();

  return session ? (
    <div
      className={
        "flex items-center rounded-md p-2 transition-colors duration-200 hover:bg-slate-200"
      }
    >
      <div className={"mr-4 flex items-center"}>
        <Image
          className={"mr-4 rounded-full border border-solid border-slate-950"}
          src={session.user.image!}
          alt={"user image"}
          width={35}
          height={35}
        />
        <p className={"text-xl"}>{session.user.name}</p>
      </div>
      <IoCaretDown />
    </div>
  ) : (
    <Link
      className={"rounded-lg bg-gray-800 p-3 text-xl text-slate-50"}
      href={"/signin"}
    >
      Sign In
    </Link>
  );
};
