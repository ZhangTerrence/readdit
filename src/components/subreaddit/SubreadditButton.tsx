"use client";

import { useRouter } from "next/navigation";

type SubreadditButtonProps = {
  className?: string;
  subreaddit: {
    name: string;
  };
  children: React.ReactNode;
};

export const SubreadditButton = (props: SubreadditButtonProps) => {
  const router = useRouter();

  const goToSubreaddit = () => {
    router.refresh();
    router.push(`/r/${props.subreaddit.name}`);
  };

  return (
    <button
      className={`${props.className ?? ""} `}
      onClick={() => goToSubreaddit()}
    >
      {props.children}
    </button>
  );
};
