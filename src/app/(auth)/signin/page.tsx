import { HomeButton } from "@/components/HomeButton";
import { Signin } from "@/components/Signin";

export default function SigninPage() {
  return (
    <main className={"relative flex h-screen w-screen items-center"}>
      <HomeButton />
      <Signin />
    </main>
  );
}
