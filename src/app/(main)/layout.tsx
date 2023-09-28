import { Navbar } from "@/components/navigation/Navbar";

export default function MainLayout(props: { children: React.ReactNode }) {
  return (
    <section className={"w-screen overflow-hidden"}>
      <Navbar />
      <div className={"h-fit pt-14"}>{props.children}</div>
    </section>
  );
}
