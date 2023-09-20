"use client";

import { signIn } from "next-auth/react";
import { IoLogoGithub, IoLogoGoogle } from "react-icons/io5";

export const AuthProviders = () => {
  const handleProvider = async (
    e: React.MouseEvent<HTMLButtonElement>,
    provider: "google" | "github",
  ) => {
    e.preventDefault();

    try {
      await signIn(provider);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={"mb-6 flex flex-col"}>
      <button
        className={
          "mb-4 flex items-center rounded-xl border border-solid border-slate-950 bg-slate-50 p-4 text-xl"
        }
        onClick={(e) => handleProvider(e, "google")}
      >
        <IoLogoGoogle className={"mr-2"} />
        Continue with Google
      </button>
      <button
        className={
          "flex items-center rounded-xl border border-solid border-slate-950 bg-slate-50 p-4 text-xl"
        }
        onClick={(e) => handleProvider(e, "github")}
      >
        <IoLogoGithub className={"mr-2"} />
        Continue with Github
      </button>
    </div>
  );
};
