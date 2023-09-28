"use client";

import type { Session } from "next-auth";
import type {
  CreateSubscriptionPayload,
  DeleteSubscriptionPayload,
} from "@/lib/validators/subscribe";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type SubscriptionButtonTypes = {
  session: Session | null;
  subreadditId: string;
  isSubscribed: boolean;
  classNames?: string;
};

export const SubscriptionButton = (props: SubscriptionButtonTypes) => {
  const [isSubscribed, setIsSubscribed] = useState(props.isSubscribed);
  const router = useRouter();

  useEffect(() => {
    setIsSubscribed(props.isSubscribed);
  }, [props.isSubscribed]);

  const joinSubreaddit = async () => {
    if (!props.session) {
      router.push("/signin");
      return;
    }

    const payload: CreateSubscriptionPayload = {
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
        setIsSubscribed(true);
        toast.success(success);
      }
    });
  };

  const leaveSubreaddit = async () => {
    const payload: DeleteSubscriptionPayload = {
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
        setIsSubscribed(false);
        toast.success(success);
      }
    });
  };

  return props.session && isSubscribed ? (
    <button
      className={`rounded-full border border-solid border-slate-950 bg-slate-50 px-8 py-4 text-lg ${props.classNames}`}
      onClick={() => leaveSubreaddit()}
    >
      Leave
    </button>
  ) : (
    <button
      className={`rounded-full bg-gray-950 px-8 py-4 text-lg text-slate-50 ${props.classNames}`}
      onClick={() => joinSubreaddit()}
    >
      Join
    </button>
  );
};
