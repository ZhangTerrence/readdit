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
        "flex-ai-center gap-x-3 rounded-md border border-solid border-black bg-gray-100 p-3"
      }
    >
      <Image
        className={"rounded-full border border-solid border-black"}
        src={props.session.user.image!}
        alt={"user image"}
        width={40}
        height={40}
      />
      <input
        className={
          "grow rounded-md border border-solid border-black py-2 pl-2 text-lg outline-none"
        }
        type="text"
        placeholder={"Create Post"}
        onClick={() => router.push(`/submit/${props.subreadditId}`)}
      />
    </div>
  );
};
