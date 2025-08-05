"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t, ready } = useTranslation("common");

  // Show loading state while translations are being loaded
  if (!ready) {
    return (
      <section id="about" className="py-20 relative overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-purple-500/5 to-transparent"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-blue-600/20 via-purple-600/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-gradient-to-t from-purple-500/15 via-blue-500/10 to-transparent rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Text Section */}
            <div>
              <div className="h-10 bg-muted rounded animate-pulse mb-6" />
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Stats Section */}
              <div className="mt-8 flex items-center space-x-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-8 bg-muted rounded w-16 animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Animated Image Section */}
            <div className="mt-12 lg:mt-0">
              <div className="relative">
                <div className="w-full h-80 bg-muted rounded-2xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-purple-500/5 to-transparent"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-blue-600/20 via-purple-600/15 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-gradient-to-t from-purple-500/15 via-blue-500/10 to-transparent rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Text Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6 dark:text-white">
              {t("homepage.about.title")}
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed dark:text-gray-300">
              <p>{t("homepage.about.description.paragraph1")}</p>
              <p>{t("homepage.about.description.paragraph2")}</p>
              <p>{t("homepage.about.description.paragraph3")}</p>
            </div>

            {/* Stats Section */}
            <div className="mt-8 flex items-center space-x-8">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {t("homepage.about.stats.families.number")}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t("homepage.about.stats.families.label")}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {t("homepage.about.stats.stories.number")}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t("homepage.about.stats.stories.label")}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {t("homepage.about.stats.satisfaction.number")}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t("homepage.about.stats.satisfaction.label")}
                </div>
              </div>
            </div>
          </div>

          {/* Right Animated Image Section */}
          <div className="mt-12 lg:mt-0">
            <div className="relative">
              <Image
                src="/assets/family-animated.gif"
                alt="Animated family exploring heritage together"
                width={600}
                height={400}
                className="w-full rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
