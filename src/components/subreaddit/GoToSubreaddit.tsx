"use client";

import { useRouter } from "next/navigation";

type GoToPostProps = {
  style?: string;
  children: React.ReactNode;
  subreadditName: string;
};

export const GoToSubreaddit = (props: GoToPostProps) => {
  const router = useRouter();

  const goToSubreaddit = () => {
    router.refresh();
    router.push(`/r/${props.subreadditName}`);
  };

  return (
    <button className={`${props.style ?? ""}`} onClick={() => goToSubreaddit()}>
      {props.children}
    </button>
  );
};
