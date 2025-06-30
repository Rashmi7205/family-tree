import { HeroSectionInner } from "./HeroSectionInner";
import SearchComponent from "./SearchComponent";

<div className="relative">
  <HeroSectionInner
    title="Discover Your Heritage"
    subtitle={{
      regular: "Explore your family history with ",
      gradient: "interactive genealogy tools.",
    }}
    description="Connect with your ancestors, build comprehensive family trees, and preserve your family's legacy for future generations through our advanced genealogy platform."
    ctaText="Start Your Journey"
    ctaHref="/trees"
    bottomImage={{
      light: "/assets/light-view.png",
      dark: "/assets/dark-view.png",
    }}
  />

  {/* Search Component positioned in hero */}
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 mt-20">
    <SearchComponent />
  </div>
</div>;
