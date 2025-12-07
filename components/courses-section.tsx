"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Crown, Trophy, Zap, BookOpen, Target, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const primaryColor = "#5C1F1C"; // Dark Red
const accentColor = "#FFC727"; // Yellow
const orangeBg = "#FF6B35";    // Orange

const courses = [
  {
    level: "Beginner",
    icon: BookOpen,
    color: "text-blue-600",
    bgLight: "bg-blue-50",
    gradient: "from-blue-500 to-blue-600",
    title: "Foundations",
    description: "From zero knowledge to playing full games confidently.",
    topics: [
      "Introduction to board & pieces",
      "Piece Movements & Capturing",
      "Checkmate & Castling",
      "The Golden Rules of Opening",
      "Special moves: En Passant",
    ],
  },
  {
    level: "Intermediate",
    icon: Target,
    color: "text-purple-600",
    bgLight: "bg-purple-50",
    gradient: "from-purple-500 to-purple-600",
    title: "Tactical Mastery",
    description: "Master tactics, spot patterns, and stop blundering.",
    topics: [
      "Forks, Pins, & Skewers",
      "Discovered Attacks",
      "Eliminating the Defender",
      "Mate in Two Patterns",
      "Basic Endgames (King + Rook)",
    ],
  },
  {
    level: "Advanced",
    icon: Trophy,
    color: "text-amber-600",
    bgLight: "bg-amber-50",
    gradient: "from-amber-500 to-amber-700",
    title: "Strategic Depth",
    description: "Tournament-ready chess with deep planning.",
    topics: [
      "Complex Openings",
      "Breaching King Defences",
      "Pawn Structures & Majorities",
      "X-Ray Attacks & Interference",
      "Grandmaster Mini-Plans",
    ],
  },
];

export function CoursesSection() {
  return (
    <section className="relative w-full bg-slate-50 pb-24">
      {/* --- Decorative CSS --- */}
      <style jsx>{`
        .wave-fill { fill: ${orangeBg}; }
      `}</style>

      {/* --- Hero / Wave Header --- */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {/* Background Gradient */}
        <div 
          className="absolute inset-0 z-0" 
          style={{ background: `linear-gradient(135deg, ${orangeBg} 0%, #ff8f5e 100%)` }} 
        />

        {/* Floating Background Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <Crown className="absolute top-20 left-[10%] w-32 h-32 text-white animate-pulse" />
          <Zap className="absolute bottom-40 right-[15%] w-24 h-24 text-white rotate-12" />
          <Trophy className="absolute top-10 right-[30%] w-16 h-16 text-white -rotate-12" />
        </div>

        {/* Text Content */}
        <div className="relative z-10 container mx-auto px-4 pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-bold tracking-wider mb-4 border border-white/30">
              OUR CURRICULUM
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Three Levels. <br className="hidden md:block" />
              <span style={{ color: accentColor }}>One Clear Path.</span>
            </h2>
            <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              We have structured the chaos of chess into a step-by-step roadmap designed to take you from beginner to champion.
            </p>
          </motion.div>
        </div>

        {/* SVG Wave */}
        <div className="absolute bottom-0 left-0 w-full leading-[0]">
          <svg className="w-full h-16 md:h-32" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path className="fill-slate-50" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* --- Course Cards --- */}
      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {courses.map((course, i) => {
            const Icon = course.icon;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className="group h-full"
              >
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 relative top-0 hover:-top-2">
                  
                  {/* Card Header (Colored) */}
                  <div className={`h-32 bg-gradient-to-r ${course.gradient} relative p-6 flex flex-col justify-between`}>
                    <div className="flex justify-between items-start">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-white font-bold text-sm tracking-wide uppercase bg-black/20 px-3 py-1 rounded-full">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                      {course.description}
                    </p>

                    {/* Topics List */}
                    <div className={`rounded-2xl p-5 mb-8 ${course.bgLight} flex-grow`}>
                      <p className={`font-bold mb-3 text-sm uppercase tracking-wide ${course.color}`}>
                        Curriculum Highlights
                      </p>
                      <ul className="space-y-3">
                        {course.topics.map((topic, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-700">
                            <CheckCircle2 className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${course.color}`} />
                            <span className="leading-tight">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full rounded-xl py-6 text-base font-bold shadow-md hover:shadow-lg transition-all"
                      style={{ 
                        backgroundColor: primaryColor,
                        color: "white" 
                      }}
                    >
                      Explore Course <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}