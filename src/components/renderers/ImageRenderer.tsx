"use client";

import Image from "next/image";

type ImageRendererTypes = {
  data: any;
};

export const ImageRenderer = (props: ImageRendererTypes) => {
  const src = props.data.file.url;

  return (
    <div className={"relative min-h-[15rem] w-full"}>
      <Image
        className={"object-contain"}
        src={src}
        alt={"post image"}
        fill={true}
        sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      />
    </div>
  );
};
