import { notFound } from "next/navigation";
import { EditUser } from "@/components/user/EditUser";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function SettingsPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const session = await getAuthSession();

  if (!session || params.id !== session.user.id) {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!user) {
    return notFound();
  }

  return (
    <main className={"flex h-fit justify-center gap-x-12 py-8 max-md:w-full"}>
      <EditUser user={user} />
    </main>
  );
}
