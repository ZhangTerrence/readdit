import { getAuthSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getAuthSession();

  return (
    <main>
      <p>Hello world!</p>
      {session ? <p>Logged in</p> : null}
    </main>
  );
}
