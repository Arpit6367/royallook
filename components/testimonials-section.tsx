"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Brand Colors
const bgWarm = "#FDFBF7";
const primaryColor = "#5C1F1C";
const accentColor = "#E76F51";

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Janina Budi",
      role: "Faye's mother",
      rating: 5,
      content:
        "Prashant has been a fantastic chess coach for our son over three years—patient, kind, and dedicated. He builds trust, provides honest feedback, and teaches that true progress comes from dedication and learning from failures.",
      image: "/demo-priya.jpg",
    },
    {
      id: 2,
      name: "Jayasree Chettipilli",
      role: "Mother of Rhea and Jay",
      rating: 5,
      content:
        "Patient and friendly, he makes learning fun—especially for playful Jay—while focusing on enjoyment over winning. With milestone treats and genuine encouragement, he's boosted their confidence and skills, leading to tournament wins!",
      image: "/demo-rohan.jpg",
    },
    {
      id: 3,
      name: "Shanthi",
      role: "Mother of Student",
      rating: 5,
      content:
        "An excellent chess coach who focuses on building strong fundamentals. My child looks forward to every class and has shown improvement in focus, planning, and decision-making. His teaching style is calm, disciplined, and motivating.",
      image: "/demo-ananya.jpg",
    },
    {
      id: 4,
      name: "Praveen",
      role: "Intermediate Player",
      rating: 5,
      content:
        "Patient, knowledgeable, and explains concepts in a very clear and structured way. My child’s understanding of chess, especially strategic thinking, has improved noticeably. We truly appreciate his dedication.",
      image: "/demo-ananya.jpg",
    },
  ];

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    let newIndex = currentIndex + newDirection;
    if (newIndex < 0) newIndex = testimonials.length - 1;
    if (newIndex >= testimonials.length) newIndex = 0;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => paginate(1);
  const prevSlide = () => paginate(-1);

  // Determine visible slides (showing 3 at a time on desktop)
  const getVisibleTestimonials = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      items.push(testimonials[index]);
    }
    return items;
  };

  const visibleItems = getVisibleTestimonials();

  return (
    <section className="py-20 lg:py-28 overflow-hidden relative" style={{ backgroundColor: bgWarm }}>

      {/* Decorative Background */}
      <div className="absolute top-1/2 left-10 w-40 h-40 bg-[#FFDA44]/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/3 right-10 w-64 h-64 bg-[#E76F51]/5 rounded-full blur-3xl" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#E6E0D4] mb-6"
          >
            <MessageCircle className="w-4 h-4 text-[#E76F51]" />
            <span className="text-sm font-bold text-[#2D2A26] tracking-wide uppercase">Real Stories</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2D2A26] mb-6 leading-tight"
          >
            Student <span className="text-[#E76F51]">Reviews</span>
            <div className="h-2 w-24 bg-[#FFDA44] mx-auto mt-4 rounded-full" />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#5C5852] text-lg max-w-2xl mx-auto"
          >
            Hear from parents and students who have experienced the transformative power of Royal Look Academy.
          </motion.p>
        </div>

        {/* Testimonials Grid/Carousel */}
        <div className="relative">
          {/* Navigation Buttons (Desktop Outside) */}
          <button
            onClick={prevSlide}
            className="hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-[#E6E0D4] items-center justify-center text-[#2D2A26] hover:scale-110 hover:bg-[#FFDA44] transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden lg:flex absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-[#E6E0D4] items-center justify-center text-[#2D2A26] hover:scale-110 hover:bg-[#FFDA44] transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              {visibleItems.map((testimonial, idx) => (
                <motion.div
                  key={`${testimonial.id}-${currentIndex}`} // Unique key to force re-render on cycle
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="h-full"
                >
                  <Card className="h-full bg-white border border-[#E6E0D4] rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                    <CardContent className="p-8 flex flex-col h-full relative">
                      {/* Decorative Quote Icon */}
                      <div className="absolute top-6 right-6 text-[#FFDA44]/20 group-hover:text-[#FFDA44]/40 transition-colors">
                        <Quote className="w-16 h-16 fill-current" />
                      </div>

                      {/* Stars */}
                      <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-[#FFDA44] text-[#FFDA44]" />
                        ))}
                      </div>

                      {/* Content */}
                      <div className="flex-grow mb-6 relative z-10">
                        <p className="text-[#5C5852] leading-relaxed font-medium italic">
                          "{testimonial.content}"
                        </p>
                      </div>

                      {/* Author */}
                      <div className="flex items-center gap-4 mt-auto pt-6 border-t border-[#E6E0D4]/50">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#FFDA44]">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#2D2A26]">{testimonial.name}</h4>
                          <p className="text-xs text-[#E76F51] font-bold uppercase tracking-wide">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Mobile Nav */}
          <div className="flex lg:hidden justify-center gap-4 mt-8">
            <button onClick={prevSlide} className="w-10 h-10 bg-white rounded-full shadow border flex items-center justify-center active:scale-95"><ChevronLeft /></button>
            <button onClick={nextSlide} className="w-10 h-10 bg-white rounded-full shadow border flex items-center justify-center active:scale-95"><ChevronRight /></button>
          </div>
        </div>

      </div>
    </section>
  );
}