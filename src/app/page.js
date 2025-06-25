"use client";

import HeroSection from "@/app/components/HeroSection";
import StickyNavbar from "@/app/components/StickyNavbar";
import KeyBenefits from "@/app/components/KeyBenefits";
import { Footer } from "@/app/components/footer";
import FAQPreview from "@/app/components/faqs";

import ContactSection from "@/app/components/contact";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StickyNavbar />
           
      <section id="services">
  <KeyBenefits />
</section>

<section id="faqs">
  <FAQPreview />
</section>

<section id="contact">
  <ContactSection />
</section>
     
      <Footer />
    </main>
  );
}
