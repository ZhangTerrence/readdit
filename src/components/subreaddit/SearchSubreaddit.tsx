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
  changeSubreaddit: (subreaddit: { id: string; name: string }) => void;
};

export const SearchSubreaddit = (props: SearchSubreadditProps) => {
  const [subreaddit, setSubreaddit] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchedSubreaddits, setSearchedSubreaddits] = useState<
    (Subreaddit & {
      subscribers: Subscription[];
    })[]
  >([]);

  useEffect(() => {
    if (props.subreaddit) {
      setSubreaddit(props.subreaddit);
      setSearchName(props.subreaddit.name);
    } else {
      setSubreaddit(null);
    }
  }, [props.subreaddit]);

  const searchSubreaddits = async () => {
    await fetch(`/api/subreaddit/${searchName}`, {
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

  useEffect(() => {
    searchSubreaddits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchName]);

  const stopSearching = () => {
    setSearching(false);
    setSubreaddit(null);
    setSearchName("");
    setSearchedSubreaddits([]);
  };

  return (
    <div
      className={"w-1/2 rounded-md border border-solid border-gray-500 text-lg"}
    >
      {searching ? (
        <div className={"relative"}>
          <div
            className={
              "z-10 flex w-full items-center gap-x-2 rounded-md p-2 px-3"
            }
          >
            <FaSearch />
            <input
              className={"grow pr-2 outline-none"}
              value={searchName}
              placeholder={"Search communities"}
              type="text"
              onChange={(e) => setSearchName(`${e.target.value}`)}
            />
            <FaCaretDown className={"cursor-pointer"} />
          </div>
          <div
            className={
              "absolute top-full z-10 w-full overflow-hidden rounded-md border border-solid border-gray-500"
            }
          >
            {searchedSubreaddits.map((subreaddit) => {
              return (
                <div
                  className={
                    "z-10 flex w-full cursor-pointer items-center gap-x-2 rounded-md bg-white p-2 px-3 hover:bg-gray-100"
                  }
                  key={subreaddit.id}
                  onClick={() => {
                    props.changeSubreaddit({
                      id: subreaddit.id,
                      name: subreaddit.name,
                    });
                    setSubreaddit({
                      id: subreaddit.id,
                      name: subreaddit.name,
                      image: subreaddit.image,
                    });
                    setSearching(false);
                    setSearchName(subreaddit.name);
                    setSearchedSubreaddits([]);
                  }}
                >
                  <Image
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
            className={"fixed left-0 top-0 h-screen w-screen"}
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
                src={subreaddit.image}
                alt={"subreaddit image"}
                width={30}
                height={30}
              />
              <input
                className={"grow outline-none"}
                value={searchName}
                type="text"
                onClick={() => setSearching(true)}
                readOnly={true}
              />
              <FaCaretDown
                className={"cursor-pointer"}
                onClick={() => setSearching(true)}
              />
            </div>
          ) : (
            <div
              className={"flex w-full items-center gap-x-2 rounded-md p-2 px-3"}
            >
              <div
                className={
                  "aspect-square w-7 rounded-full border border-dashed border-black"
                }
              ></div>
              <input
                className={"grow outline-none"}
                type={"text"}
                value={searchName}
                onClick={() => setSearching(true)}
              ></input>
              <FaCaretDown
                className={"cursor-pointer"}
                onClick={() => setSearching(true)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
