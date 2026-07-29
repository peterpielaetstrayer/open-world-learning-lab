import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/content/shared";

export const metadata: Metadata = createPageMetadata({
  title: "Contact — Open World Learning Lab",
  description:
    "Start a thoughtful conversation with Open World Learning Lab about education, mentorship, pilots, product, research, or design collaboration.",
  path: "/contact",
});

const inquiryCategories = [
  "Learning and curriculum",
  "Potential pilot environments",
  "Mentorship and learner support",
  "Product and technology",
  "Research and design",
  "General collaboration",
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="py-section-y-page">
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <SectionHeader
            title="Start a thoughtful conversation."
            intro="OWLL is interested in conversations with educators, mentors, learning designers, researchers, community organizations, technologists, and potential pilot collaborators."
          />

          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              Because the work is early, the most useful conversations are specific. Share what you are working on, what part of OWLL interests you, and what kind of conversation or collaboration you have in mind.
            </p>
          </div>

          <div className="mt-10 card-premium p-6 md:p-8">
            <p className="field-label mb-4">Suggested inquiry categories</p>
            <ul className="grid sm:grid-cols-2 gap-2">
              {inquiryCategories.map((category) => (
                <li
                  key={category}
                  className="text-sm text-muted flex items-start gap-2"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tahoe" aria-hidden="true" />
                  {category}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <a
              href={`mailto:${siteConfig.email}?subject=OWLL%20Conversation`}
              className="btn-tactile inline-flex min-h-11 items-center justify-center rounded-full bg-pine px-8 py-3 text-sm font-medium text-white hover:bg-pine-light"
            >
              Start a Conversation
            </a>
            <p className="mt-4 text-sm text-stone">
              {siteConfig.email}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
