"use client";

import { signOut } from "next-auth/react";

export const SignoutButton = () => {
  return <button onClick={() => signOut()}>Log Out</button>;
};
