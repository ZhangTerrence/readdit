import { Navigation } from "@/components/Navigation";

export default function MainLayout(props: {
  children: React.ReactNode;
  authModals: React.ReactNode;
}) {
  return (
    <section className={"flex flex-col items-center"}>
      <Navigation />
      {props.children}
      {props.authModals}
    </section>
  );
}
