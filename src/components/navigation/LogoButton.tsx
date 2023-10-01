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
    <button
      className={"flex-ai-center gap-x-3 text-xl"}
      onClick={() => goToHome()}
    >
      <Image src={"/readdit.png"} alt={"readdit"} width={25} height={25} />
      <p>Readdit</p>
    </button>
  );
};
