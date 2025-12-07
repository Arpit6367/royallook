"use client";

import { Button } from "@/components/ui/button";
import { Users, Trophy, Star, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

// IMAGES FOR SLIDER (ADD YOUR OWN URLs)
const sliderImages = [
  "/gallery1.avif",
  "/gallery2.jpg",
  "/gallery6.jpg",
  "/gallery4.jpg",
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-change images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % sliderImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-screen pt-30 flex items-center justify-center overflow-hidden py-15"
      style={{ background: "#FFFFFF", fontFamily: "'Poppins','Montserrat','Nunito',sans-serif" }}
    >
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* LEFT SIDE — YOUR ORIGINAL CONTENT */}
          <HeroLeft />

          {/* 🔥 RIGHT SIDE — NEW IMAGE SLIDER 🔥 */}
          <div className="flex justify-center lg:justify-end animate-fade-in-up">
            <div
              className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-xl border-4"
              style={{
                borderColor: "#5C1F1C",
                boxShadow: "0 12px 36px rgba(92,31,28,0.25)",
              }}
            >
              {sliderImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="slider"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                  style={{
                    opacity: index === currentIndex ? 1 : 0,
                    transform: index === currentIndex ? "scale(1.05)" : "scale(1)",
                  }}
                />
              ))}

              {/* GOLD OVERLAY GRADIENT */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#5C1F1C55] to-transparent"></div>

              {/* BORDER GLOW */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  boxShadow: "0 0 25px rgba(255,199,39,0.35) inset",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fade + Zoom Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(60px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1000ms ease-out forwards;
        }
      `}</style>
    </section>
  );
}

/* LEFT SIDE (Remaining same) */
function HeroLeft() {
  const primaryColor = "#5C1F1C";
  const accentColor = "#FFC727";
  const white = "#FFFFFF";
  const textDark = "#74292F";
  const fontFamily = "'Poppins','Montserrat','Nunito',sans-serif";

  return (
    <div className="text-center lg:text-left animate-fade-in">
      <div className="inline-flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-md border border-gray-200">
        <Star className="w-4 h-4" style={{ color: accentColor }} />
        <span>Certified FIDE Coaches</span>
        <Sparkles className="w-3 h-3" style={{ color: primaryColor }} />
      </div>

      <div className="flex justify-center lg:justify-start mt-2 mb-4">
        <span
          style={{
            fontWeight: 600,
            color: primaryColor,
            background: accentColor,
            borderRadius: "999px",
            fontSize: "1rem",
            padding: "0.2rem 1rem",
            marginRight: 8,
            letterSpacing: 1,
            fontFamily,
            boxShadow: "0 2px 6px #FFC72744",
          }}
        >
          Academy
        </span>
      </div>

      <h2
        className="mt-2 mb-4 text-3xl sm:text-4xl lg:text-5xl leading-tight font-bold"
        style={{ color: primaryColor, fontFamily }}
      >
        Master the Game, Conquer the Board
      </h2>

      <p className="mb-6 text-base sm:text-lg" style={{ color: textDark }}>
        Chesspure academy empowers you with world-class training from FIDE-rated coaches.
        Build unshakeable skills, dominate the board, and rise to the top of the chess world.
      </p>

      <div className="flex justify-center lg:justify-start mb-6">
        <Link href="" target="_blank">
          <Button
            size="lg"
            className="px-8 py-4 text-lg"
            style={{
              background: primaryColor,
              color: white,
              fontWeight: 800,
              borderRadius: "999px",
              fontFamily,
              boxShadow: "0 2px 16px rgba(92,31,28,0.20)",
            }}
          >
            <Users className="mr-2" /> Join Our Online Coaching
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
        <StatCard
          bg={white}
          icon={<Trophy size={24} />}
          label="Tournaments"
          value="120+"
          textColor={primaryColor}
          iconBg={accentColor}
          border={`2px solid ${accentColor}`}
        />
        <StatCard
          bg={accentColor}
          icon={<Users size={24} />}
          label="Students"
          value="600+"
          textColor={primaryColor}
          iconBg={primaryColor}
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg, textColor, iconBg, border }) {
  const fontFamily = "'Poppins','Montserrat','Nunito',sans-serif";
  return (
    <div
      className="flex items-center gap-3 py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform"
      style={{
        background: bg,
        color: textColor,
        fontFamily,
        minWidth: "180px",
        border: border || "none",
      }}
    >
      <div
        className="flex items-center justify-center rounded-full p-1"
        style={{ background: iconBg, width: 40, height: 40 }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: "1.3rem", lineHeight: 1 }}>{value}</div>
        <div style={{ fontWeight: 500, fontSize: "0.95rem", opacity: 0.9 }}>{label}</div>
      </div>
    </div>
  );
}
