"use client";

export const DeleteSubreadditButton = () => {
  return (
    <div
      className={
        "inline-flex max-w-full cursor-pointer items-center justify-center rounded-full border-2 border-solid border-red-600 px-16 py-2 text-lg text-red-600 shadow-md shadow-red-200 active:shadow-none"
      }
    >
      <button>Delete</button>
    </div>
  );
};
