"use client";

import { useState, useEffect } from "react";
import FilterTab from "./_components/filter-tab";
import { Search, MapPin, Star, Calendar, Users, ArrowRight, Sparkles, Globe, Heart, Shield } from "lucide-react";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const floatingElements = [
    { icon: <Star className="w-5 h-5" />, delay: 0, duration: 3, x: 10, y: 20 },
    { icon: <MapPin className="w-5 h-5" />, delay: 1, duration: 4, x: 85, y: 15 },
    { icon: <Calendar className="w-5 h-5" />, delay: 2, duration: 3.5, x: 15, y: 70 },
    { icon: <Users className="w-5 h-5" />, delay: 1.5, duration: 4.5, x: 80, y: 75 },
    { icon: <Heart className="w-5 h-5" />, delay: 0.5, duration: 3.2, x: 25, y: 45 },
    { icon: <Shield className="w-5 h-5" />, delay: 2.5, duration: 3.8, x: 70, y: 35 },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Video/Background Section */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/80 to-pink-900/70" />
        
        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="7"/%3E%3Ccircle cx="53" cy="7" r="7"/%3E%3Ccircle cx="30" cy="30" r="7"/%3E%3Ccircle cx="7" cy="53" r="7"/%3E%3Ccircle cx="53" cy="53" r="7"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        </div>

        {/* Hero Image with Parallax */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <img
            className="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
            alt="Luxury property background"
          />
        </div>

        {/* Floating Animated Elements */}
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className="absolute text-white/20 animate-float"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
              {element.icon}
            </div>
          </div>
        ))}

        {/* Mouse-following Light Effect */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.3) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10">
        {/* Top Stats Bar */}
        <div className="border-b border-white/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap justify-center gap-8 text-white text-sm">
              {[
                { icon: <Globe className="w-4 h-4" />, text: "500+ Properties Worldwide" },
                { icon: <Star className="w-4 h-4" />, text: "4.9 Average Rating" },
                { icon: <Users className="w-4 h-4" />, text: "50K+ Happy Guests" },
                { icon: <Shield className="w-4 h-4" />, text: "100% Secure Booking" },
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-white/80">{stat.icon}</span>
                  <span>{stat.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Hero Section */}
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center text-white max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Experience Luxury Like Never Before</span>
            </div>

            {/* Main Heading with Gradient */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Discover Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Perfect Escape
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              From luxurious hotels to cozy homes, find your ideal stay across Ethiopia. 
              Book with confidence and create memories that last a lifetime.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {[
                "Best Price Guarantee",
                "24/7 Customer Support", 
                "Free Cancellation",
                "Verified Properties"
              ].map((trust, index) => (
                <div key={index} className="flex items-center gap-2 text-white/70 text-sm">
                  <div className="w-1 h-1 bg-green-400 rounded-full" />
                  {trust}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                <span className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Browse Properties
                </span>
              </button>
            </div>
          </div>

          {/* Search Card - Glassmorphism */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-white/20 to-transparent">
                <FilterTab />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {[
              { name: "Addis Ababa", icon: <MapPin className="w-4 h-4" /> },
              { name: "Bahir Dar", icon: <MapPin className="w-4 h-4" /> },
              { name: "Lalibela", icon: <MapPin className="w-4 h-4" /> },
              { name: "Gonder", icon: <MapPin className="w-4 h-4" /> },
              { name: "Hawassa", icon: <MapPin className="w-4 h-4" /> },
            ].map((location, index) => (
              <button
                key={index}
                className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all duration-300"
              >
                {location.icon}
                <span className="text-sm">{location.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
