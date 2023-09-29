"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export const LogoButton = () => {
  const router = useRouter();

  const goToHome = () => {
    router.refresh();
    router.push("/");
  };

  return (
    <button className={"flex items-center"} onClick={() => goToHome()}>
      <Image
        className={"mr-4 block"}
        src={"/readdit.png"}
        alt={"readdit"}
        width={25}
        height={25}
      />
      <p className={"text-xl"}>Readdit</p>
    </button>
  );
};
