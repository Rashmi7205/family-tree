import { CTASection } from "./CtaWithGlow";

const CTA = () => {
  return (
    <CTASection
      id="cta"
      title="Start Building Your Family Tree Today"
      action={{
        text: "Get Started",
        href: "/auth/signup",
        variant: "default",
      }}
      className="bg-background"
    />
  );
};

export default CTA;
