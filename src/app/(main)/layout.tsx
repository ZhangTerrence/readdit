import { Navbar } from "@/components/navigation/Navbar";

export default function MainLayout(props: { children: React.ReactNode }) {
  return (
    <section className={"w-screen"}>
      <Navbar />
      <div className={"pt-16"}>{props.children}</div>
    </section>
  );
}
