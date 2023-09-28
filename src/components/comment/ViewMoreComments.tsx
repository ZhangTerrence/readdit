"use client";

import { useState } from "react";

export const ViewMoreComments = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [display, setDisplay] = useState(false);

  return display ? (
    <div>{children}</div>
  ) : (
    <button className={"self-start"} onClick={() => setDisplay(true)}>
      View More
    </button>
  );
};
