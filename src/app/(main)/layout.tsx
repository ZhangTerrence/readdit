import { Navigation } from "@/components/Navigation";

export default function MainLayout(props: { children: React.ReactNode }) {
  return (
    <section className={"h-screen w-screen bg-slate-50"}>
      <Navigation />
      <div className={"pt-20"}>{props.children}</div>
    </section>
  );
}
