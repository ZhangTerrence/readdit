import { HomeButton } from "@/components/HomeButton";
import { SigninForm } from "@/components/SigninForm";

export default function SigninPage() {
  return (
    <main className={"relative flex h-screen w-screen items-center"}>
      <HomeButton />
      <SigninForm />
    </main>
  );
}
