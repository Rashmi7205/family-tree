"use client";

import { HeroSectionInner } from "@/components/Home/HeroSectionInner";
import { Features } from "@/components/blocks/features-2";
import Members from "@/components/Home/Members";
import About from "@/components/Home/About";
import CTA from "@/components/Home/CTA";
import Footer from "@/components/Home/Footer";
import { HomeNavBar } from "@/components/Home/Header";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HomeNavBar />
      <HeroSectionInner
        title="Explore Your Ancestry"
        subtitle={{
          regular: "Begin your journey through the ",
          gradient: "Durgadham family tree.",
        }}
        description="Discover connections, trace roots, and learn more about your heritage. With our intuitive family tree viewer, you can explore, save, and share heritage data quickly and easily. Revisit stories and memories across generations, bringing the family closer than ever before."
        ctaText="Create my Family tree"
        ctaHref="/trees"
      />
      <div className="bg-gray-50 dark:bg-black">
        <Features />
        <About />
        <CTA />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
