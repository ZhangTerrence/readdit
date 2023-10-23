"use client";

import { MutableRefObject, useEffect, useState } from "react";
import {
  IoTrashBinOutline,
  IoPencilOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";

type SubreadditRuleTypes = {
  index: number;
  rule: string;
  editRule: (i: number, editedRule: string) => void;
  deleteRule: (i: number) => void;
  draggedItem: MutableRefObject<number | null>;
  draggedOverItem: MutableRefObject<number | null>;
  moveRule: () => void;
};

export const SubreadditRule = (props: SubreadditRuleTypes) => {
  const [ruleCharRemaining, setRuleCharRemaining] = useState(100);
  const [editing, setEditing] = useState(false);
  const [editRule, setEditRule] = useState(props.rule);
  const [rule, setRule] = useState(props.rule);

  useEffect(() => {
    setEditRule(props.rule);
    setRule(props.rule);
    setRuleCharRemaining(100 - props.rule.length);
  }, [props.rule]);

  return (
    <div
      className={`${
        editing ? "" : "cursor-move"
      } mb-1 list-item rounded-md border border-solid border-gray-400 p-4 max-md:w-full`}
      draggable={!editing}
      onDragStart={() => (props.draggedItem.current = props.index)}
      onDragEnter={() => (props.draggedOverItem.current = props.index)}
      onDragEnd={props.moveRule}
    >
      <div className={"flex items-center justify-between gap-x-2"}>
        {editing ? (
          <div
            className={
              "relative h-12 grow select-text border-r border-solid border-gray-400"
            }
          >
            <textarea
              className={
                "h-full w-full resize-none pr-2 outline-none max-md:text-sm"
              }
              defaultValue={editRule}
              maxLength={100}
              placeholder={"Editing rule..."}
              onChange={(e) => {
                setEditRule(e.currentTarget.value);
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
        ) : (
          <p className={"grow break-words max-md:text-sm"}>{rule}</p>
        )}
        <div className={"flex w-16 text-lg max-md:text-sm"}>
          <div
            className={
              "cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-50"
            }
            onClick={() => {
              setEditing(!editing);
              if (!editing) {
                setEditRule(rule);
                setRuleCharRemaining(100 - rule.length);
              }
            }}
          >
            <IoPencilOutline />
          </div>
          {editing ? (
            <div
              className={
                "cursor-pointer rounded-full p-2 transition-colors hover:bg-green-50"
              }
              title={"Confirm"}
              onClick={() => {
                if (editRule.length === 0)
                  toast.error("Rules cannot be empty.");
                else {
                  props.editRule(props.index, editRule);
                  setEditing(false);
                }
              }}
            >
              <IoCheckmarkOutline className={"text-green-700"} />
            </div>
          ) : (
            <div
              className={
                "cursor-pointer rounded-full p-2 transition-colors hover:bg-red-50"
              }
              onClick={() => props.deleteRule(props.index)}
            >
              <IoTrashBinOutline className={"text-red-700"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
