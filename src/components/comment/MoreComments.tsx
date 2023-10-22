"use client";

import { useRouter, usePathname } from "next/navigation";

type MoreCommentsTypes = {
  commentAmount: number;
};

export const MoreComments = (props: MoreCommentsTypes) => {
  const router = useRouter();
  const pathname = usePathname();

  const getMoreComments = () => {
    const newPath = `${pathname}?take=${Math.ceil(props.commentAmount / 10)}`;
    router.replace(newPath);
  };

  return (
    <button className={"p-2"} onClick={() => getMoreComments()}>
      View More
    </button>
  );
};
