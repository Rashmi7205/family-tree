import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface HeroSectionInnerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: {
    regular: string;
    gradient: string;
  };
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  bottomImage?: {
    light: string;
    dark: string;
  };
  gridOptions?: {
    angle?: number;
    cellSize?: number;
    opacity?: number;
    lightLineColor?: string;
    darkLineColor?: string;
  };
}

const RetroGrid = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lightLineColor = "gray",
  darkLineColor = "gray",
}) => {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        `opacity-[var(--opacity)]`
      )}
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div className="animate-grid [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] [height:300vh] [inset:0%_0px] [margin-left:-200%] [transform-origin:100%_0_0] [width:600vw] dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black" />
    </div>
  );
};

const HeroSectionInner = React.forwardRef<
  HTMLDivElement,
  HeroSectionInnerProps
>(
  (
    {
      className,
      title = "Build products for everyone",
      subtitle = {
        regular: "Designing your projects faster with ",
        gradient: "the largest figma UI kit.",
      },
      description = "Sed ut perspiciatis unde omnis iste natus voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.",
      ctaText = "Browse courses",
      ctaHref = "#",
      bottomImage = {
        light: "/assets/light-view.png",
        dark: "/assets/dark-view.png",
      },
      gridOptions,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative md:pt-24", className)} ref={ref} {...props}>
        <div className="absolute top-0 z-[0] h-screen w-screen bg-purple-950/10 dark:bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <section className="relative max-w-full mx-auto z-1">
          <RetroGrid {...gridOptions} />
          <div className="max-w-screen-xl z-10 mx-auto px-3 sm:px-4 py-16 sm:py-20 md:py-24 lg:py-28 gap-6 sm:gap-8 md:gap-10 lg:gap-12 md:px-6 lg:px-8">
            <div className="space-y-3 sm:space-y-4 md:space-y-5 max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto text-center">
              <h1 className="text-xs sm:text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 w-fit mx-auto leading-tight">
                {title}
                <ChevronRight className="inline w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 duration-300" />
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-tight sm:leading-tight md:leading-tight lg:leading-tight pt-2">
                {subtitle.regular} <br/>
                <span className="block md:inline text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-[45px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 mt-1 sm:mt-2 md:mt-0 leading-tight sm:leading-tight md:leading-tight lg:leading-tight pt-2">
                  {subtitle.gradient}
                </span>
              </h2>
              <p className="max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed sm:leading-relaxed md:leading-relaxed">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4 z-99">
                <span className="relative inline-block overflow-hidden rounded-full p-[1.5px] w-full sm:w-auto">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white dark:bg-gray-950 text-xs font-medium backdrop-blur-3xl">
                    <a
                      href="/trees"
                      className="inline-flex rounded-full text-center group items-center w-full justify-center bg-gradient-to-tr from-zinc-300/20 via-purple-400/30 to-transparent dark:from-zinc-300/5 dark:via-purple-400/20 text-gray-900 dark:text-white border-input border-[1px] hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-purple-400/40 hover:to-transparent dark:hover:from-zinc-300/10 dark:hover:via-purple-400/30 transition-all py-2.5 sm:py-3 px-4 sm:px-6 md:py-4 md:px-8 lg:px-10 text-xs sm:text-sm md:text-base leading-tight"
                    >
                      {ctaText}
                    </a>
                  </div>
                </span>
              </div>
            </div>
            {bottomImage && (
              <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-28 mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10 relative z-10">
                <img
                  src={bottomImage.light}
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-full shadow-lg rounded-lg border border-gray-200 block dark:hidden mx-auto"
                  alt="Dashboard preview"
                />
                <img
                  src={bottomImage.dark}
                  className="hidden w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-full shadow-lg rounded-lg border border-gray-800 dark:block mx-auto"
                  alt="Dashboard preview"
                />
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }
);
HeroSectionInner.displayName = "HeroSectionInner";

export { HeroSectionInner };
