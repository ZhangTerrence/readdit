"use client";

import type { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";

type MiniCreatePostTypes = {
  session: Session | null;
  subreaddit: {
    subreadditId: string;
    subreadditName: string;
  };
};

export const MiniCreatePost = (props: MiniCreatePostTypes) => {
  {
    return props.session ? (
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
        <Link
          className={"grow"}
          href={{
            pathname: "/submit",
            query: {
              subreadditId: props.subreaddit.subreadditId,
              subreadditName: props.subreaddit.subreadditName,
            },
          }}
        >
          <input
            className={
              "w-full rounded-md border border-solid border-slate-500 bg-slate-50 py-2 pl-2 text-lg outline-none"
            }
            type="text"
            placeholder={"Create Post"}
          />
        </Link>
      </div>
    ) : null;
  }
};
