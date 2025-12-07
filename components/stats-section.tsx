"use client";

import { useEffect, useState } from "react";
import { Users, Award, GraduationCap, Gamepad2 } from "lucide-react";
import Image from "next/image";

const bgBeige = "#FAF6E9";
const accentGold = "#FFC727";
const fontFamily = "'Poppins', 'Montserrat', 'Nunito', sans-serif";

interface StatItem {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  iconGrad: string;
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const slideshowImages = [
    "/gallery1.avif",
    "/gallery4.jpg",
    "/gallery2.webp",
    "/gallery6.jpg",
  ];

  // Auto change image
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) =>
        prev === slideshowImages.length - 1 ? 0 : prev + 1
      );
    }, 3000); // change every 3 seconds

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );
    const el = document.getElementById("stats-section");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats: StatItem[] = [
    {
      value: "1000",
      label: "Happy Students",
      suffix: "+",
      icon: <Users className="w-10 h-10" />,
      iconGrad: "from-amber-500 to-yellow-400",
    },
    {
      value: "50",
      label: "Tournament Champions",
      suffix: "+",
      icon: <Award className="w-10 h-10" />,
      iconGrad: "from-yellow-500 to-amber-400",
    },
    {
      value: "15",
      label: "FIDE Rated Coaches",
      suffix: "+",
      icon: <GraduationCap className="w-10 h-10" />,
      iconGrad: "from-amber-600 to-yellow-500",
    },
    {
      value: "2000",
      label: "Training Games",
      suffix: "+",
      icon: <Gamepad2 className="w-10 h-10" />,
      iconGrad: "from-yellow-400 to-amber-500",
    },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes fade-scale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-scale {
          animation: fade-scale 0.6s ease-out forwards;
        }

        .fade-image {
          transition: opacity 0.8s ease-in-out;
        }
      `}</style>

      <section
        id="stats-section"
        className="py-12 sm:py-16 lg:py-24 relative overflow-hidden"
        style={{ backgroundColor: bgBeige, fontFamily }}
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-amber-700 text-sm uppercase tracking-widest mb-2">
              Achievements
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#5C1F1C]">
              Our Achievements
            </h2>
            <p className="text-gray-700 mt-3 max-w-xl mx-auto">
              Join thousands of students who’ve transformed their game with our coaching.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`bg-[#5C1F1C] text-center rounded-2xl p-6 border border-amber-200/30 transform transition hover:scale-105 hover:shadow-xl ${
                    isVisible ? "animate-fade-scale" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r ${stat.iconGrad} ring-4 ring-amber-400/40`}
                  >
                    {stat.icon}
                  </div>

                  <div className="text-4xl font-bold text-white">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-amber-500 ml-1">{stat.suffix}</span>
                    )}
                  </div>

                  <p className="text-white text-sm mt-2">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE: Fading slideshow */}
            <div className="relative w-full max-w-md h-[350px] sm:h-[400px] overflow-hidden rounded-2xl shadow-2xl mx-auto lg:mx-0">

              {slideshowImages.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt="slideshow"
                  width={600}
                  height={400}
                  className={`absolute inset-0 w-full h-full object-cover fade-image ${
                    index === currentImage ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

            </div>

          </div>
        </div>
      </section>
    </>
  );
}
