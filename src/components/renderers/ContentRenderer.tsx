"use client";

import dynamic from "next/dynamic";
import { ImageRenderer } from "./ImageRenderer";
import { CodeRenderer } from "./CodeRenderer";
import { styles } from "@/lib/editor";

type ContentRendererTypes = {
  content: unknown;
};

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  },
);

const renderers = {
  image: ImageRenderer,
  code: CodeRenderer,
};

export const ContentRenderer = (props: ContentRendererTypes) => {
  return (
    <Output
      className={"text-sm"}
      style={styles}
      data={props.content}
      renderers={renderers}
    />
  );
};
