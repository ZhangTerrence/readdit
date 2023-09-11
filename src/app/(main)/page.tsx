import Link from "next/link";
import { CreateSubreaddit } from "@/components/CreateSubreaddit";
import { IoHome, IoChatbox } from "react-icons/io5";

export default async function HomePage() {
  return (
    <main className={"flex justify-center bg-slate-100 py-8"}>
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
          "w-[25rem] rounded-md border border-solid border-slate-500 bg-white p-8"
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
        <Link href={"/createPost"}>
          <button
            className={
              "mt-4 w-full rounded-full border border-solid border-slate-500 bg-gray-800 p-1 text-xl text-slate-50"
            }
          >
            Create Post
          </button>
        </Link>
        <CreateSubreaddit />
      </div>
    </main>
  );
}
