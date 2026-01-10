"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Brain, Target, Lightbulb, Zap, BookOpen, Trophy, Sparkles } from "lucide-react";

// Brand Colors & Styles
const bgWarm = "#FDFBF7";
const primaryColor = "#5C1F1C"; // Dark Red
const accentColor = "#E76F51";  // Burnt Orange
const goldColor = "#FFDA44";    // Golden Yellow
const fontFamily = "'Poppins', 'Montserrat', 'Nunito', sans-serif";

const smallBenefits = [
  { icon: Brain, title: "Develops Memory", color: "text-[#E76F51]" },
  { icon: Target, title: "Logical Thinking", color: "text-[#2A9D8F]" },
  { icon: Zap, title: "Concentration", color: "text-[#E9C46A]" },
  { icon: Lightbulb, title: "Creativity", color: "text-[#F4A261]" },
  { icon: BookOpen, title: "School Grades", color: "text-[#264653]" },
];

const detailedBenefits = [
  {
    icon: Trophy,
    title: "Develops Memory",
    description: "Chess requires players to remember moves, patterns, and strategies, significantly boosting memory retention.",
    bg: "bg-[#5C1F1C]/5",
    border: "border-[#5C1F1C]/10",
    iconBg: "bg-[#5C1F1C]/10",
    iconColor: "text-[#5C1F1C]",
  },
  {
    icon: Target,
    title: "Logical Thinking",
    description: "Players analyze positions and anticipate opponent moves, fostering critical logical reasoning skills.",
    bg: "bg-[#E76F51]/5",
    border: "border-[#E76F51]/10",
    iconBg: "bg-[#E76F51]/10",
    iconColor: "text-[#E76F51]",
  },
  {
    icon: Zap,
    title: "Improves Concentration",
    description: "The intense focus required to play chess helps children block out distractions and maintain mental clarity.",
    bg: "bg-[#F4A261]/5",
    border: "border-[#F4A261]/10",
    iconBg: "bg-[#F4A261]/10",
    iconColor: "text-[#F4A261]",
  },
  {
    icon: Lightbulb,
    title: "Imagination & Creativity",
    description: "Chess sparks creativity as players envision strategic possibilities and devise innovative plans on the board.",
    bg: "bg-[#2A9D8F]/5",
    border: "border-[#2A9D8F]/10",
    iconBg: "bg-[#2A9D8F]/10",
    iconColor: "text-[#2A9D8F]",
  },
  {
    icon: Brain,
    title: "Problem Solving",
    description: "Every game is a puzzle. Kids learn to evaluate options and make decisions under pressure, a vital life skill.",
    bg: "bg-[#264653]/5",
    border: "border-[#264653]/10",
    iconBg: "bg-[#264653]/10",
    iconColor: "text-[#264653]",
  },
];

export function WhyChessForKids() {
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
        }
      },
      { threshold: 0.2 }
    );

    const el = document.getElementById("why-chess-section");
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
  };

  return (
    <section
      id="why-chess-section"
      className="py-20 lg:py-24 overflow-hidden relative"
      style={{ backgroundColor: bgWarm, fontFamily }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E76F51]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFDA44]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#E6E0D4] mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#E76F51]" />
            <span className="text-sm font-bold text-[#2D2A26] tracking-wide uppercase">Benefits of Chess</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2D2A26] mb-6 leading-tight"
          >
            Why Chess <span className="text-[#E76F51]">for Kids?</span>
            <div className="h-2 w-24 bg-[#FFDA44] mx-auto mt-4 rounded-full" />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#5C5852] text-lg max-w-2xl mx-auto"
          >
            More than just a game, chess is a powerful tool for intellectual growth, character building, and life skills.
          </motion.p>
        </div>

        {/* Small Benefit Icons Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-20 max-w-6xl mx-auto"
        >
          {smallBenefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-[#E6E0D4] shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="mb-4 p-3 bg-[#FDFBF7] rounded-full group-hover:bg-[#FFDA44]/20 transition-colors">
                  <Icon className={`w-6 h-6 ${b.color}`} />
                </div>
                <p className="text-sm font-bold text-[#2D2A26] leading-tight">
                  {b.title}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Detailed Benefit Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {detailedBenefits.map((b, i) => {
            const Icon = b.icon;
            // Span 2 columns for the last item if odd count, for balance
            const isLast = i === detailedBenefits.length - 1;

            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`h-full ${isLast ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className={`
                    h-full relative overflow-hidden rounded-[2rem] p-8 border-2 transition-all duration-500
                    ${b.bg} hover:shadow-xl group
                    hover:border-transparent border-[#E6E0D4]
                  `}>

                  {/* Hover Gradient Background */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-white ${b.bg.replace('/5', '/20')}`} />

                  <div className="relative z-10 flex flex-col items-start gap-5">
                    <div className={`p-4 rounded-2xl ${b.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${b.iconColor}`} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-[#2D2A26] mb-3 group-hover:text-[#5C1F1C] transition-colors">
                        {b.title}
                      </h3>
                      <p className="text-[#5C5852] leading-relaxed font-medium text-sm">
                        {b.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}