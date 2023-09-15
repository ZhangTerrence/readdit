import { notFound } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { GoHome } from "@/components/GoHome";
import { FaBirthdayCake } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import format from "date-fns/format";
import { MiniCreatePost } from "@/components/MiniCreatePost";
import { SubscribeSubreaddit } from "@/components/SubscribeSubreaddit";

type SubreadditPageProps = {
  params: {
    slug: string;
  };
};

export default async function SubreadditPage({ params }: SubreadditPageProps) {
  const session = await getAuthSession();

  const subreaddit = await prisma.subreaddit.findFirst({
    where: {
      name: {
        endsWith: params.slug,
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

  if (!subreaddit) return notFound();

  const subscription = session?.user
    ? await prisma.subscription.findFirst({
        where: {
          subreadditId: subreaddit.id,
          userId: session.user.id,
        },
      })
    : null;

  const isSubscribed = !!subscription;

  const members = await prisma.subscription.count({
    where: {
      subreadditId: subreaddit.id,
    },
  });

  return (
    <div className={"relative"}>
      <GoHome />
      <main className={"flex flex-col items-center bg-slate-200"}>
        <div
          className={
            "flex w-[60rem] border-b-[2px] border-solid border-slate-950 pb-3 pt-6"
          }
        >
          <div className={"flex w-full items-center justify-between"}>
            <div className={"flex"}>
              <Image
                className={
                  "mr-4 rounded-full border-[2px] border-solid border-slate-950"
                }
                src={subreaddit.image}
                alt={"subreaddit image"}
                width={90}
                height={90}
              />
              <div className={"flex flex-col self-end"}>
                <h1 className={"mb-1 text-4xl font-bold"}>{subreaddit.name}</h1>
                <h2 className={"text-lg"}>r/{subreaddit.name}</h2>
              </div>
            </div>
            {subreaddit.creatorId !== session?.user.id ? (
              <SubscribeSubreaddit
                session={session}
                isSubscribed={isSubscribed}
                subreadditId={subreaddit.id}
              />
            ) : null}
          </div>
        </div>
        <div className={"flex py-8"}>
          <div className={"mr-10 flex w-[35rem] flex-col"}>
            <MiniCreatePost
              session={session}
              subreadditName={subreaddit.name}
            />
          </div>
          <div className={"flex flex-col"}>
            <div
              className={
                "mb-4 h-fit w-[22.5rem] rounded-md border border-solid border-slate-500 bg-slate-50"
              }
            >
              <h1 className={"bg-slate-950 p-4 text-lg text-slate-50"}>
                About Community
              </h1>
              <div className={"p-4"}>
                <p>{subreaddit.description}</p>
                <div
                  className={
                    "mt-3 flex items-center border-b border-solid border-slate-300 pb-2"
                  }
                >
                  <FaBirthdayCake className={"mr-2"} />
                  <p className={"text-gray-500"}>
                    Created {format(subreaddit.createdAt, "MMMM d, yyyy")}
                  </p>
                </div>
                <Link
                  href={{
                    pathname: "/submit",
                    query: {
                      subreaddit: subreaddit.name,
                    },
                  }}
                >
                  <button
                    className={
                      "mt-4 w-full rounded-full border border-solid border-slate-500 bg-gray-950 p-1 text-lg text-slate-50"
                    }
                  >
                    Create Post
                  </button>
                </Link>
              </div>
            </div>
            <div
              className={
                "h-fit w-[22.5rem] rounded-md border border-solid border-slate-500 bg-slate-50"
              }
            >
              <h1 className={"bg-slate-950 p-4 text-lg text-slate-50"}>
                Rules
              </h1>
              <ul className={"ml-4 list-decimal p-4"}>
                {subreaddit.rules.map((rule, i) => {
                  return (
                    <li
                      className={
                        "w-full border-b border-solid border-slate-300 py-2"
                      }
                      key={i}
                    >
                      {rule}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}