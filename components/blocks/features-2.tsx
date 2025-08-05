"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export function Features() {
  const { t, ready } = useTranslation("common");

  // Show loading state while translations are being loaded
  if (!ready) {
    return (
      <section id="features" className="py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="h-12 bg-muted rounded animate-pulse mb-4" />
            <div className="h-6 bg-muted rounded w-3/4 mx-auto animate-pulse" />
          </div>
          <div className="mx-auto mt-8 flex flex-col gap-6 md:flex-row md:flex-wrap md:justify-center md:items-stretch md:mt-16">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="group border-0 bg-muted shadow-none flex-1 flex flex-col items-center justify-between max-w-sm mx-auto md:mx-0 min-w-[220px] p-6"
              >
                <div className="w-14 h-14 bg-muted rounded-full animate-pulse mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="features" className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            {t("homepage.features.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t("homepage.features.subtitle")}
          </p>
        </div>
        <div className="mx-auto mt-8 flex flex-col gap-6 md:flex-row md:flex-wrap md:justify-center md:items-stretch md:mt-16">
          <FeatureCard
            imgSrc="/assets/family-tree.png"
            title={t("homepage.features.cards.treeBuilding.title")}
            description={t("homepage.features.cards.treeBuilding.description")}
          />
          <FeatureCard
            imgSrc="/assets/picture.png"
            title={t("homepage.features.cards.memories.title")}
            description={t("homepage.features.cards.memories.description")}
          />
          <FeatureCard
            imgSrc="/assets/invite.png"
            title={t("homepage.features.cards.collaborate.title")}
            description={t("homepage.features.cards.collaborate.description")}
          />
          <FeatureCard
            imgSrc="/assets/export-file.png"
            title={t("homepage.features.cards.export.title")}
            description={t("homepage.features.cards.export.description")}
          />
          <FeatureCard
            imgSrc="/assets/responsive.png"
            title={t("homepage.features.cards.responsive.title")}
            description={t("homepage.features.cards.responsive.description")}
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  imgSrc,
  title,
  description,
}: {
  imgSrc: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="group border-0 bg-muted shadow-none flex-1 flex flex-col items-center justify-between max-w-sm mx-auto md:mx-0 min-w-[220px] transition-transform duration-200 hover:scale-105 hover:shadow-xl">
      <CardHeader className="pb-3 flex flex-col items-center">
        <CardImageDecorator imgSrc={imgSrc} />
        <h3 className="mt-6 font-medium text-lg text-center">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

const CardImageDecorator = ({ imgSrc }: { imgSrc: string }) => (
  <div
    aria-hidden
    className="relative mx-auto size-12 md:size-14 rounded-full overflow-hidden shadow-lg border border-border bg-background flex items-center justify-center"
  >
    <Image src={imgSrc} alt="Feature" fill className="object-contain p-2" />
  </div>
);
