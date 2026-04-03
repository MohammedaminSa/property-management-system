"use client";

import { useState, useEffect } from "react";
import FilterTab from "./_components/filter-tab";

const backgroundImages = [
  "https://images.unsplash.com/photo-1561501900-3701fa6a0864?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwaG90ZWx8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.1.0&auto=format&fit=crop&w=2940&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.1.0&auto=format&fit=crop&w=2940&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.1.0&auto=format&fit=crop&w=2940&q=80"
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative flex flex-col items-center justify-center min-h-[480px] md:min-h-[520px]">
      {/* Background Images with Fade Transition */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundImages.map((image, index) => (
          <img
            key={index}
            className={`object-cover w-full h-full absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            alt="Property background"
            src={image}
          />
        ))}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Hero Text */}
      <div className="relative z-10 text-center px-4 mb-6">
        <h1 className="font-bold text-3xl md:text-4xl text-white mb-2 drop-shadow">
          Find Your Perfect Stay, Anywhere
        </h1>
        <p className="text-white/80 text-sm md:text-base max-w-lg mx-auto">
          Discover cozy properties across Ethiopia. Compare prices and book in just a few clicks.
        </p>
      </div>

      {/* Centered Search Box */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
        <FilterTab />
      </div>
    </div>
  );
};

export default HeroSection;
