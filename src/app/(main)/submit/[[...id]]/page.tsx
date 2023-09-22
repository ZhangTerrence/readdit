import { FaCircleExclamation } from "react-icons/fa6";

import { CreatePost } from "@/components/CreatePost";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function CreatePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const session = await getAuthSession();

  const subreaddit =
    params.id === undefined
      ? null
      : await prisma.subreaddit.findFirst({
          where: {
            id: {
              endsWith: params.id[0],
              mode: "insensitive",
            },
          },
          include: {
            Posts: {
              include: {
                author: true,
                PostVotes: true,
              },
            },
          },
        });

  return (
    <main
      className={"flex h-fit min-h-screen justify-center bg-slate-200 py-8"}
    >
      <CreatePost session={session} subreaddit={subreaddit} />
      <div
        className={
          "h-fit rounded-md border border-solid border-slate-500 bg-slate-50 p-4 px-6"
        }
      >
        <div
          className={
            "flex items-center border-b border-solid border-slate-300 pb-4 font-semibold"
          }
        >
          <FaCircleExclamation className={"mr-4"} />
          <p>Posting to Readdit</p>
        </div>
        <ul className={"ml-4 list-decimal"}>
          <li className={"border-b border-solid border-slate-300 py-2"}>
            Remember the human
          </li>
          <li className={"border-b border-solid border-slate-300 py-2"}>
            Behave like you would in real life
          </li>
          <li className={"border-b border-solid border-slate-300 py-2"}>
            Look for the original source of content
          </li>
          <li className={"border-b border-solid border-slate-300 py-2"}>
            Search for duplicates before posting
          </li>
          <li className={"border-b border-solid border-slate-300 py-2"}>
            Read the community’s rules
          </li>
        </ul>
      </div>
    </main>
  );
}
