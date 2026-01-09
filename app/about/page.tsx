"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Users,
  Target,
  Award,
  BookOpen,
  Star,
  ChevronDown,
  Mail,
  UserCheck,
  FileText,
  Brain,
  Lightbulb,
  Scale,
  Gem,
  Zap,
  CheckCircle2,
  Heart,
  Crown,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#2D2A26] selection:bg-[#FFDA44]/30">

      {/* 1. HERO: The Manifesto - Bold, Editorial Style */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden py-24">
        {/* Abstract Background Art */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E76F51]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FFDA44]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="container max-w-6xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="font-serif italic text-2xl md:text-3xl text-[#E76F51] tracking-wide">
              More than just a game
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-[7rem] font-extrabold leading-[0.9] text-[#2D2A26] mb-12 tracking-tight"
          >
            MASTER<br />
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5C1F1C] to-[#E76F51]">MIND</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="max-w-xl mx-auto space-y-8"
          >
            <p className="text-xl md:text-2xl font-light text-[#5C5852] leading-relaxed">
              We don't just teach pieces moving on a board. We teach logic, resilience, and the art of pure thinking.
            </p>

            <div className="flex justify-center gap-4">
              <div className="h-16 w-[1px] bg-[#2D2A26]/20"></div>
            </div>

            <Link href="#mission" className="inline-flex flex-col items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#2D2A26]/60 hover:text-[#E76F51] transition-colors">
              Scroll to Explore
              <ChevronDown className="animate-bounce" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. MISSION: The Split Layout */}
      <section id="mission" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Sticky Text Side */}
          <div className="lg:sticky lg:top-32 h-fit space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-[2px] bg-[#E76F51]"></div>
                <span className="text-sm font-bold uppercase tracking-wider text-[#E76F51]">Our Mission</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold text-[#2D2A26] leading-tight mb-8">
                To Create <br />
                <span className="italic font-serif text-[#E76F51]">Thinking</span> Players.
              </h2>
              <p className="text-lg text-[#5C5852] leading-relaxed mb-6">
                Most academies teach you ‘what’ to move. At ChessPure, we obsess over ‘why’. We are building a generation of players who understand that every move has a consequence, and every position holds a possibility.
              </p>
              <p className="text-lg text-[#5C5852] leading-relaxed">
                Whether you are 6 or 60, our structured path takes you from absolute beginner to confident competitor, one pure move at a time.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#E6E0D4]">
              <div>
                <h3 className="text-4xl font-extrabold text-[#2D2A26] mb-1">600+</h3>
                <p className="text-sm text-[#5C5852] uppercase font-bold tracking-wide">Active Students</p>
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-[#2D2A26] mb-1">50+</h3>
                <p className="text-sm text-[#5C5852] uppercase font-bold tracking-wide">Expert Coaches</p>
              </div>
            </div>
          </div>

          {/* Visual Side - Overlapping Images */}
          <div className="relative h-[600px] w-full hidden lg:block">
            <motion.div
              style={{ y }}
              className="absolute top-0 right-0 w-3/4 h-[400px] rounded-[2rem] overflow-hidden shadow-2xl z-10 border-8 border-white"
            >
              <img src="/aboutbg.png" alt="Chess Focus" className="w-full h-full object-cover" />
            </motion.div>

            <div className="absolute bottom-0 left-0 w-2/3 h-[350px] rounded-[2rem] overflow-hidden shadow-2xl z-20 border-8 border-white">
              <img src="/chesscenter.jpg" alt="Child Learning" className="w-full h-full object-cover" />
            </div>

            {/* Floating Icon */}
            <div className="absolute bottom-1/4 right-10 bg-[#FFDA44] p-6 rounded-2xl shadow-xl z-30">
              <Crown className="w-10 h-10 text-[#2D2A26]" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. PILLARS: The Foundation (Light & Clean REFRESHED) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-sm font-bold uppercase tracking-wider text-[#E76F51] mb-2 block">Our Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-[#2D2A26] mb-6">
              The <span className="text-[#E76F51]">Foundation</span>
            </h2>
            <p className="text-xl text-[#5C5852] max-w-2xl mx-auto font-light">
              Our philosophy is built on six unshakeable pillars designed to guarantee your improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Clear Concepts */}
            <Card className="bg-[#FDFBF7] border border-[#E6E0D4] hover:border-[#FFDA44] shadow-sm hover:shadow-xl rounded-3xl p-8 transition-all duration-300 group">
              <div className="bg-[#FFDA44]/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-[#2D2A26]" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#2D2A26]">Clear Concepts</h3>
              <p className="text-[#5C5852] leading-relaxed">
                We break down complex grandmaster ideas into simple, digestible concepts that stick.
              </p>
            </Card>

            {/* 2. Real Improvement (Highlighted) */}
            <Card className="bg-[#2D2A26] border border-[#2D2A26] shadow-xl rounded-3xl p-8 relative overflow-hidden group transform md:-translate-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="bg-[#E76F51] w-14 h-14 rounded-2xl flex items-center justify-center mb-6 z-10 relative">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white relative z-10">Real Improvement</h3>
              <p className="text-white/80 leading-relaxed relative z-10">
                We don't just play; we train. Verify your skills through rated tournaments and consistent rating gains.
              </p>
              <ArrowRight className="w-6 h-6 text-[#E76F51] mt-6 relative z-10" />
            </Card>

            {/* 3. Step by Step */}
            <Card className="bg-[#FDFBF7] border border-[#E6E0D4] hover:border-[#FFDA44] shadow-sm hover:shadow-xl rounded-3xl p-8 transition-all duration-300 group">
              <div className="bg-[#E76F51]/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Scale className="w-7 h-7 text-[#E76F51]" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#2D2A26]">Step by Step</h3>
              <p className="text-[#5C5852] leading-relaxed">
                A structured curriculum that ensures you never feel lost or overwhelmed.
              </p>
            </Card>

            {/* 4. Confidence */}
            <Card className="bg-[#FDFBF7] border border-[#E6E0D4] hover:border-[#FFDA44] shadow-sm hover:shadow-xl rounded-3xl p-8 transition-all duration-300 group">
              <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gem className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#2D2A26]">Confidence</h3>
              <p className="text-[#5C5852] leading-relaxed">
                Building self-assurance through solving problems and winning games.
              </p>
            </Card>

            {/* 5. Supportive Community */}
            <Card className="md:col-span-2 bg-gradient-to-r from-[#FDFBF7] to-white border border-[#E6E0D4] hover:border-[#E76F51] shadow-sm hover:shadow-xl rounded-3xl p-8 transition-all duration-300 group flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="bg-[#E76F51]/20 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <Heart className="w-8 h-8 text-[#E76F51]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-[#2D2A26]">Supportive Community</h3>
                <p className="text-[#5C5852] leading-relaxed">
                  A place where mistakes are celebrated as learning opportunities, and every player supports one another.
                </p>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* 4. JOURNEY: The Winding Path */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <span className="text-sm font-bold uppercase tracking-wider text-[#E76F51]">Since 2010</span>
          <h2 className="text-5xl md:text-7xl font-extrabold text-[#2D2A26] mt-4">The Journey</h2>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#E6E0D4] -translate-x-1/2 hidden md:block"></div>

          <div className="space-y-24 md:space-y-36">
            {[
              { year: "2010", title: "The Spark", desc: "Founded with a single board and a simple vision.", align: "left" },
              { year: "2014", title: "The Expansion", desc: "Moved to our first dedicated center. The family grew.", align: "right" },
              { year: "2018", title: "Going Digital", desc: "Breaking barriers. Launched online coaching globally.", align: "left" },
              { year: "2023", title: "The Future", desc: "1-on-1 AI integrated learning and grandmaster mentorship.", align: "right" }
            ].map((item, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-12 ${item.align === 'right' ? 'md:flex-row-reverse' : ''}`}>

                {/* Text Content */}
                <div className={`flex-1 text-center ${item.align === 'right' ? 'md:text-left' : 'md:text-right'}`}>
                  <div className="text-6xl font-black text-[#E6E0D4] mb-2">{item.year}</div>
                  <h3 className="text-3xl font-bold text-[#2D2A26] mb-4">{item.title}</h3>
                  <p className="text-lg text-[#5C5852] font-medium leading-relaxed">{item.desc}</p>
                </div>

                {/* Center Node */}
                <div className="relative z-10 w-4 h-4 rounded-full bg-[#E76F51] ring-8 ring-white shadow-xl"></div>

                {/* Empty Flex Space */}
                <div className="flex-1 hidden md:block"></div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA: Full Width Impact */}
      <section className="relative py-32 bg-[#FDFBF7] border-t border-[#E6E0D4]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-extrabold text-[#2D2A26] mb-8 leading-tight">
            Your Move, <br />
            <span className="text-[#E76F51]">Champion.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Link href="/contact">
              <Button className="h-16 px-10 rounded-full bg-[#2D2A26] text-white text-lg font-bold hover:bg-[#E76F51] hover:px-12 transition-all duration-300 shadow-2xl">
                Book Free Trial
              </Button>
            </Link>
            <span className="text-[#5C5852] font-medium">or</span>
            <Link href="/courses" className="text-lg font-bold text-[#2D2A26] border-b-2 border-[#2D2A26] hover:text-[#E76F51] hover:border-[#E76F51] transition-colors pb-1">
              View Curriculum
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}