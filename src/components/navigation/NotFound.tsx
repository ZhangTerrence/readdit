import "server-only";

export const NotFound = () => {
  return (
    <main
      className={"flex flex-col items-center justify-center gap-y-12 py-60"}
    >
      <h1 className={"grow text-8xl"}>404</h1>
      <p>Page not found.</p>
    </main>
  );
};
