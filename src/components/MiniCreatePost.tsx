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
      <div className={"flex items-center rounded-md bg-slate-50 p-2"}>
        <Image
          className={"mr-2 rounded-full border border-solid border-slate-950"}
          src={props.session.user.image!}
          alt={"user image"}
          width={45}
          height={45}
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
              "w-full rounded-md bg-slate-200 py-2 pl-2 text-lg outline-none"
            }
            type="text"
            placeholder={"Create Post"}
          />
        </Link>
      </div>
    ) : null;
  }
};
