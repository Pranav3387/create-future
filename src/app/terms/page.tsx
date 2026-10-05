import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: "/terms" } };

export default function Terms() {
  return (
    <LegalPage title="Terms">
      <p><strong className="text-fg">Template: have this reviewed before launch.</strong></p>
      <h2>Estimates</h2>
      <p>Figures shown by the AI Signage Consultant or elsewhere on this website are indicative only and do not constitute a quotation or offer. Formal quotations are issued in writing following a survey.</p>
      <h2>Designs</h2>
      <p>Configurator previews and visuals are illustrative. Final proportions, materials and finishes are confirmed in the approved design drawing.</p>
      <h2>Consents</h2>
      <p>Advertisement consent, listed building consent and landlord approvals remain the client’s responsibility unless agreed otherwise in writing.</p>
    </LegalPage>
  );
}
