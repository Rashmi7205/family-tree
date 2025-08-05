"use client";

import { HeroSectionInner } from "@/components/Home/HeroSectionInner";
import { Features } from "@/components/blocks/features-2";
import Members from "@/components/Home/Members";
import About from "@/components/Home/About";
import CTA from "@/components/Home/CTA";
import Footer from "@/components/Home/Footer";
import { HomeNavBar } from "@/components/Home/Header";
import { useTranslation } from "react-i18next";
import { PageLoader } from "@/components/ui/loader";

const Index = () => {
  const { t, ready } = useTranslation("common");

  // Show loading state while translations are being loaded
  if (!ready) {
    return <PageLoader text="Loading translations..." />;
  }

  return (
    <div className="min-h-screen">
      <HomeNavBar />
      <HeroSectionInner
        title={t("homepage.hero.title")}
        subtitle={{
          regular: t("homepage.hero.subtitle.regular"),
          gradient: t("homepage.hero.subtitle.gradient"),
        }}
        description={t("homepage.hero.description")}
        ctaText={t("homepage.hero.ctaText")}
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
