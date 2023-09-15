import { Navigation } from "@/components/Navigation";

export default function MainLayout(props: { children: React.ReactNode }) {
  return (
    <section className={"h-screen w-screen"}>
      <Navigation />
      <div className={"pt-14"}>{props.children}</div>
    </section>
  );
}
