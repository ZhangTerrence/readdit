"use client";

import { useRouter } from "next/navigation";

type UserButtonTypes = {
  user: {
    id: string;
  };
  children: React.ReactNode;
};

export const UserButton = (props: UserButtonTypes) => {
  const router = useRouter();

  const goToUser = () => {
    router.refresh();
    router.push(`/u/${props.user.id}`);
  };

  return (
    <a className={"cursor-pointer"} onClick={() => goToUser()}>
      {props.children}
    </a>
  );
};
