"use client";

import type { Session } from "next-auth";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { IoPencil } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CreatePostPayload } from "@/lib/validators/post";

type CreatePostProps = {
  session: Session | null;
};

type Subreaddit = {
  id: string | null;
  name: string | null;
};

export const CreatePost = (props: CreatePostProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editorRef = useRef<EditorJS | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const [isMounted, toggleIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleCharRemaining, setTitleCharRemaining] = useState(128);
  const [subreaddit, setSubreaddit] = useState<Subreaddit>({
    id: null,
    name: null,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      toggleIsMounted(true);
    }
  }, []);

  useEffect(() => {
    setSubreaddit({
      id: searchParams.get("subreadditId"),
      name: searchParams.get("subreadditName"),
    });
  }, [searchParams]);

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
        minHeight: 20,
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
    const initEditor = async () => {
      await editor();

      setTimeout(() => {});
    };

    if (isMounted) {
      initEditor();

      return () => {};
    }
  }, [isMounted, editor]);

  if (!isMounted) {
    return null;
  }

  const checkTitle = (input: string) => {
    setTitleCharRemaining(128 - input.length);

    if (input.length < 3) {
      setError("Title must be greater than 3 characters.");
    } else setError(null);
  };

  const createPost = async () => {
    if (!props.session) {
      router.push("/signin");
    }

    if (!titleRef.current?.value) {
      toast.error("Title is required.");
      return;
    }

    if (error) {
      toast.error(error);
      return;
    }

    if (!subreaddit.id) {
      toast.error("No subreaddit selected.");
      return;
    }

    const blocks = await editorRef.current?.save();

    const payload: CreatePostPayload = {
      title: titleRef.current?.value,
      content: blocks,
      subreadditId: subreaddit.id,
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
      }
    });
  };

  return (
    <div className={"mr-12"}>
      <div
        className={
          "flex items-center border-b-[2px] border-solid border-slate-50 text-xl"
        }
      >
        <IoPencil className={"-mt-3 mr-2"} />
        <h1 className={"pb-4 font-bold"}>Create a post</h1>
      </div>
      <div className={"mt-4 w-1/2 text-lg"}>
        <input
          className={"w-full rounded-md p-2"}
          defaultValue={subreaddit.name ? subreaddit.name : undefined}
          type="text"
        />
        <button></button>
      </div>
      <div
        className={
          "mt-4 flex w-[50rem] flex-col border border-solid border-slate-500 bg-slate-50 p-4"
        }
      >
        <div
          className={
            "relative mb-4 rounded-sm border border-solid border-slate-300"
          }
        >
          <input
            className={"w-full bg-transparent py-2 pl-3 pr-16 text-2xl"}
            type="text"
            ref={titleRef}
            maxLength={128}
            placeholder={"Title"}
            onChange={(e) => checkTitle(e.currentTarget.value)}
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
            "mb-4 h-fit rounded-sm border border-solid border-slate-300 p-4"
          }
        >
          <div id={"editor"} className={"break-words pl-4"}></div>
        </div>
        <button
          className={
            "w-fit self-end rounded-full bg-gray-700 px-6 py-[0.65rem] text-sm leading-normal text-white"
          }
          onClick={(e) => {
            e.preventDefault();
            createPost();
          }}
        >
          Post
        </button>
      </div>
    </div>
  );
};
