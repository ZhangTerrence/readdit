import { SignoutButton } from "@/components/SignoutButton";
import { getAuthSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getAuthSession();

  return (
    <main>
      <p>Hello world!</p>
      {session ? <SignoutButton /> : null}
    </main>
  );
}
