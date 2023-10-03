"use client";

type CodeRendererTypes = {
  data: any;
};

export const CodeRenderer = (props: CodeRendererTypes) => {
  return (
    <pre className="rounded-md bg-gray-800 p-4">
      <code className="text-sm text-gray-100">{props.data.code}</code>
    </pre>
  );
};
