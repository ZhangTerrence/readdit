import Link from "next/link";
import { IoChatbox, IoHome } from "react-icons/io5";

import { CreateSubreaddit } from "@/components/CreateSubreaddit";
import { getAuthSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getAuthSession();

  return (
    <main
      className={"flex h-fit min-h-screen justify-center bg-slate-200 py-8"}
    >
      <div
        className={
          "mr-12 w-[50rem] rounded-md border border-solid border-slate-500 bg-white p-8"
        }
      >
        <div
          className={
            "flex items-center border-b border-solid border-slate-500 pb-4 text-2xl font-bold"
          }
        >
          <IoChatbox className={"mr-4 mt-1"} />
          <h1>Your Feed</h1>
        </div>
      </div>
      <div
        className={
          "h-fit w-[25rem] rounded-md border border-solid border-slate-500 bg-white p-8"
        }
      >
        <div
          className={
            "flex flex-col border-b border-solid border-slate-500 pb-4"
          }
        >
          <div className={"mb-2 flex items-center text-2xl font-bold"}>
            <IoHome className={"mr-4"} />
            <h1>Home</h1>
          </div>
          <p>
            Your personal Readdit frontpage. Come here to check in with your
            favorite communities.
          </p>
        </div>
        <Link href={"/submit"}>
          <button
            className={
              "mt-4 w-full rounded-full border border-solid border-slate-500 bg-gray-800 p-1 text-xl text-slate-50"
            }
          >
            Create Post
          </button>
        </Link>
        <CreateSubreaddit session={session} />
      </div>
    </main>
  );
}
