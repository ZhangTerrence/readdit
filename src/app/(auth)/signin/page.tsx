import Link from "next/link";
import { HomeButton } from "@/components/navigation/HomeButton";
import { AuthButtons } from "@/components/auth/AuthButtons";
import { IoHomeSharp } from "react-icons/io5";

export default async function SigninPage() {
  return (
    <main
      className={
        "relative h-screen w-screen bg-gradient-to-r from-white to-gray-300"
      }
    >
      <HomeButton
        className={
          "absolute left-0 top-0 m-4 flex items-center gap-x-2 text-2xl"
        }
      >
        <IoHomeSharp />
        <p>Home</p>
      </HomeButton>
      <div
        className={
          "ml-80 flex h-full flex-col items-start justify-center gap-y-8 border-l-2 border-solid border-black px-12 max-lg:ml-0 max-lg:border-none"
        }
      >
        <div>
          <h1 className={"mb-4 text-4xl underline"}>Sign In</h1>
          <p className={"text-lg"}>
            By continuing, you are creating a Readdit account and agree to our
            User Agreement and Privacy Policy.
          </p>
        </div>
        <AuthButtons />
        <p className={"text-lg"}>
          New to Readdit?{" "}
          <Link className={"font-bold underline"} href={"/signup"}>
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
