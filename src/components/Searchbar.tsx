"use client";

import { useRouter, usePathname } from "next/navigation";
import { IoSearch } from "react-icons/io5";

export const Searchbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={
        "fixed left-0 right-0 top-0 m-auto mt-2 flex h-fit w-[40rem] items-center rounded-full border border-solid border-slate-950 bg-white p-[0.35rem]"
      }
    >
      <IoSearch className={"mx-2 text-lg"} />
      <input
        className={"grow text-lg outline-none"}
        type="text"
        name="searchbar"
        placeholder={"Search Readdit"}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            let subreadditName = e.currentTarget.value;
            subreadditName = subreadditName.split(" ").join("");

            if (pathname.includes("/r/")) {
              router.push(`${subreadditName}`);
            } else router.push(`r/${subreadditName}`);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
};
