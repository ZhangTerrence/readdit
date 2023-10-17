"use client";

import type { CreatePostPayload } from "@/lib/validators/post";
import type { DeleteUploadthingPayload } from "@/lib/validators/uploadthing";
import type EditorJS from "@editorjs/editorjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SearchSubreaddit } from "../subreaddit/SearchSubreaddit";
import { uploadFiles } from "@/lib/uploadthing";
import { IoPencil } from "react-icons/io5";
import { toast } from "react-toastify";

type CreatePostProps = {
  subreaddit: {
    id: string;
    name: string;
    image: string;
  } | null;
};

export const CreatePost = (props: CreatePostProps) => {
  const { data: session } = useSession();
  const editorRef = useRef<EditorJS | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [subreaddit, setSubreaddit] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [titleCharRemaining, setTitleCharRemaining] = useState(128);
  const [titleError, setTitleError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  const editor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const Link = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const Image = (await import("@editorjs/image")).default;

    if (!editorRef.current) {
      const editor: EditorJS = new EditorJS({
        holder: "editor",
        placeholder: "Write your post here...",
        onReady: () => (editorRef.current = editor),
        inlineToolbar: true,
        minHeight: 10,
        data: { blocks: [] },
        tools: {
          header: {
            class: Header,
            config: {
              levels: [1, 2, 3, 4],
              defaultLevel: 1,
            },
          },
          link: {
            class: Link,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: Image,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles({
                    files: [file],
                    endpoint: "imageUploader",
                  });

                  setFiles((files) => [...files, res.key]);

                  return {
                    success: 1,
                    file: {
                      url: res.url,
                    },
                  };
                },
              },
            },
          },
          embed: Embed,
          table: Table,
          list: List,
          code: Code,
          inlineCode: InlineCode,
        },
      });
    }

    return editor;
  }, []);

  useEffect(() => {
    if (props.subreaddit) {
      setSubreaddit(props.subreaddit);
    } else {
      setSubreaddit(null);
    }
  }, [props.subreaddit]);

  useEffect(() => {
    const initializeEditor = async () => {
      await editor();
    };

    if (isMounted) {
      initializeEditor();
    }
  }, [isMounted, editor]);

  if (!isMounted) {
    return null;
  }

  const checkTitle = (input: string) => {
    if (input.length < 3) {
      setTitleError("Title must be greater than 3 characters.");
    } else setTitleError(null);
  };

  const changeSubreaddit = (subreaddit: { id: string; name: string }) => {
    setSubreaddit(subreaddit);
  };

  const cancelCreatePost = async () => {
    if (files.length > 0) {
      const payload: DeleteUploadthingPayload = {
        files,
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
        } else {
          setTimeout(() => {
            router.refresh();
            router.push(subreaddit?.name ? `/r/${subreaddit.name}` : "/");
          }, 500);
        }
      });
    } else {
      router.push(subreaddit?.name ? `/r/${subreaddit.name}` : "/");
    }
  };

  const createPost = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }

    if (!titleRef.current?.value) {
      toast.error("Title is required.");
      return;
    }

    if (titleError) {
      toast.error(titleError);
      return;
    }

    if (!(subreaddit?.id && subreaddit?.name)) {
      toast.error("No subreaddit selected.");
      return;
    }

    const blocks = await editorRef.current?.save();

    const payload: CreatePostPayload = {
      subreadditId: subreaddit.id,
      title: titleRef.current?.value,
      content: blocks,
    };

    await fetch("/api/post", {
      method: "POST",
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
        setTimeout(() => {
          router.refresh();
          router.push(`/r/${subreaddit.name}`);
        }, 500);
      }
    });
  };

  return (
    <div className={"flex flex-col gap-y-4"}>
      <div
        className={
          "flex items-center gap-x-3 border-b border-solid border-gray-400 text-xl"
        }
      >
        <IoPencil className={"-mt-3"} />
        <h1 className={"pb-3 font-bold"}>Create a post</h1>
      </div>
      <SearchSubreaddit
        subreaddit={props.subreaddit}
        changeSubreaddit={changeSubreaddit}
      />
      <div
        className={
          "flex w-[50rem] flex-col gap-y-4 rounded-md border border-solid border-gray-500 p-4"
        }
      >
        <div
          className={"relative rounded-sm border border-solid border-gray-400"}
        >
          <input
            className={
              "w-full rounded-md bg-transparent py-2 pl-3 pr-16 text-2xl outline-none"
            }
            ref={titleRef}
            type="text"
            placeholder={"Title"}
            maxLength={128}
            onChange={(e) => {
              setTitleCharRemaining(128 - e.currentTarget.value.length);
              checkTitle(e.currentTarget.value);
            }}
          />
          <p
            className={`${
              titleCharRemaining === 0 ? "text-red-600" : ""
            } absolute bottom-0 right-0 top-0 my-auto mr-3 h-fit select-none text-xs font-semibold`}
          >
            {titleCharRemaining}/128
          </p>
        </div>
        <div
          className={
            "h-fit rounded-sm border border-solid border-slate-300 p-4"
          }
        >
          <div id={"editor"} className={"break-words pl-4"} />
        </div>
        <div className={"flex gap-x-4 self-end"}>
          <div
            className={
              "inline-flex cursor-pointer items-center justify-center rounded-xl border border-solid border-black px-6 py-2 text-xl shadow-md active:shadow-none"
            }
            onClick={() => cancelCreatePost()}
          >
            <button>Cancel</button>
          </div>
          <div
            className={
              "group relative inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-6 py-2 text-xl text-white shadow-md active:shadow-none"
            }
            onClick={() => createPost()}
          >
            <span
              className={
                "absolute h-0 max-h-full w-0 rounded-full bg-white opacity-10 transition-all duration-75 ease-out group-hover:h-32 group-hover:w-full"
              }
            ></span>
            <button className={"relative"}>Create Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};
