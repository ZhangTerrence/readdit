import Link from "next/link";
import Image from "next/image";
import { IoSearch, IoCaretDown } from "react-icons/io5";
import { getAuthSession } from "@/lib/auth";

export const Navigation = async () => {
  const session = await getAuthSession();

  return (
    <nav
      className={
        "relative flex h-[5rem] w-[95vw] items-center justify-between border-b-[2px] border-solid border-contrast p-3"
      }
    >
      <Link className={"flex items-center"} href={"/"}>
        <Image
          className={"mr-4"}
          src={"/readdit.png"}
          alt={"readdit"}
          width={40}
          height={40}
        />
        <p className={"text-xl"}>Readdit</p>
      </Link>
      <div
        className={
          "absolute left-0 right-0 m-auto flex w-[40rem] items-center rounded-xl border-[2px] border-solid border-contrast p-2"
        }
      >
        <IoSearch className={"mx-2"} />
        <input
          className={"text-xl outline-none"}
          type="text"
          name="searchbar"
          placeholder={"Search Readdit"}
        />
      </div>
      {session ? (
        <div className={"flex items-center p-2 hover:bg-secondary"}>
          <div className={"mr-6 flex items-center"}>
            <Image
              className={
                "mr-4 rounded-full border border-solid border-contrast"
              }
              src={session.user.image!}
              alt={"user image"}
              width={30}
              height={30}
            />
            <p className={"text-xl"}>{session.user.name}</p>
          </div>
          <IoCaretDown />
        </div>
      ) : (
        <Link
          className={
            "rounded-xl border-[2px] border-solid border-contrast bg-contrast p-2 text-xl text-primary transition-colors duration-200"
          }
          href={"/signin"}
        >
          Sign In
        </Link>
      )}
    </nav>
  );
};
