import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <LegalPage title="Privacy policy">
      <p><strong className="text-fg">Template: have this reviewed before launch.</strong> It outlines how SIGNOVA handles personal data under UK GDPR and PECR.</p>
      <h2>What we collect</h2>
      <p>When you request a consultation we collect your name, company, contact details, project details and any files you upload. We also record the campaign that brought you to the site (UTM parameters) to understand which marketing works.</p>
      <h2>How we use it</h2>
      <p>To respond to your enquiry, prepare designs and quotations, and deliver your project. Our lawful basis is your consent and steps taken at your request prior to entering a contract.</p>
      <h2>Cookies</h2>
      <p>Essential cookies run the site. Analytics and marketing cookies are only set if you accept them, and you can change your choice at any time via “Cookie settings” in the footer.</p>
      <h2>Your rights</h2>
      <p>You can request access, correction or deletion of your data by emailing {site.email}. You may also complain to the Information Commissioner’s Office (ico.org.uk).</p>
    </LegalPage>
  );
}
