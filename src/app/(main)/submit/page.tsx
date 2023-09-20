import { FaCircleExclamation } from "react-icons/fa6";

import { CreatePost } from "@/components/CreatePost";
import { getAuthSession } from "@/lib/auth";

export default async function CreatePage() {
  const session = await getAuthSession();

  return (
    <main
      className={"flex h-fit min-h-screen justify-center bg-slate-200 py-8"}
    >
      <CreatePost session={session} />
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
