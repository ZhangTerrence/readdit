import Link from "next/link";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import { ProfileButton } from "./ProfileButton";

export const Navigation = () => {
  return (
    <nav
      className={
        "fixed left-0 right-0 mx-auto flex h-20 w-[95vw] items-center justify-between border-b border-solid border-b-slate-500"
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
      <ProfileButton />
      <div
        className={
          "fixed left-0 right-0 top-0 m-auto mt-4 flex h-fit w-[40rem] items-center rounded-xl border border-solid border-slate-950 bg-white p-2"
        }
      >
        <IoSearch className={"mx-2"} />
        <input
          className={"grow text-xl outline-none"}
          type="text"
          name="searchbar"
          placeholder={"Search Readdit"}
        />
      </div>
    </nav>
  );
};
