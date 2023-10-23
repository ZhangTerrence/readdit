"use client";

import type {
  CreateSubscriptionPayload,
  DeleteSubscriptionPayload,
} from "@/lib/validators/subscribe";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

type SubscriptionButtonTypes = {
  subreaddit: {
    id: string;
  };
  isSubscribed: boolean;
  className?: string;
};

export const SubscriptionButton = (props: SubscriptionButtonTypes) => {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(props.isSubscribed);
  const router = useRouter();

  useEffect(() => {
    setIsSubscribed(props.isSubscribed);
  }, [props.isSubscribed]);

  const joinSubreaddit = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }

    const payload: CreateSubscriptionPayload = {
      subreadditId: props.subreaddit.id,
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
      subreadditId: props.subreaddit.id,
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

  return session && isSubscribed ? (
    <div
      className={`${props.className} inline-flex cursor-pointer items-center justify-center rounded-full border-2 border-solid border-black px-20 py-4 text-2xl shadow-md active:shadow-none max-xs:w-20 max-xs:px-4 max-xs:text-sm`}
      onClick={() => leaveSubreaddit()}
    >
      <button>Leave</button>
    </div>
  ) : (
    <div
      className={`${props.className} group relative inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-900 px-20 py-4 text-2xl text-white shadow-md active:shadow-none max-xs:w-20 max-xs:px-4 max-xs:text-sm`}
      onClick={() => joinSubreaddit()}
    >
      <span
        className={
          "absolute h-0 max-h-full w-0 rounded-full bg-white opacity-10 transition-all duration-75 ease-out group-hover:h-32 group-hover:w-full"
        }
      ></span>
      <button className={`relative`}>Join</button>
    </div>
  );
};
