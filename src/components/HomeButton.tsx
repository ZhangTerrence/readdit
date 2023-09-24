"use client";

import Link from "next/link";
import { IoHomeSharp } from "react-icons/io5";

export const HomeButton = () => {
  return (
    <Link
      className={"absolute left-0 top-0 m-4 flex items-center text-2xl"}
      href={"/"}
    >
      <IoHomeSharp className={"mr-2"} />
      <p>Home</p>
    </Link>
  );
};
