import Link from "next/link";
import { AuthProviders } from "@/components/AuthProviders";
import { HomeButton } from "@/components/navigation/HomeButton";

export default async function LoginPage() {
  return (
    <main className={"relative flex h-screen w-screen bg-slate-50"}>
      <HomeButton />
      <form
        className={
          "ml-[20rem] flex h-full grow flex-col items-start justify-center border-l border-solid border-slate-950 bg-gradient-to-br  from-slate-50 to-slate-300 pl-12"
        }
      >
        <h1 className={"mb-2 text-4xl underline"}>SIGN UP</h1>
        <p className={"mb-6 text-lg"}>
          By continuing, you are creating a Readdit account and agree to our
          <a href=""> User Agreement</a> and
          <a href=""> Privacy Policy</a>.
        </p>
        <AuthProviders />
        <p className={"text-lg"}>
          Already a Readditor?{" "}
          <Link className={"font-bold underline"} href={"/signin"}>
            Sign In
          </Link>
        </p>
      </form>
    </main>
  );
}
