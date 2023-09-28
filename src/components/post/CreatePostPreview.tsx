"use client";

import type { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const CreatePostPreview = (props: {
  session: Session | null;
  subreadditId: string;
}) => {
  const router = useRouter();

  if (!props.session) {
    return null;
  }

  return (
    <div
      className={
        "flex items-center rounded-md border border-solid border-slate-500 bg-gray-200 p-3"
      }
    >
      <Image
        className={"mr-3 rounded-full border border-solid border-slate-500"}
        src={props.session.user.image!}
        alt={"user image"}
        width={40}
        height={40}
      />
      <input
        className={
          "w-full rounded-md border border-solid border-slate-500 bg-slate-50 py-2 pl-2 text-lg outline-none"
        }
        type="text"
        placeholder={"Create Post"}
        onClick={() => router.push(`/submit/${props.subreadditId}`)}
      />
    </div>
  );
};
