"use client";

import { useRouter } from "next/navigation";
import { IoHomeSharp } from "react-icons/io5";

export const HomeButton = () => {
  const router = useRouter();

  const goToHome = () => {
    router.refresh();
    router.push("/");
  };

  return (
    <button
      className={"absolute left-0 top-0 m-4 flex items-center text-2xl"}
      onClick={() => goToHome()}
    >
      <IoHomeSharp className={"mr-2"} />
      <p>Home</p>
    </button>
  );
};
