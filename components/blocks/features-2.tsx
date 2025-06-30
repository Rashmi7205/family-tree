import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { ReactNode } from "react";

export function Features() {
  return (
    <section id="features" className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Everything You Need to Build Your Legacy
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our platform provides powerful, intuitive tools to help you
            discover, preserve, and share your family's history.
          </p>
        </div>
        <div className="mx-auto mt-8 flex flex-col gap-6 md:flex-row md:flex-wrap md:justify-center md:items-stretch md:mt-16">
          <FeatureCard
            imgSrc="/assets/family-tree.png"
            title="Interactive Tree Building"
            description="Easily create and visualize your family tree with our intuitive drag-and-drop interface and dynamic zoom capabilities."
          />
          <FeatureCard
            imgSrc="/assets/picture.png"
            title="Preserve Rich Memories"
            description="Enrich your family history by adding photos, stories, and important memories for each member, creating a vivid archive."
          />
          <FeatureCard
            imgSrc="/assets/invite.png"
            title="Collaborate with Family"
            description="Invite family members to view and contribute to your shared tree, making it a collaborative and living project."
          />
          <FeatureCard
            imgSrc="/assets/export-file.png"
            title="Export Tree"
            description="Export your family tree in multiple formats including PDF and PNG for easy sharing and printing."
          />
          <FeatureCard
            imgSrc="/assets/responsive.png"
            title="Responsive Layout"
            description="Access and edit your family tree from any device with our fully responsive and mobile-friendly design."
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
