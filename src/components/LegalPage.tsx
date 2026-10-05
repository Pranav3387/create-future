import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main id="main" className="wrap max-w-3xl pb-24 pt-40">
        <p className="label mb-6">Legal</p>
        <h1 className="display mb-12 text-[clamp(2.6rem,6vw,5rem)] metal-text">{title}</h1>
        <div className="space-y-6 leading-relaxed text-muted [&_h2]:mt-12 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fg">{children}</div>
      </main>
      <Footer />
    </>
  );
}
