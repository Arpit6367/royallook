"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

// Brand Colors
const primaryColor = "#5C1F1C";
const accentColor = "#FFC727";
const white = "#FFFFFF";
const fontFamily = "'Poppins', 'Montserrat', 'Nunito', sans-serif";

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const { ref: statsRef, inView: statsInView } = useInView({ threshold: 0.3, triggerOnce: true });

  const testimonials = [
    {
      id: 1,
      name: "Janina budi",
      role: "Faye's mother",
      rating: 5,
      content:
        "Prashant has been a fantastic chess coach for our son over three years—patient, kind, and dedicated. He builds trust, provides honest feedback, and teaches that true progress comes from dedication and learning from failures. Thank you for these life lessons!",
      image: "/demo-priya.jpg",
    },
    {
      id: 2,
      name: "Jayasree Chettipilli",
      role: "Mother of Rhea and Jay",
      rating: 5,
      content:
        "For 1.5 years, Prashant Sir has been an exceptional home chess coach for Rhea and Jay. Patient and friendly, he makes learning fun—especially for playful Jay—while focusing on enjoyment over winning. With milestone treats and genuine encouragement, he's boosted their confidence and skills, leading to tournament wins in the US and India. Highly recommended!",
      image: "/demo-rohan.jpg",
    },
    {
      id: 3,
      name: "Shanthi",
      role: "Mother of student",
      rating: 5,
      content:
        "An excellent chess coach who focuses on building strong fundamentals. He explains ideas step by step and makes learning enjoyable. My child looks forward to every class and has shown improvement in focus, planning, and decision-making. His teaching style is calm, disciplined, and motivating. Very trustworthy and committed.",
      image: "/demo-ananya.jpg",
    },
    {
      id: 4,
      name: "Praveen",
      role: "Intermediate Player",
      rating: 5,
      content:
        "We are very happy with our chess coach. He is patient, knowledgeable, and explains concepts in a very clear and structured way. My child’s understanding of chess, especially strategic thinking, has improved noticeably. He encourages logical thinking and confidence, not just winning games. We truly appreciate his dedication and highly recommend him.",
      image: "/demo-ananya.jpg",
    },
  ];

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 3) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Manual navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 3) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 3 + testimonials.length) % testimonials.length);
  };

  const visibleTestimonials = [
    ...testimonials.slice(currentIndex),
    ...testimonials.slice(0, currentIndex),
  ].slice(0, 3);

  return (
    <>
      {/* Embedded Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 199, 39, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 199, 39, 0.6); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
        .animate-pulseGlow { animation: pulseGlow 2s infinite ease-in-out; }
      `}</style>

      <section
        className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden"
        style={{ fontFamily }}
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Gradient Heading */}
          <div className="text-center mb-10 sm:mb-12 lg:mb-16 animate-fadeInUp">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-[#5C1F1C] to-[#8B4513] bg-clip-text text-transparent"
            >
              Student Success Stories
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Real students, real progress. See how ChessPure Academy transforms beginners into champions.
            </p>
          </div>

          {/* Auto-Rotating Carousel - Responsive */}
          <div className="relative max-w-6xl mx-auto mb-12 sm:mb-16" ref={testimonialsRef}>
            {/* Carousel Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {visibleTestimonials.map((testimonial, idx) => (
                <Card
                  key={`${testimonial.id}-${currentIndex}`}
                  className={`
                    bg-gradient-to-b from-[#5C1F1C] to-[#4A1815] 
                    text-white border border-amber-300/30 
                    p-4 sm:p-6 transition-all duration-700 
                    hover:scale-105 hover:shadow-2xl 
                    hover:shadow-amber-500/30 
                    animate-slideIn
                  `}
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  <CardContent className="p-0">
                    {/* Stars */}
                    <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <div className="relative mb-3 sm:mb-5">
                      <Quote className="absolute -top-2 -left-1 sm:-top-3 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 text-amber-400/30" />
                      <p className="text-amber-50 italic pl-5 sm:pl-6 leading-relaxed text-xs sm:text-sm line-clamp-4 sm:line-clamp-none">
                        "{testimonial.content}"
                      </p>
                    </div>

                    {/* Avatar + Name */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-lg animate-pulseGlow">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                        {/* Fallback Initial */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                          {testimonial.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm sm:text-base line-clamp-1">
                          {testimonial.name}
                        </h4>
                        <p className="text-amber-200 text-xs line-clamp-1">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Navigation Arrows - Mobile & Desktop */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 bg-white/90 hover:bg-white text-[#5C1F1C] p-1.5 sm:p-2 rounded-full shadow-lg transition-all hover:scale-110 lg:hidden sm:block"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 bg-white/90 hover:bg-white text-[#5C1F1C] p-1.5 sm:p-2 rounded-full shadow-lg transition-all hover:scale-110 lg:hidden sm:block"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
              {[...Array(Math.ceil(testimonials.length / 3))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i * 3)}
                  className={`transition-all duration-300 rounded-full ${
                    Math.floor(currentIndex / 3) === i
                      ? "bg-amber-500 w-6 sm:w-8 h-2"
                      : "bg-gray-400 w-2 h-2"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}