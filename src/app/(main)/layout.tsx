import { Navigation } from "@/components/Navigation";

export default function MainLayout(props: { children: React.ReactNode }) {
  return (
    <section className={"h-screen w-screen"}>
      <Navigation />
      <div className={"h-screen w-screen pt-20"}>{props.children}</div>
    </section>
  );
}
