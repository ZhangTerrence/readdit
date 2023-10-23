"use client";

import type { Subreaddit, Subscription } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCaretDown, FaSearch } from "react-icons/fa";

type SearchSubreadditProps = {
  subreaddit: {
    id: string;
    name: string;
    image: string;
  } | null;
  changeSubreaddit?: (subreaddit: { id: string; name: string } | null) => void;
};

export const SearchSubreaddit = (props: SearchSubreadditProps) => {
  const [subreaddit, setSubreaddit] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedSubreaddits, setSearchedSubreaddits] = useState<
    (Subreaddit & {
      subscribers: Subscription[];
    })[]
  >([]);

  useEffect(() => {
    if (props.subreaddit) {
      setSubreaddit(props.subreaddit);
      setSearchQuery(props.subreaddit.name);
    } else {
      setSubreaddit(null);
    }
  }, [props.subreaddit]);

  const searchSubreaddits = async () => {
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
  };

  const stopSearching = () => {
    if (props.changeSubreaddit) {
      props.changeSubreaddit(null);
    }
    setSubreaddit(null);
    setSearching(false);
    setSearchQuery("");
    setSearchedSubreaddits([]);
  };

  return (
    <div
      className={
        "w-1/2 rounded-md border border-solid border-gray-500 text-lg max-md:w-full"
      }
    >
      {searching ? (
        <div className={"relative"}>
          <div
            className={"flex w-full items-center gap-x-2 rounded-md p-2 px-3"}
          >
            <FaSearch />
            <input
              className={"grow pr-2 outline-none"}
              value={searchQuery}
              placeholder={"Search communities"}
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={() => searchSubreaddits()}
            />
            <FaCaretDown className={"cursor-pointer"} />
          </div>
          <div
            className={
              "absolute top-full z-[60] w-full rounded-md border border-solid border-gray-500"
            }
          >
            {searchedSubreaddits.map((subreaddit) => {
              return (
                <div
                  className={
                    "flex w-full cursor-pointer items-center gap-x-2 rounded-md bg-white p-2 px-3 hover:bg-gray-100"
                  }
                  key={subreaddit.id}
                  onClick={() => {
                    if (props.changeSubreaddit) {
                      props.changeSubreaddit({
                        id: subreaddit.id,
                        name: subreaddit.name,
                      });
                    }
                    setSubreaddit({
                      id: subreaddit.id,
                      name: subreaddit.name,
                      image: subreaddit.image,
                    });
                    setSearching(false);
                    setSearchQuery(subreaddit.name);
                    setSearchedSubreaddits([]);
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
          </div>
          <div
            className={"fixed left-0 top-0 z-50 h-screen w-screen"}
            onClick={() => stopSearching()}
          ></div>
        </div>
      ) : (
        <div>
          {subreaddit ? (
            <div
              className={"flex w-full items-center gap-x-2 rounded-md p-2 px-3"}
            >
              <Image
                className={"aspect-square rounded-full"}
                src={subreaddit.image}
                alt={"subreaddit image"}
                width={30}
                height={30}
              />
              <input
                className={"min-w-0 grow outline-none"}
                value={searchQuery}
                type="text"
                onClick={() => {
                  setSearching(true);
                  searchSubreaddits();
                }}
                readOnly={true}
              />
              <FaCaretDown
                className={"cursor-pointer"}
                onClick={() => {
                  setSearching(true);
                  searchSubreaddits();
                }}
              />
            </div>
          ) : (
            <div
              className={"flex w-full items-center gap-x-2 rounded-md p-2 px-3"}
            >
              <div
                className={
                  "aspect-square h-7 rounded-full border border-dashed border-black"
                }
              ></div>
              <input
                className={"min-w-0 grow outline-none"}
                type={"text"}
                value={searchQuery}
                onClick={() => {
                  setSearching(true);
                  searchSubreaddits();
                }}
                readOnly={true}
              ></input>
              <FaCaretDown
                className={"aspect-square h-4 cursor-pointer"}
                onClick={() => {
                  setSearching(true);
                  searchSubreaddits();
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
