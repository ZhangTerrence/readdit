"use client";

import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";

export const Searchbar = () => {
  const router = useRouter();

  return (
    <div
      className={
        "flex-ai-center fixed left-0 right-0 top-0 m-auto mt-2.5 h-fit w-[40rem] overflow-hidden rounded-lg border border-solid border-black bg-gray-50 p-2 text-lg transition-all duration-200 ease-out"
      }
    >
      <IoSearch className={"mx-2"} />
      <input
        className={"grow bg-transparent outline-none"}
        type="text"
        name="searchbar"
        placeholder={"Search Readdit"}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            let subreadditName = e.currentTarget.value;
            subreadditName = subreadditName.split(" ").join("");
            router.push(`/r/${subreadditName}`);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
};
