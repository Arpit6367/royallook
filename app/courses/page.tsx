"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Target,
  Trophy,
  ArrowRight,
  X,
  Check,
  ChevronRight,
  Sparkles,
  Map,
  GraduationCap,
  Clock,
  Users
} from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const courses = [
    {
      id: "beginner",
      level: "Level 1: The Foundation",
      elo: "0 - 800 ELO",
      title: "Beginner Mastery",
      color: "#2A9D8F", // Teal
      bg: "bg-[#2A9D8F]",
      lightBg: "bg-[#2A9D8F]/10",
      description: "Stop guessing. Start thinking. Learn the correct way to view the board.",
      features: ["Board Vision", "Basic Tactics", "Opening Principles"],
      image: "/chess-academy-instructor-teaching-students.jpg",
      topics: [
        "The Language of Chess (Notation)",
        "Piece Power & Movement",
        "The 3 Golden Rules of Opening",
        "Basic Checkmates (Ladder, Queen)",
        "Tactical Vision: Forks & Pins"
      ],
      schedule: "Mon & Wed, 4 PM",
      duration: "3 Months"
    },
    {
      id: "intermediate",
      level: "Level 2: The Tactician",
      elo: "800 - 1400 ELO",
      title: "Tactical Warfare",
      color: "#E76F51", // Burnt Orange
      bg: "bg-[#E76F51]",
      lightBg: "bg-[#E76F51]/10",
      description: "Games are won by tactics. Blunders vanish here.",
      features: ["Calculation", "Pattern Recognition", "Endgame Basics"],
      image: "/chess-tournament.png",
      topics: [
        "Advanced Combinations",
        "The Art of Attack",
        "Positional Understanding",
        "King Safety & Weak Squares",
        "Rook Endgames"
      ],
      schedule: "Tue & Thu, 5 PM",
      duration: "4 Months"
    },
    {
      id: "advanced",
      level: "Level 3: The Strategist",
      elo: "1400+ ELO",
      title: "Strategic Depth",
      color: "#FFDA44", // Gold
      textColor: "#B4860B",
      bg: "bg-[#FFDA44]",
      lightBg: "bg-[#FFDA44]/20",
      description: "Deep plans. Prophylaxis. Tournament psychology.",
      features: ["Opening Repertoire", "Complex Endgames", "Psychology"],
      image: "/chess-simultaneous.jpg",
      topics: [
        "Grandmaster Opening Prep",
        "Minority Attacks & Pawn Storms",
        "Prophylaxis (Preventing Counterplay)",
        "Complex Endgame Studies",
        "Tournament Psychology"
      ],
      schedule: "Sat & Sun, 10 AM",
      duration: "6 Months"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-[#E76F51]/20">

      {/* 1. HERO: The Opening Move */}
      <section className="relative pt-14 pb-16 px-6 lg:pt-22 lg:pb-14 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="relative z-10 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white border border-[#E6E0D4] px-4 py-2 rounded-full shadow-sm"
            >
              <Map className="w-4 h-4 text-[#E76F51]" />
              <span className="text-sm font-bold uppercase tracking-wider text-[#5C5852]">Curriculum Roadmap</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-[#2D2A26] leading-[1.1]">
              Choose Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E76F51] to-[#D9381E]">Battlefield.</span>
            </h1>

            <p className="text-xl text-[#5C5852] font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              A structured path from learning the rules to breaking them like a Master. Select your starting point.
            </p>
          </div>

          {/* Abstract 3D Visual */}
          <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E76F51]/10 to-transparent rounded-full blur-3xl transform rotate-12" />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              {/* Representing a 'Path' or 'Board' abstractly */}
              <div className="grid grid-cols-2 gap-4 transform rotate-6">
                <div className="w-32 h-44 bg-[#2D2A26] rounded-2xl shadow-2xl opacity-90 translate-y-8" />
                <div className="w-32 h-44 bg-[#E76F51] rounded-2xl shadow-2xl skew-y-6" />
                <div className="w-32 h-44 bg-[#FFDA44] rounded-2xl shadow-2xl -translate-y-4" />
                <div className="w-32 h-44 bg-white border border-[#E6E0D4] rounded-2xl shadow-xl -skew-y-6" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. THE MAP: Interactive Syllabus */}
      <section className="py-20 px-6 relative">
        {/* Connecting Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#E6E0D4] via-[#E76F51] to-[#E6E0D4] md:-translate-x-1/2" />

        <div className="max-w-6xl mx-auto space-y-24 relative z-10">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`flex flex-col md:flex-row gap-8 md:gap-20 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Card Side */}
              <div className="flex-1 w-full group">
                <div
                  className="bg-white border border-[#E6E0D4] rounded-[2rem] p-1 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer relative"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className={`absolute top-0 left-0 w-2 h-full ${course.bg}`} />
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <Badge className={`${course.lightBg} ${index === 2 ? 'text-[#B4860B]' : `text-[${course.color}]`} hover:${course.lightBg} border-none text-sm px-3 py-1 font-bold`}>
                        {course.elo}
                      </Badge>
                      <div className={`p-2 rounded-full ${course.lightBg}`}>
                        <ArrowRight className={`w-5 h-5 ${index === 2 ? 'text-[#B4860B]' : `text-[${course.color}]`}`} />
                      </div>
                    </div>

                    <h3 className="text-3xl font-extrabold text-[#2D2A26] mb-3 group-hover:text-[#E76F51] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-[#5C5852] font-medium leading-relaxed mb-6">
                      {course.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {course.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-[#2D2A26]/80">
                          <Check className={`w-4 h-4 ${index === 2 ? 'text-[#B4860B]' : `text-[${course.color}]`}`} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Marker (Center) */}
              <div className="relative">
                <div className={`w-12 h-12 rounded-full border-4 border-[#FDFBF7] shadow-xl flex items-center justify-center ${course.bg} text-white font-bold text-lg relative z-20`}>
                  {index + 1}
                </div>
              </div>

              {/* Info Side */}
              <div className={`hidden md:block flex-1 ${index % 2 === 1 ? 'text-right' : 'text-left'}`}>
                <span className={`text-sm font-bold uppercase tracking-wider ${index === 2 ? 'text-[#B4860B]' : `text-[${course.color}]`}`}>
                  {course.level}
                </span>
                <h4 className="text-4xl font-extrabold text-[#2D2A26]/10 mt-2 transform scale-150 origin-left">
                  STEP {index + 1}
                </h4>
              </div>

            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. COMPARISON TABLE: The Stats */}
      <section className="py-24 bg-white border-t border-[#E6E0D4]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#2D2A26] mb-4">Compare the Levels</h2>
            <p className="text-[#5C5852]">Understand exactly what you gain at each stage.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#E6E0D4]">
                  <th className="py-6 min-w-[200px] text-[#2D2A26]">Feature</th>
                  <th className="py-6 min-w-[150px] text-center text-[#2A9D8F] font-bold">Beginner</th>
                  <th className="py-6 min-w-[150px] text-center text-[#E76F51] font-bold">Intermediate</th>
                  <th className="py-6 min-w-[150px] text-center text-[#B4860B] font-bold">Advanced</th>
                </tr>
              </thead>
              <tbody className="text-[#5C5852]">
                {[
                  { name: "Live Coaching", b: "2 hrs/week", i: "3 hrs/week", a: "4 hrs/week" },
                  { name: "Tournament Access", b: "Monthly", i: "Weekly", a: "Unlimited" },
                  { name: "Analysis Depth", b: "Basic Errors", i: "Tactical Misses", a: "Full Game Review" },
                  { name: "AI Report", b: <X className="w-5 h-5 mx-auto opacity-20" />, i: <Check className="w-5 h-5 mx-auto text-[#E76F51]" />, a: <Check className="w-5 h-5 mx-auto text-[#B4860B]" /> },
                  { name: "Grandmaster Guest", b: <X className="w-5 h-5 mx-auto opacity-20" />, i: "Quarterly", a: "Monthly" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-[#E6E0D4] hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-4 font-medium">{row.name}</td>
                    <td className="py-4 text-center">{row.b}</td>
                    <td className="py-4 text-center">{row.i}</td>
                    <td className="py-4 text-center">{row.a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. CTA: Premium Evaluation Card */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-white rounded-[3rem] p-8 md:p-16 text-center border border-[#E6E0D4] shadow-2xl overflow-hidden group">
            {/* Gradient Glow */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#2A9D8F] via-[#E76F51] to-[#FFDA44]" />

            {/* Background Decor */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#E76F51]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#FFDA44]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center p-4 bg-[#FDFBF7] rounded-full mb-8 shadow-sm border border-[#E6E0D4] group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-8 h-8 text-[#FFDA44]" />
              </div>

              <h2 className="text-4xl md:text-6xl font-extrabold text-[#2D2A26] mb-6 leading-tight">
                Not sure where to <span className="text-[#E76F51]">start?</span>
              </h2>
              <p className="text-xl text-[#5C5852] font-medium leading-relaxed mb-10">
                Rating numbers can be deceiving. Take our comprehensive 5-minute evaluation to find your true strength and perfect course match.
              </p>

              <Link href="/contact">
                <Button size="lg" className="bg-[#2D2A26] text-white hover:bg-[#E76F51] px-12 py-8 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  Start Free Evaluation
                </Button>
              </Link>

              <p className="mt-6 text-sm text-[#5C5852]/60 font-semibold tracking-wide uppercase">
                No account required • Instant Results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COURSE MODAL */}
      <Dialog open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FDFBF7] border-none p-0">
          {selectedCourse && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Image Side */}
              <div className="w-full md:w-1/3 relative h-64 md:h-auto">
                <Image
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  fill
                  className="object-cover"
                />
                <div className={`absolute inset-0 opacity-40 mix-blend-multiply ${selectedCourse.bg}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white p-4">
                  <p className="text-sm font-bold uppercase opacity-80 mb-2">{selectedCourse.level}</p>
                  <h2 className="text-3xl font-extrabold leading-tight">{selectedCourse.title}</h2>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#5C5852]">
                    <Clock className="w-4 h-4" /> {selectedCourse.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#5C5852]">
                    <Users className="w-4 h-4" /> {selectedCourse.schedule}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[#2D2A26] mb-4">Curriculum</h3>
                  <ul className="space-y-3">
                    {selectedCourse.topics.map((topic: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-[#5C5852]">
                        <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${selectedCourse.bg}`} />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/contact" className="block">
                  <Button className={`w-full py-6 text-lg font-bold text-white ${selectedCourse.bg} hover:opacity-90`}>
                    Enroll in Course
                  </Button>
                </Link>
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors z-50 text-white md:text-[#2D2A26]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}