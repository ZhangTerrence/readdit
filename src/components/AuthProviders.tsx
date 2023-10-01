"use client";

import { signIn } from "next-auth/react";
import { IoLogoGithub, IoLogoGoogle } from "react-icons/io5";

export const AuthProviders = () => {
  const handleProvider = async (provider: "google" | "github") => {
    try {
      await signIn(provider);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={"flex flex-col gap-y-4"}>
      <div
        className={
          "group relative overflow-hidden rounded px-5 py-2.5 transition-all duration-300 ease-out hover:bg-white hover:ring hover:ring-black hover:ring-offset-2"
        }
      >
        <span
          className={
            "ease absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform opacity-10 transition-all duration-1000 group-hover:-translate-x-40"
          }
        ></span>
        <button
          className={"flex-ai-center relative gap-x-2 text-xl"}
          onClick={() => handleProvider("google")}
        >
          <IoLogoGoogle />
          <p>Continue with Google</p>
        </button>
      </div>
      <div
        className={
          "group relative overflow-hidden rounded px-5 py-2.5 transition-all duration-300 ease-out hover:bg-white hover:ring hover:ring-black hover:ring-offset-2"
        }
      >
        <span
          className={
            "ease absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform opacity-10 transition-all duration-1000 group-hover:-translate-x-40"
          }
        ></span>
        <button
          className={"flex-ai-center gap-x-2 text-xl"}
          onClick={() => handleProvider("github")}
        >
          <IoLogoGithub />
          <p>Continue with Github</p>
        </button>
      </div>
    </div>
  );
};
