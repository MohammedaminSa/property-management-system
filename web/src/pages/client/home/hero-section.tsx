"use client";

import { useState, useEffect } from "react";
import FilterTab from "./_components/filter-tab";
import { Search, MapPin, Star, Users, ArrowRight, Sparkles, Globe, Shield } from "lucide-react";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generate floating particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
  }));

  // Generate glowing orbs
  const orbs = [
    { id: 1, left: "10%", top: "20%", size: 300, color: "from-blue-500/30 to-purple-500/30", delay: 0 },
    { id: 2, left: "70%", top: "60%", size: 400, color: "from-pink-500/30 to-orange-500/30", delay: 2 },
    { id: 3, left: "40%", top: "80%", size: 350, color: "from-cyan-500/30 to-blue-500/30", delay: 4 },
  ];

  return (
    <div className="relative w-full overflow-hidden min-h-[700px]" id="hero-section">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/20 animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {orbs.map((orb) => (
          <div
            key={orb.id}
            className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl animate-pulse-glow`}
            style={{
              left: orb.left,
              top: orb.top,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              animationDelay: `${orb.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

      {/* Hero Content */}
      <div className="relative z-10">
        {/* Top Stats Bar - Glassmorphism */}
        <div className="border-b border-white/10 backdrop-blur-md bg-white/5">
          <div className="container mx-auto px-4 py-4">
            <div className={`flex flex-wrap justify-center gap-8 text-white text-sm ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
              {[
                { icon: <Globe className="w-4 h-4" />, text: "500+ Properties Worldwide" },
                { icon: <Star className="w-4 h-4" />, text: "4.9 Average Rating" },
                { icon: <Users className="w-4 h-4" />, text: "50K+ Happy Guests" },
                { icon: <Shield className="w-4 h-4" />, text: "100% Secure Booking" },
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 hover:scale-110 transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-yellow-300">{stat.icon}</span>
                  <span className="font-medium">{stat.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Hero Section */}
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center text-white max-w-4xl mx-auto">
            {/* Badge with Glassmorphism */}
            <div 
              className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.2s' }}
            >
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                Experience Luxury Like Never Before
              </span>
            </div>

            {/* Main Heading with Animated Gradient */}
            <h1 
              className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.4s' }}
            >
              <span className="block bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-gradient">
                Discover Your
              </span>
              <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent animate-gradient mt-2">
                Perfect Escape
              </span>
            </h1>

            {/* Subtitle with Glassmorphism */}
            <p 
              className={`text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.6s' }}
            >
              From luxurious hotels to cozy homes, find your ideal stay across Ethiopia. 
              <span className="block mt-2 text-yellow-200 font-medium">Book with confidence and create memories that last a lifetime.</span>
            </p>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-6 justify-center mb-12 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.8s' }}
            >
              <button className="group relative bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-110 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                  Start Your Journey
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
              
              <button className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-full font-bold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-110 shadow-xl">
                <span className="flex items-center gap-3">
                  <Search className="w-6 h-6" />
                  Browse Properties
                </span>
              </button>
            </div>

            {/* Auth Buttons with Glassmorphism */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '1s' }}
            >
              <a 
                href="/auth/login" 
                className="bg-white/95 backdrop-blur-sm text-purple-900 px-8 py-3 rounded-full font-semibold text-base hover:bg-white transition-all duration-300 shadow-xl hover:scale-105"
              >
                Sign In
              </a>
              
              <a 
                href="/auth/signup" 
                className="bg-white/10 backdrop-blur-md text-white border-2 border-white/40 px-8 py-3 rounded-full font-semibold text-base hover:bg-white hover:text-purple-900 transition-all duration-300 shadow-xl hover:scale-105"
              >
                Register
              </a>
            </div>
          </div>

          {/* Search Card - Enhanced Glassmorphism */}
          <div 
            className={`max-w-5xl mx-auto ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: '1.2s' }}
          >
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]">
              <div className="p-1 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-purple-400/20">
                <FilterTab />
              </div>
            </div>
          </div>

          {/* Quick Links with Glassmorphism */}
          <div 
            className={`flex flex-wrap justify-center gap-4 mt-12 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: '1.4s' }}
          >
            {[
              { name: "Addis Ababa", icon: <MapPin className="w-4 h-4" /> },
              { name: "Bahir Dar", icon: <MapPin className="w-4 h-4" /> },
              { name: "Lalibela", icon: <MapPin className="w-4 h-4" /> },
              { name: "Gonder", icon: <MapPin className="w-4 h-4" /> },
              { name: "Hawassa", icon: <MapPin className="w-4 h-4" /> },
            ].map((location, index) => (
              <button
                key={index}
                className="flex items-center gap-2 text-white/80 hover:text-white bg-white/10 backdrop-blur-md hover:bg-white/20 px-6 py-3 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40 shadow-lg hover:scale-110"
                style={{ animationDelay: `${1.5 + index * 0.1}s` }}
              >
                <span className="text-yellow-300">{location.icon}</span>
                <span className="text-sm font-medium">{location.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};

export default HeroSection;
