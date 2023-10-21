"use client";

import type { UpdateSubreadditPayload } from "@/lib/validators/subreaddit";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SubreadditRule } from "./SubreadditRule";
import { AddSubreadditRule } from "./AddSubreadditRule";
import { UploadButton, uploadFiles } from "@/lib/uploadthing";
import { IoClose, IoFileTray } from "react-icons/io5";
import { toast } from "react-toastify";
import Image from "next/image";
import { FaFileCirclePlus } from "react-icons/fa6";
import { DeleteUploadthingPayload } from "@/lib/validators/uploadthing";

type EditSubreadditTypes = {
  subreaddit: {
    id: string;
    name: string;
    description: string;
    rules: string[];
    image: string;
  };
};

export const EditSubreaddit = (props: EditSubreadditTypes) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const subreadditDescRef = useRef<HTMLTextAreaElement>(null);
  const draggedItemRef = useRef<number | null>(null);
  const draggedOverItemRef = useRef<number | null>(null);
  const [newImageKey, setNewImageKey] = useState("");
  const [imageUrl, setImageUrl] = useState(props.subreaddit.image);
  const [descCharRemaining, setDescCharRemaining] = useState(300);
  const [rules, setRules] = useState(props.subreaddit.rules);
  const router = useRouter();

  useEffect(() => {
    if (subreadditDescRef.current)
      subreadditDescRef.current.value = props.subreaddit.description;
    setDescCharRemaining(300 - props.subreaddit.description.length);
  }, [props.subreaddit.description]);

  const closeModal = async () => {
    if (subreadditDescRef.current)
      subreadditDescRef.current.value = props.subreaddit.description;
    setRules(props.subreaddit.rules);
    modalRef.current?.close();
    setImageUrl(props.subreaddit.image);
    if (newImageKey !== "") {
      const payload: DeleteUploadthingPayload = {
        image: newImageKey,
      };

      await fetch("/api/uploadthing", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then(async (response) => {
        if (response.status < 200 || response.status >= 300) {
          const error = await response.text();
          toast.error(error);
        }
      });
    }
  };

  const editRule = (i: number, editedRule: string) => {
    rules[i] = editedRule;
    setRules((rules) => [...rules]);
  };

  const deleteRule = (i: number) => {
    rules.splice(i, 1);
    setRules((rules) => [...rules]);
  };

  const addRule = (rule: string) => {
    setRules((rules) => [...rules, rule]);
  };

  const moveRule = () => {
    let _rules = [...rules];
    if (
      draggedItemRef.current !== null &&
      draggedOverItemRef.current !== null
    ) {
      const draggedItem = _rules.splice(draggedItemRef.current, 1)[0];
      _rules.splice(draggedOverItemRef.current, 0, draggedItem);

      draggedItemRef.current = null;
      draggedOverItemRef.current = null;

      setRules(_rules);
    }
  };

  const editSubreaddit = async () => {
    if (
      !subreadditDescRef.current?.value ||
      subreadditDescRef.current.value.length === 0
    ) {
      toast.error("Description is required.");
      return;
    }

    const payload: UpdateSubreadditPayload = {
      subreadditId: props.subreaddit.id,
      description: subreadditDescRef.current.value,
      rules,
      image: imageUrl,
    };

    await fetch("/api/subreaddit", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      if (response.status < 200 || response.status >= 300) {
        const error = await response.text();
        toast.error(error);
      } else {
        const success = await response.text();
        toast.success(success);
        if (subreadditDescRef.current)
          subreadditDescRef.current.value = props.subreaddit.description;
        setRules(props.subreaddit.rules);
        modalRef.current?.close();
        setImageUrl(props.subreaddit.image);
        setTimeout(() => {
          router.refresh();
        }, 500);
      }
    });
  };

  return (
    <>
      <div
        className={
          "inline-flex max-w-full cursor-pointer items-center justify-center rounded-full border-2 border-solid border-slate-950 px-16 py-2 text-lg shadow-md active:shadow-none"
        }
        onClick={() => modalRef.current?.showModal()}
      >
        <button>Edit</button>
      </div>
      <dialog
        className={"fixed inset-0 m-auto backdrop:opacity-50"}
        ref={modalRef}
        open={false}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <form
          className={
            "flex w-[50rem] flex-col gap-y-6 overflow-hidden rounded-md border border-solid border-black p-8"
          }
        >
          <div
            className={
              "flex items-center justify-between border-b border-solid border-b-black pb-3"
            }
          >
            <h1 className={"text-3xl"}>Edit Subreaddit</h1>
            <div
              className={"rounded-full p-2 transition-colors hover:bg-gray-50"}
            >
              <IoClose
                className={"cursor-pointer text-3xl"}
                onClick={() => closeModal()}
              />
            </div>
          </div>
          <div className={"flex grow gap-x-4"}>
            <div
              className={
                "group relative aspect-square w-64 cursor-pointer overflow-hidden rounded-full border border-solid border-black transition-all duration-300"
              }
            >
              <Image
                src={imageUrl}
                alt={"edit image"}
                fill={true}
                style={{ objectFit: "contain" }}
              />
              <div
                className={
                  "absolute hidden h-full w-full flex-col items-center justify-center gap-y-2 object-cover text-white transition-all duration-300 group-hover:flex group-hover:backdrop-blur-lg"
                }
              >
                <FaFileCirclePlus className={"text-3xl"} />
                <div>Upload file</div>
              </div>
              <input
                className={"absolute h-full w-full opacity-0"}
                type="file"
                onChange={async (e) => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files);

                    const [res] = await uploadFiles({
                      files,
                      endpoint: "imageUploader",
                    });

                    if (res) {
                      setNewImageKey(res.key);
                      setImageUrl(res.url);
                    }
                  }
                }}
              />
            </div>
            <div className={"flex grow flex-col gap-y-4"}>
              <div className={"flex gap-x-4"}>
                <div className={"flex grow-[1] items-center gap-x-4 text-xl"}>
                  <h2>Name</h2>
                  <input
                    className={"grow rounded-md bg-gray-200 p-2 outline-none"}
                    value={props.subreaddit.name}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className={"relative flex flex-col gap-y-2"}>
                <h2 className={"text-xl"}>Description</h2>
                <textarea
                  className={
                    "min-h-[10rem] w-full resize-none rounded-md border border-solid border-gray-400 p-3 text-lg outline-none"
                  }
                  ref={subreadditDescRef}
                  defaultValue={props.subreaddit.description}
                  placeholder={"Edit description here..."}
                  maxLength={300}
                  onChange={(e) =>
                    setDescCharRemaining(300 - e.currentTarget.value.length)
                  }
                ></textarea>
                <p
                  className={`${
                    descCharRemaining === 0 ? "text-red-600" : ""
                  } absolute bottom-0 right-0 m-4 h-fit select-none text-xs font-semibold`}
                >
                  {descCharRemaining}/300
                </p>
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-y-2"}>
            <h2 className={"text-xl"}>Rules</h2>
            <div className={"max-h-52 overflow-y-scroll"}>
              <div>
                {rules.map((rule, i) => {
                  return (
                    <SubreadditRule
                      key={i}
                      index={i}
                      rule={rule}
                      editRule={editRule}
                      deleteRule={deleteRule}
                      draggedItem={draggedItemRef}
                      draggedOverItem={draggedOverItemRef}
                      moveRule={moveRule}
                    />
                  );
                })}
              </div>
              <AddSubreadditRule addRule={addRule} />
            </div>
          </div>
          <div className={"mt-4 flex justify-end gap-x-4"}>
            <div
              className={
                "inline-flex cursor-pointer items-center justify-center rounded-xl border border-solid border-black px-6 py-2 text-xl shadow-md active:shadow-none"
              }
              onClick={(e) => {
                e.preventDefault();
                closeModal();
              }}
            >
              <button>Cancel</button>
            </div>
            <div
              className={
                "group relative inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-6 py-2 text-xl text-white shadow-md active:shadow-none"
              }
              onClick={(e) => {
                e.preventDefault();
                editSubreaddit();
              }}
            >
              <span
                className={
                  "absolute h-0 max-h-full w-0 rounded-full bg-white opacity-10 transition-all duration-75 ease-out group-hover:h-32 group-hover:w-full"
                }
              ></span>
              <button className={"relative"}>Edit Subreaddit</button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
};
