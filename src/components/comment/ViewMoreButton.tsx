"use client";

import { useState } from "react";

type ViewMoreButtonProps = {
  children: React.ReactNode;
};

export const ViewMoreButton = (props: ViewMoreButtonProps) => {
  const [display, setDisplay] = useState(false);

  return display ? (
    <div>{props.children}</div>
  ) : (
    <button className={"self-start"} onClick={() => setDisplay(true)}>
      View More
    </button>
  );
};
