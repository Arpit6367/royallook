"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Target,
  Scale,
  Gem,
  Heart,
  Crown,
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";
import Link from "next/link";
import { AchievementsSection } from "@/components/achievements-section";
import { FaqSection } from "@/components/faq-section";

// Foundation Items Config
const foundationItems = [
  {
    icon: Brain,
    title: "Clear Concepts",
    desc: "We break down complex grandmaster ideas into simple, digestible concepts that stick.",
    bg: "bg-[#FDFBF7]",
    border: "border-[#E6E0D4]",
    text: "text-[#2D2A26]",
    iconColor: "text-[#2D2A26]",
    iconBg: "bg-[#FFDA44]/20",
    hoverBorder: "hover:border-[#FFDA44]"
  },
  {
    icon: Target,
    title: "Real Improvement",
    desc: "We don't just play; we train. Verify your skills through rated tournaments and consistent rating gains.",
    bg: "bg-[#2D2A26]",
    border: "border-[#2D2A26]",
    text: "text-white",
    descText: "text-white/80",
    iconColor: "text-white",
    iconBg: "bg-[#E76F51]",
    isHighlight: true
  },
  {
    icon: Scale,
    title: "Step by Step",
    desc: "A structured curriculum that ensures you never feel lost or overwhelmed.",
    bg: "bg-[#FFDA44]",
    border: "border-[#FFDA44]",
    text: "text-[#2D2A26]",
    iconColor: "text-[#2D2A26]",
    iconBg: "bg-black/10",
    hoverBorder: "hover:border-[#E76F51]"
  },
  {
    icon: Gem,
    title: "Confidence",
    desc: "Building self-assurance through solving problems and winning games.",
    bg: "bg-white",
    border: "border-[#E6E0D4]",
    text: "text-[#2D2A26]",
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
    hoverBorder: "hover:border-[#FFDA44]"
  },
  {
    icon: Heart,
    title: "Supportive Community",
    desc: "A place where mistakes are celebrated as learning opportunities, and every player supports one another.",
    bg: "bg-[#E76F51]",
    border: "border-[#E76F51]",
    text: "text-white",
    descText: "text-white/90",
    iconColor: "text-[#E76F51]",
    iconBg: "bg-white",
    colSpan: "md:col-span-2"
  }
];

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#2D2A26] selection:bg-[#FFDA44]/30">

      {/* 1. HERO: The Manifesto - Bold, Editorial Style */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#E76F51] mb-4 block">
              More than just a game
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#2D2A26] mb-6 leading-tight tracking-tight">
              Master the <span className="italic font-serif text-[#E76F51]">Minds</span>
            </h1>
            <p className="text-xl text-[#5C5852] max-w-2xl mx-auto leading-relaxed">
              We don't just teach pieces moving on a board. We teach logic, resilience, and the art of pure thinking.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. MISSION: The Split Layout */}
      <section id="mission" className="py-12 px-6 relative">
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
                Most academies teach you ‘what’ to move. At Royal Look, we obsess over ‘why’. We are building a generation of players who understand that every move has a consequence, and every position holds a possibility.
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
              <img src="/image13.jpg" alt="Chess Focus" className="w-full h-full object-cover" />
            </motion.div>

            <div className="absolute bottom-0 left-0 w-2/3 h-[350px] rounded-[2rem] overflow-hidden shadow-2xl z-20 border-8 border-white">
              <img src="/image14.jpg" alt="Child Learning" className="w-full h-full object-cover" />
            </div>

            {/* Floating Icon */}
            <div className="absolute bottom-1/4 right-10 bg-[#FFDA44] p-6 rounded-2xl shadow-xl z-30">
              <Crown className="w-10 h-10 text-[#2D2A26]" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUNDERS SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#FDFBF7]">
                  <img src="/image3.jpg" alt="Founder" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-8 -right-8 bg-[#E76F51] p-8 rounded-[2rem] text-white shadow-xl hidden md:block">
                  <p className="font-serif italic text-2xl">"Chess is life in miniature."</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-8">
              <span className="text-sm font-bold uppercase tracking-wider text-[#E76F51]">The Visionary</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#2D2A26]">
                Meet the <span className="text-[#E76F51]">Founder</span>
              </h2>
              <div className="space-y-6 text-lg text-[#5C5852] leading-relaxed">
                <p>
                  <strong>Grandmaster Rajesh Kumar</strong> founded Royal Look Academy with a simple yet powerful belief: that chess is not just for the gifted, but for the persistent.
                </p>
                <p>
                  With over 20 years of competitive experience and coaching the national team, he brings a depth of understanding that transforms how students perceive the game. His methodology focuses on psychological resilience alongside tactical brilliance.
                </p>
              </div>
              <div className="pt-4">
                <img src="/signature.png" alt="Signature" className="h-16 opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PILLARS: The Foundation (Colored Cards) */}
      <section className="py-24 px-6 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-sm font-bold uppercase tracking-wider text-[#E76F51] mb-2 block">Our Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-[#2D2A26] mb-6">
              The <span className="text-[#E76F51]">Foundation</span>
            </h2>
            <p className="text-xl text-[#5C5852] max-w-2xl mx-auto font-light">
              Built on unshakeable pillars designed to guarantee improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {foundationItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card
                  key={idx}
                  className={`${item.bg} ${item.border} border shadow-lg hover:shadow-2xl rounded-[2rem] p-8 transition-all duration-300 group ${item.colSpan || ''} relative overflow-hidden`}
                >
                  <div className={`${item.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 ${item.iconColor}`} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${item.text}`}>{item.title}</h3>
                  <p className={`${item.descText || 'text-[#5C5852]'} leading-relaxed text-lg`}>
                    {item.desc}
                  </p>
                  {item.isHighlight && <ArrowRight className="w-6 h-6 text-white mt-6" />}
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. JOURNEY: Zigzag Layout */}
      <section className="py-32 px-6 overflow-hidden bg-white">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <span className="text-sm font-bold uppercase tracking-wider text-[#E76F51]">Since 2010</span>
          <h2 className="text-5xl md:text-7xl font-extrabold text-[#2D2A26] mt-4">The Journey</h2>
        </div>

        <div className="max-w-6xl mx-auto space-y-32">
          {[
            {
              year: "2010",
              title: "The Spark",
              desc: "Founded with a single board and a simple vision in a small garage.",
              image: "/image1.jpg"
            },
            {
              year: "2014",
              title: "The Expansion",
              desc: "Moved to our first dedicated center. The family grew to 100 students.",
              image: "/image6.jpg"
            },
            {
              year: "2018",
              title: "Going Digital",
              desc: "Breaking barriers. Launched online coaching globally to reach students everywhere.",
              image: "/image7.jpg"
            },
            {
              year: "2023",
              title: "The Future",
              desc: "Integrating AI learning and grandmaster mentorship as we look ahead.",
              image: "/image10.jpg"
            }
          ].map((item, i) => (
            <div key={i} className={`flex flex-col md:flex-row items-center gap-16 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>

              {/* Text Side */}
              <div className="flex-1 space-y-6">
                <div className="text-7xl font-black text-[#E6E0D4] leading-none">{item.year}</div>
                <h3 className="text-4xl font-bold text-[#2D2A26]">{item.title}</h3>
                <p className="text-xl text-[#5C5852] leading-relaxed max-w-md">{item.desc}</p>
              </div>

              {/* Image Side */}
              <div className="flex-1 w-full">
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-[#FDFBF7]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 6. ACHIEVEMENTS SECTION (Shared) */}
      <AchievementsSection />

      {/* 7. FAQ SECTION (Shared) */}
      <FaqSection />

      {/* 8. CTA: Full Width Impact */}
      <section className="relative py-22 bg-[#FDFBF7] text-[#2D2A26] overflow-hidden border-t border-[#E6E0D4]">
        {/* Background Ambient Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFDA44]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E76F51]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            Your Move, <br />
            <span className="text-[#E76F51]">Champion.</span>
          </h2>
          <p className="text-xl text-[#5C5852] mb-12 max-w-2xl mx-auto">
            Join the academy that builds masters. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Link href="/contact">
              <Button className="h-16 px-10 rounded-full bg-[#2D2A26] text-white text-lg font-bold hover:bg-[#E76F51] hover:text-white transition-all duration-300 shadow-2xl hover:shadow-[#E76F51]/20">
                Book Free Trial
              </Button>
            </Link>
            <span className="text-[#5C5852] font-medium hidden sm:block">or</span>
            <Link href="/courses" className="text-lg font-bold text-[#2D2A26] border-b-2 border-[#2D2A26]/20 hover:text-[#E76F51] hover:border-[#E76F51] transition-colors pb-1">
              View Curriculum
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}