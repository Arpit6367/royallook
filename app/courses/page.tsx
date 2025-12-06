"use client";

import { useState, useRef } from "react";
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
} from "lucide-react";
import Link from "next/link";

const primaryColor = "#5C1F1C";
const accentColor = "#FFC727";

function ThreeDCard({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 12;
    const rotateY = (centerX - x) / 12;
    setRotate({ x: rotateX, y: rotateY });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`transform-gpu transition-all duration-300 ease-out cursor-pointer ${className}`}
      style={{
        transform: `perspective(1200px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const courses = [
    {
      id: 1,
      title: "Beginner Course",
      level: "Beginner",
      image: "/chess-academy-instructor-teaching-students.jpg",
      description: "From zero to playing full games. Perfect for kids & adults starting chess.",
      topics: [
        "Introduction to board & pieces",
        "Piece Movements",
        "Attacking & Capturing",
        "Defending the pieces",
        "The King",
        "Checkmate",
        "Castling",
        "The correct way to exchange pieces",
        "Twofold Attack",
        "Stalemate",
        "Mating with King + Queen",
        "Special move: Pawn en passant",
      ],
    },
    {
      id: 2,
      title: "Intermediate Course",
      level: "Intermediate",
      image: "/chess-tournament.png",
      description: "Master tactics, strategy, and real game understanding. Stop blundering forever.",
      topics: [
        "Piece Mobility",
        "Fork, Pin, Double attack, Discovered Attack",
        "The Golden Rules",
        "Mate in two",
        "Eliminating The Defender",
        "Targeting a square",
        "Defending Against Mate",
        "King + Rook Checkmate",
        "Notations",
      ],
    },
    {
      id: 3,
      title: "Advanced Course",
      level: "Advanced",
      image: "/chess-simultaneous.jpg",
      description: "Tournament-ready chess. Deep strategy, endgames, openings & psychological mastery.",
      topics: [
        "Finishing the opening",
        "Discovered and Double Check",
        "Breaching the king’s Defences",
        "Pawn endings: Square of the Pawn, Key squares",
        "Defending against Tactics",
        "Mini Plans",
        "X-ray Attack",
        "Positional mastery & prophylaxis",
        "Endgame technique",
        "& More tournament-level concepts...",
      ],
    },
  ];

  const openModal = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* HERO */}
      <section
        className="relative py-32 text-white overflow-hidden"
        style={{
          backgroundImage: 'url("/coursesbg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 max-w-7xl mx-auto text-center px-6">
          <Badge className="mb-4 text-lg" style={{ backgroundColor: accentColor, color: primaryColor }}>
            Structured Chess Training
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Master Chess Step by Step
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-10 opacity-90">
            Just 3 courses. From your first move to crushing opponents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-[#5C1F1C] hover:bg-[#FFC727] px-10 py-7 text-xl font-bold rounded-full">
                Book Free Trial Class
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* COURSES GRID */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: primaryColor }}>
              Our 3-Level Program
            </h2>
            <p className="text-xl text-gray-600">Clear path. Proven results. No confusion.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <AnimatePresence>
              {courses.map((course, i) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <ThreeDCard onClick={() => openModal(course)}>
                    <div className="bg-gradient-to-br from-[#5C1F1C] to-[#8B4513] p-2 rounded-3xl h-full">
                      <div className="bg-white rounded-3xl h-full flex flex-col overflow-hidden shadow-2xl">
                        <div className="relative h-64">
                          <Image
                            src={course.image}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <Badge className="absolute bottom-4 left-4 text-lg font-bold bg-gradient-to-r from-[#FFC727] to-[#FFD700] text-[#5C1F1C]">
                            {course.level}
                          </Badge>
                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                          <h3 className="text-3xl font-extrabold mb-3 text-[#5C1F1C]">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 mb-6 flex-1">{course.description}</p>

                          <Button className="w-full bg-gradient-to-r from-[#FFC727] to-[#FFD700] text-[#5C1F1C] font-bold text-lg py-7 rounded-2xl hover:shadow-2xl hover:shadow-yellow-500/40 transition-all">
                            View Full Curriculum <ArrowRight className="ml-3 w-6 h-6" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ThreeDCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* DETAILED MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white/98 backdrop-blur-2xl rounded-3xl p-0">
          {selectedCourse && (
            <>
              <div className="relative h-80">
                <Image
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-6 right-6 text-white hover:bg-white/20"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="w-8 h-8" />
                </Button>
                <div className="absolute bottom-10 left-10 text-white">
                  <h1 className="text-5xl font-extrabold mb-3">{selectedCourse.title}</h1>
                  <p className="text-2xl opacity-90">{selectedCourse.description}</p>
                </div>
              </div>

              <div className="p-10">
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-3xl font-bold mb-8 text-[#5C1F1C]">What You'll Learn</h3>
                    <ul className="space-y-4">
                      {selectedCourse.topics.map((topic: string, i: number) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="w-3 h-3 rounded-full bg-[#FFC727] mt-2 flex-shrink-0" />
                          <span className="text-lg text-gray-700 leading-relaxed">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold mb-8 text-[#5C1F1C]">Course Details</h3>
                    <div className="space-y-6 text-lg">
                      <div className="flex items-center gap-4">
                        <BookOpen className="w-7 h-7 text-[#FFC727]" />
                        <div>
                          <p className="font-semibold">Schedule</p>
                          <p className="text-gray-600">{selectedCourse.schedule}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Target className="w-7 h-7 text-[#FFC727]" />
                        <div>
                          <p className="font-semibold">Age Group</p>
                          <p className="text-gray-600">{selectedCourse.ageGroup}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 mt-12">
                  <Link href="/contact" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-[#FFC727] to-[#FFD700] text-[#5C1F1C] font-bold text-2xl py-9 rounded-3xl">
                      Enroll Now
                    </Button>
                  </Link>
                  <Link href="/contact" className="flex-1">
                    <Button variant="outline" className="w-full border-4 border-[#5C1F1C] text-[#5C1F1C] font-bold text-2xl py-9 rounded-3xl">
                      Free Trial Class
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* FINAL CTA */}
      <section className="py-24 px-6 bg-gradient-to-r from-[#5C1F1C] to-[#8B4513] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
            Ready to Transform Your Chess?
          </h2>
          <p className="text-2xl mb-10 opacity-90">
            Join 500+ students who went from beginner to advanced.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-[#5C1F1C] hover:bg-[#FFC727] px-16 py-10 text-3xl font-bold rounded-full shadow-2xl">
              Claim Your Free Trial Class
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}