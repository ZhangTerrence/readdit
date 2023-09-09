import Link from "next/link";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";

export const Navbar = () => {
  return (
    <nav
      className={
        "flex w-[95vw] items-center justify-between border-b-[2px] border-solid border-contrast p-3"
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
        <p className={"text-2xl"}>Readdit</p>
      </Link>
      <div
        className={
          "flex w-[40rem] items-center rounded-xl border-[2px] border-solid border-contrast p-2"
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
      <Link
        className={
          "rounded-xl border-[2px] border-solid border-contrast bg-contrast p-3 text-xl text-primary transition-colors duration-200"
        }
        href={"/signin"}
      >
        Login
      </Link>
    </nav>
  );
};
