import { Navigation } from "@/components/Navigation";

export default function MainLayout(props: { children: React.ReactNode }) {
  return (
    <section className={"w-screen overflow-hidden"}>
      <Navigation />
      <div className={"h-fit pt-14"}>{props.children}</div>
    </section>
  );
}
