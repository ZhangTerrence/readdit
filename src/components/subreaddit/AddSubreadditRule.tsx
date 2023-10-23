"use client";

import { useState } from "react";
import {
  IoTrashBinOutline,
  IoCheckmarkOutline,
  IoAddOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";

type AddSubreadditRuleTypes = {
  addRule: (rule: string) => void;
};

export const AddSubreadditRule = (props: AddSubreadditRuleTypes) => {
  const [ruleCharRemaining, setRuleCharRemaining] = useState(100);
  const [adding, setAdding] = useState(false);
  const [rule, setRule] = useState("");

  return adding ? (
    <div
      className={
        "mb-1 flex items-center justify-between gap-x-2 rounded-md border border-solid border-gray-400 p-4"
      }
    >
      <div
        className={
          "relative h-12 grow select-text border-r border-solid border-gray-400"
        }
      >
        <textarea
          className={
            "h-full w-full resize-none pr-2 outline-none max-md:text-sm"
          }
          defaultValue={rule}
          maxLength={100}
          placeholder={"Adding rule..."}
          onChange={(e) => {
            setRule(e.currentTarget.value);
            setRuleCharRemaining(100 - e.currentTarget.value.length);
          }}
        ></textarea>
        <p
          className={`${
            ruleCharRemaining === 0 ? "text-red-600" : ""
          } absolute bottom-0 right-0 mr-2 h-fit select-none text-xs font-semibold`}
        >
          {ruleCharRemaining}/100
        </p>
      </div>
      <div className={"flex w-16 text-lg max-md:text-sm"}>
        <div
          className={"rounded-full p-2 transition-colors hover:bg-green-50"}
          title={"Confirm"}
          onClick={() => {
            if (rule.length === 0) toast.error("Rules cannot be empty.");
            else {
              props.addRule(rule);
              setAdding(false);
            }
          }}
        >
          <IoCheckmarkOutline className={"text-green-700"} />
        </div>
        <div
          className={
            "cursor-pointer rounded-full p-2 transition-colors hover:bg-red-50"
          }
          onClick={() => setAdding(false)}
        >
          <IoTrashBinOutline className={"text-red-700"} />
        </div>
      </div>
    </div>
  ) : (
    <div
      className={
        "flex w-full cursor-pointer items-center justify-center rounded-md border border-solid border-gray-400 p-1"
      }
    >
      <div
        className={
          "rounded-full p-3 text-2xl transition-colors hover:bg-gray-50 max-md:text-sm"
        }
        onClick={() => setAdding(true)}
      >
        <IoAddOutline />
      </div>
    </div>
  );
};
