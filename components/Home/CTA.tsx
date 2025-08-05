"use client";

import { CTASection } from "./CtaWithGlow";
import { useTranslation } from "react-i18next";

const CTA = () => {
  const { t, ready } = useTranslation("common");

  // Show loading state while translations are being loaded
  if (!ready) {
    return (
      <section id="cta" className="py-16 md:py-32 bg-background">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="h-12 bg-muted rounded animate-pulse mb-6" />
          <div className="h-10 bg-muted rounded w-32 mx-auto animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <CTASection
      id="cta"
      title={t("homepage.cta.title")}
      action={{
        text: t("homepage.cta.button"),
        href: "/auth/signup",
        variant: "default",
      }}
      className="bg-background"
    />
  );
};

export default CTA;
