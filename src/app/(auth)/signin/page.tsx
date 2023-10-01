import Link from "next/link";
import { AuthProviders } from "@/components/AuthProviders";
import { HomeButton } from "@/components/navigation/HomeButton";

export default async function SigninPage() {
  return (
    <main
      className={
        "relative h-screen w-screen bg-gradient-to-r from-white to-gray-300"
      }
    >
      <HomeButton />
      <div
        className={
          "flex-jc-center ml-80 h-full flex-col items-start gap-y-8 border-l-2 border-solid border-black pl-12"
        }
      >
        <div>
          <h1 className={"mb-4 text-4xl underline"}>Sign In</h1>
          <p className={"text-lg"}>
            By continuing, you are creating a Readdit account and agree to our
            User Agreement and Privacy Policy.
          </p>
        </div>
        <AuthProviders />
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
