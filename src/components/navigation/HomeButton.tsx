"use client";

import { useRouter } from "next/navigation";

type HomeButtonTypes = {
  className: string;
  children: React.ReactNode;
};

export const HomeButton = (props: HomeButtonTypes) => {
  const router = useRouter();

  const goHome = () => {
    router.refresh();
    router.push("/");
  };

  return (
    <button className={`${props.className}`} onClick={() => goHome()}>
      {props.children}
    </button>
  );
};
