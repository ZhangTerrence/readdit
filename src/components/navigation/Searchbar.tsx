"use client";

import type { Subreaddit, Subscription, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { useState } from "react";

export const Searchbar = () => {
  const router = useRouter();
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedSubreaddits, setSearchedSubreaddits] = useState<
    (Subreaddit & {
      subscribers: Subscription[];
    })[]
  >([]);
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);

  const search = async () => {
    if (searchQuery.includes("u/")) {
      await fetch(`/api/user?username=${searchQuery.split("u/")[1]}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        if (response.status === 200) {
          const success = await response.json();
          setSearchedUsers(success.users);
        }
      });
    } else if (searchQuery.includes("r/")) {
      await fetch(`/api/subreaddit?subreaddit=${searchQuery.split("r/")[1]}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        if (response.status === 200) {
          const success = await response.json();
          setSearchedSubreaddits(success.subreaddits);
        }
      });
    } else {
      await fetch(`/api/subreaddit?subreaddit=${searchQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        if (response.status === 200) {
          const success = await response.json();
          setSearchedSubreaddits(success.subreaddits);
        }
      });

      await fetch(`/api/user?username=${searchQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        if (response.status === 200) {
          const success = await response.json();
          setSearchedUsers(success.users);
        }
      });
    }
  };

  const stopSearching = () => {
    setSearching(false);
    setSearchQuery("");
    setSearchedSubreaddits([]);
    setSearchedUsers([]);
  };

  return (
    <div
      className={
        "fixed left-0 right-0 top-0 m-auto mt-2.5 flex h-fit w-[40rem] min-w-0 items-center gap-x-2 rounded-lg border border-solid border-black bg-gray-50 p-2 text-lg transition-all duration-200 ease-out max-xl:w-[30rem] max-lg:w-[25rem] max-md:static max-md:m-0 max-md:grow"
      }
    >
      <IoSearch className={"mx-1"} />
      <input
        className={"min-w-0 grow bg-transparent outline-none max-lg:text-lg"}
        type="text"
        name="searchbar"
        value={searchQuery}
        placeholder={"Search Readdit"}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            router.refresh();
            let query = searchQuery;
            if (query.includes("r/")) {
              router.push(`/${searchQuery}`);
            } else if (query.includes("u/")) {
              if (
                searchedUsers.length === 0 ||
                searchedUsers[0].username !== query.split("u/")[1]
              ) {
                router.push(searchQuery);
              } else {
                router.push(`/u/${searchedUsers[0].username}`);
              }
            } else {
              router.push(`/r/${searchQuery}`);
            }

            stopSearching();
          }
        }}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyUp={() => search()}
        onClick={() => {
          setSearching(true);
          search();
        }}
      />
      {searching ? (
        <>
          <div
            className={
              "absolute left-0 top-full z-20 max-h-80 w-full overflow-y-scroll rounded-md border border-solid border-gray-500 bg-white py-2"
            }
          >
            {searchedSubreaddits.length > 0 ? (
              <>
                <h1 className={"p-2 px-3"}>Subreaddits</h1>
                {searchedSubreaddits.map((subreaddit) => {
                  const goToSubreaddit = () => {
                    router.refresh();
                    router.push(`/r/${subreaddit.name}`);
                  };

                  return (
                    <div
                      className={
                        "flex w-full cursor-pointer items-center gap-x-4 rounded-md p-2 px-3 hover:bg-gray-100"
                      }
                      key={subreaddit.id}
                      onClick={() => {
                        goToSubreaddit();
                        stopSearching();
                      }}
                    >
                      <Image
                        className={"aspect-square rounded-full"}
                        src={subreaddit.image}
                        alt={"subreaddit image"}
                        width={30}
                        height={30}
                      />
                      <div className={"flex flex-col text-sm"}>
                        <p>{subreaddit.name}</p>
                        <p>{subreaddit.subscribers.length} members</p>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : null}
            {searchedUsers.length > 0 ? (
              <>
                {searchedUsers.length === 1 &&
                searchedUsers[0].id === "[deleted]" ? null : (
                  <h1 className={"p-2 px-3"}>Users</h1>
                )}
                {searchedUsers.map((user) => {
                  if (user.id === "[deleted]") return null;

                  const goToUser = () => {
                    router.refresh();
                    router.push(`/u/${user.id}`);
                  };

                  return (
                    <div
                      className={
                        "flex w-full cursor-pointer items-center gap-x-4 rounded-md p-2 px-3 hover:bg-gray-100"
                      }
                      key={user.id}
                      onClick={() => {
                        stopSearching();
                        goToUser();
                      }}
                    >
                      <Image
                        className={"aspect-square rounded-full"}
                        src={user.image}
                        alt={"user profile image"}
                        width={30}
                        height={30}
                      />
                      <p className={"text-sm"}>{user.username}</p>
                    </div>
                  );
                })}
              </>
            ) : null}
          </div>
          <div
            className={"fixed left-0 top-0 h-screen w-screen"}
            onClick={() => stopSearching()}
          ></div>
        </>
      ) : null}
    </div>
  );
};
