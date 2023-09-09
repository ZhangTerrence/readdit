"use client";

import { useState } from "react";
import { IoLogoGoogle, IoLogoGithub } from "react-icons/io5";
import { signIn } from "next-auth/react";

export const AuthForm = () => {
  const [loading, toggleLoading] = useState(false);

  const handleProvider = async (
    e: React.MouseEvent<HTMLButtonElement>,
    provider: "google" | "github",
  ) => {
    e.preventDefault();
    toggleLoading(true);

    try {
      await signIn(provider);
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <div className={"mb-6 flex flex-col"}>
      <button
        className={
          "mb-4 flex items-center rounded-xl border-[2px] border-solid border-contrast p-4 text-xl"
        }
        onClick={(e) => handleProvider(e, "google")}
      >
        <IoLogoGoogle className={"mr-2"} />
        Continue with Google
      </button>
      <button
        className={
          "flex items-center rounded-xl border-[2px] border-solid border-contrast p-4 text-xl"
        }
        onClick={(e) => handleProvider(e, "github")}
      >
        <IoLogoGithub className={"mr-2"} />
        Continue with Github
      </button>
    </div>
  );
};
