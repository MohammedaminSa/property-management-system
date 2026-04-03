"use client";

import FilterTab from "./_components/filter-tab";

const HeroSection = () => {
  return (
    <div className="relative w-full overflow-hidden min-h-[600px]">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          className="object-cover w-full h-full"
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
          alt="Property background"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 container mx-auto px-4 py-16 md:py-24">
        <div className="text-center text-white max-w-4xl mx-auto mb-12">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Find Your Perfect Stay, Anywhere
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Discover cozy properties across Ethiopia. Compare prices and book in just a few clicks.
          </p>
        </div>

        {/* Floating Search Box with Animation */}
        <div className="max-w-5xl mx-auto">
          <div 
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{
              animation: 'floatLeftRight 4s ease-in-out infinite'
            }}
          >
            <FilterTab />
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

      {/* Global CSS Animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes floatLeftRight {
            0%, 100% {
              transform: translateX(0px) translateY(0px);
            }
            25% {
              transform: translateX(10px) translateY(-5px);
            }
            50% {
              transform: translateX(0px) translateY(-10px);
            }
            75% {
              transform: translateX(-10px) translateY(-5px);
            }
          }
        `
      }} />
    </div>
  );
};

export default HeroSection;
