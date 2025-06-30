import Image from "next/image";

const About = () => {
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
              Discover the Story of Your Family
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed dark:text-gray-300">
              <p>
                At{" "}
                <span className="font-semibold">
                  Durgadham Family Tree Explorer
                </span>
                , we believe every family has a story worth preserving. Our goal
                is to make it simple, beautiful, and meaningful for families to
                trace their heritage across generations.
              </p>
              <p>
                From uncovering long-lost connections to preserving cherished
                memories, we help you piece together the threads that weave your
                family's unique heritage — making it easy for future generations
                to understand where they came from.
              </p>
              <p>
                Whether you're starting your family tree for the first time or
                you're an experienced genealogist, our platform is built for
                you. We combine heritage, technology, and design so you can
                explore, save, and share your family's legacy.
              </p>
            </div>

            {/* Stats Section */}
            <div className="mt-8 flex items-center space-x-8">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  50K+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Families Connected
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  1M+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Stories Preserved
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  99%
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  User Satisfaction
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
