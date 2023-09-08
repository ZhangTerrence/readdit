import Link from "next/link";

export const Signin = () => {
  return (
    <form
      className={
        "border-contrast bg-secondary ml-[20rem] flex h-full grow flex-col items-start justify-center border-l-[3px] border-solid pl-12"
      }
    >
      <h1 className={"mb-2 text-4xl"}>SIGN IN</h1>
      <p className={"text-lg"}>
        By continuing, you agree to our
        <a href=""> User Agreement</a> and
        <a href=""> Privacy Policy</a>.
      </p>

      <p className={"text-lg"}>
        New to Readdit?{" "}
        <Link className={"font-bold"} href={"/signup"}>
          SIGN UP
        </Link>
      </p>
    </form>
  );
};
