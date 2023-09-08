import { Navbar } from "@/components/Navbar";

export default function MainLayout(props: { children: React.ReactNode }) {
  return (
    <section className={"flex flex-col items-center"}>
      <Navbar />
      {props.children}
    </section>
  );
}
