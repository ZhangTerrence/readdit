"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import type { Session } from "next-auth";
import type { SubscribeToSubreadditPayload } from "@/lib/validators/subreaddit";

type JoinSubreadditTypes = {
  session: Session | null;
  subreadditId: string;
  isSubscribed: boolean;
};

export const SubscribeSubreaddit = (props: JoinSubreadditTypes) => {
  const [isSubscribed, toggleIsSubscribed] = useState(props.isSubscribed);
  const router = useRouter();

  useEffect(() => {
    toggleIsSubscribed(props.isSubscribed);
  }, [props.isSubscribed]);

  const joinSubreaddit = async () => {
    if (!props.session) {
      router.push("/signin");
      return;
    }

    const payload: SubscribeToSubreadditPayload = {
      subreadditId: props.subreadditId,
    };

    await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      if (response.status < 200 || response.status >= 300) {
        const error = await response.text();

        toast.error(error);
      } else {
        const success = await response.text();
        toggleIsSubscribed(true);
        toast.success(success);
      }
    });
  };

  const leaveSubreaddit = async () => {
    const payload: SubscribeToSubreadditPayload = {
      subreadditId: props.subreadditId,
    };

    await fetch("/api/subscribe", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      if (response.status < 200 || response.status >= 300) {
        const error = await response.text();

        toast.error(error);
      } else {
        const success = await response.text();
        toggleIsSubscribed(false);
        toast.success(success);
      }
    });
  };

  return props.session && isSubscribed ? (
    <button
      className={
        "rounded-full border border-solid border-slate-950 bg-slate-50 px-8 py-4 text-lg"
      }
      onClick={() => leaveSubreaddit()}
    >
      Leave
    </button>
  ) : (
    <button
      className={"rounded-full bg-gray-950 px-8 py-4 text-lg text-slate-50"}
      onClick={() => joinSubreaddit()}
    >
      Join
    </button>
  );
};
