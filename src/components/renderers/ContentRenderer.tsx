"use client";

import dynamic from "next/dynamic";
import { ImageRenderer } from "./ImageRenderer";
import { CodeRenderer } from "./CodeRenderer";

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

const styles = {
  header: {
    h1: {
      fontSize: "2.125rem",
      lineHeight: "1.25rem",
      wordBreak: "break-all",
      paddingBottom: "0.5rem",
    },
    h2: {
      fontSize: "1.875rem",
      lineHeight: "1.25rem",
      wordBreak: "break-all",
      paddingBottom: "0.5rem",
    },
    h3: {
      fontSize: "1.625rem",
      lineHeight: "1.25rem",
      wordBreak: "break-all",
      paddingBottom: "0.5rem",
    },
    h4: {
      fontSize: "1.375rem",
      lineHeight: "1.25rem",
      wordBreak: "break-all",
      paddingBottom: "0.5rem",
    },
    h5: {
      fontSize: "1.125rem",
      lineHeight: "1.25rem",
      wordBreak: "break-all",
      paddingBottom: "0.5rem",
    },
    h6: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      wordBreak: "break-all",
      paddingBottom: "0.5rem",
    },
  },
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    wordBreak: "break-all",
    paddingBottom: "0.25rem",
  },
};

export const ContentRenderer = (props: { content: any }) => {
  return (
    <Output
      className={"text-sm"}
      style={styles}
      data={props.content}
      renderers={renderers}
    />
  );
};
