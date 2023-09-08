import { HomeButton } from "@/components/HomeButton";
import { Signup } from "@/components/Signup";

export default function LoginPage() {
  return (
    <main className={"relative flex h-screen w-screen items-center"}>
      <HomeButton />
      <Signup />
    </main>
  );
}