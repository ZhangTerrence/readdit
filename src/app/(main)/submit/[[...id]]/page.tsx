import { CreatePost } from "@/components/post/CreatePost";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FaCircleExclamation } from "react-icons/fa6";

export default async function CreatePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const session = await getAuthSession();

  const subreaddit =
    params.id !== undefined
      ? await prisma.subreaddit.findFirst({
          where: {
            id: {
              endsWith: params.id[0],
              mode: "insensitive",
            },
          },
          include: {
            posts: {
              include: {
                author: true,
                postVotes: true,
              },
            },
          },
        })
      : null;

  return (
    <main className={"flex-jc-center h-fit min-h-screen gap-x-12 py-8"}>
      <CreatePost
        session={session}
        subreadditId={subreaddit?.id}
        subreadditName={subreaddit?.name}
      />
      <div
        className={"h-fit rounded-md border border-solid border-black p-4 px-6"}
      >
        <div
          className={
            "flex-ai-center gap-x-4 border-b border-solid border-gray-400 pb-4 pt-2 font-semibold"
          }
        >
          <FaCircleExclamation />
          <p>Posting to Readdit</p>
        </div>
        <ul className={"ml-4 list-decimal pt-2"}>
          <li className={"border-b border-solid border-gray-400 py-2"}>
            Remember the human
          </li>
          <li className={"border-b border-solid border-gray-400 py-2"}>
            Behave like you would in real life
          </li>
          <li className={"border-b border-solid border-gray-400 py-2"}>
            Look for the original source of content
          </li>
          <li className={"border-b border-solid border-gray-400 py-2"}>
            Search for duplicates before posting
          </li>
          <li className={"border-b border-solid border-gray-400 py-2"}>
            Read the community’s rules
          </li>
        </ul>
      </div>
    </main>
  );
}
