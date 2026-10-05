"use client";

import { site } from "@/content/site";
import { Logo } from "./ui/Logo";

const links = [
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-24">
      <div className="wrap">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Logo className="text-fg" />
            <p className="display mt-10 text-[clamp(2.2rem,4.5vw,4rem)] metal-text">Architectural signage.<br />Built to be remembered.</p>
            <a href="/#contact" className="btn btn-primary mt-10">Book a consultation <span className="arrow">→</span></a>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 lg:col-span-6 lg:grid-cols-3">
            <div>
              <p className="label mb-5">Studio</p>
              <ul className="space-y-3">{links.slice(0, 4).map((l) => <li key={l.label}><a href={l.href} className="hover:text-blue">{l.label}</a></li>)}</ul>
            </div>
            <div>
              <p className="label mb-5">Social</p>
              <ul className="space-y-3">
                <li><a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-blue">Instagram ↗</a></li>
                <li><a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue">LinkedIn ↗</a></li>
              </ul>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="label mb-5">Contact</p>
              <address className="space-y-3 not-italic">
                <p>London, United Kingdom</p>
                <p><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-blue">{site.phoneDisplay}</a></p>
                <p><a href={`mailto:${site.email}`} className="hover:text-blue">{site.email}</a></p>
              </address>
            </div>
          </nav>
        </div>

        <div className="mt-24 flex flex-col gap-4 border-t border-line py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SIGNOVA. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            {links.slice(4).map((l) => <a key={l.label} href={l.href} className="hover:text-fg">{l.label}</a>)}
            <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("signova:cookies"))} className="hover:text-fg">Cookie settings</button>
          </div>
        </div>
      </div>
      <p aria-hidden="true" className="display pointer-events-none select-none whitespace-nowrap text-center text-[23vw] leading-[0.75] text-fg opacity-[0.04]">SIGNOVA</p>
    </footer>
  );
}
