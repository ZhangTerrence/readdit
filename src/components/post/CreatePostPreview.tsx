"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type CreatePostPreview = {
  subreaddit: {
    id: string;
  };
};

export const CreatePostPreview = (props: CreatePostPreview) => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return null;
  }

  return (
    <div
      className={
        "flex items-center gap-x-3 rounded-md border border-solid border-black bg-gray-100 p-3"
      }
    >
      <Image
        className={"rounded-full border border-solid border-black"}
        src={session.user.image!}
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
        onClick={() => router.push(`/submit/${props.subreaddit.id}`)}
      />
    </div>
  );
};
