import { HomeButton } from "@/components/HomeButton";
import { SignupForm } from "@/components/SignupForm";

export default function LoginPage() {
  return (
    <main className={"relative flex h-screen w-screen items-center"}>
      <HomeButton />
      <SignupForm />
    </main>
  );
}
