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
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AboutPage() {
  const [radius, setRadius] = useState(260);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setRadius(110);        // sm
      else if (width < 768) setRadius(130);   // md
      else if (width < 1024) setRadius(180);  // lg
      else setRadius(260);                    // xl+
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative py-24 sm:py-32 md:py-40 text-white overflow-hidden"
        style={{
          backgroundImage: 'url("/aboutbg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge
            className="mb-4 sm:mb-6 text-sm sm:text-base md:text-lg"
            style={{ backgroundColor: "#FFC727", color: "#5C1F1C" }}
          >
            One Pure Move at a Time
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight">
            Welcome to <span style={{ color: "#FFC727" }}>ChessPure</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-10 opacity-95">
            We focus on helping beginner and intermediate players build strong,
            lasting chess skills through clear coaching, structured training,
            and a supportive learning environment.
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="lg"
                className="bg-white text-[#5C1F1C] hover:bg-[#FFC727] hover:text-[#5C1F1C] border-2 border-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-lg transition-all duration-300"
              >
                Start Your Journey <ChevronDown className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 sm:w-60 bg-white border border-gray-200 shadow-xl rounded-lg mt-2">
              <DropdownMenuItem asChild>
                <Link
                  href="/contact"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#FFC727]/20 hover:text-[#5C1F1C] text-sm sm:text-base"
                >
                  <Mail className="mr-3 h-4 w-4 sm:h-5 sm:w-5" /> Contact Us
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/coaches"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#FFC727]/20 hover:text-[#5C1F1C] text-sm sm:text-base"
                >
                  <UserCheck className="mr-3 h-4 w-4 sm:h-5 sm:w-5" /> Our Coaches
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/blogs"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#FFC727]/20 hover:text-[#5C1F1C] text-sm sm:text-base"
                >
                  <FileText className="mr-3 h-4 w-4 sm:h-5 sm:w-5" /> Blogs & Articles
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            <Card className="bg-[#5C1F1C] text-white border-0 shadow-xl rounded-2xl p-6 sm:p-8 transform hover:scale-105 transition-transform duration-300 group">
              <CardContent className="p-0 flex flex-col items-start">
                <Target className="w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-6 text-[#FFC727] group-hover:rotate-12 transition-transform duration-300" />
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Focus</h3>
                <p className="text-base sm:text-lg leading-relaxed opacity-90">
                  To provide structured curriculum and patient instruction that helps 
                  every student move from beginner to intermediate — and beyond.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[#8B4513] text-white border-0 shadow-xl rounded-2xl p-6 sm:p-8 transform hover:scale-105 transition-transform duration-300 group">
              <CardContent className="p-0 flex flex-col items-start">
                <Heart className="w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-6 text-[#FFC727] group-hover:scale-125 transition-transform duration-300" />
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Belief</h3>
                <p className="text-base sm:text-lg leading-relaxed opacity-90">
                  That every student can grow with the right training. We aim to be the 
                  perfect place to learn, progress, and enjoy the game.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Pillars of Academy - Center Image + Orbiting Cards */}
      <section className="py-16 sm:py-20 px-4 bg-[#5C1F1C] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 sm:mb-16">
            The Pillars of <span style={{ color: "#FFC727" }}>ChessPure</span>
          </h2>
          <div className="relative w-full h-80 sm:h-96 md:h-[600px] flex items-center justify-center">
            {/* Central Chess King Image */}
            <div className="absolute z-20">
              <div className="bg-white p-3 sm:p-4 md:p-6 rounded-full shadow-2xl flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 border-6 sm:border-8 border-[#FFC727] transform hover:scale-110 transition-transform duration-300">
                <img
                  src="/chesscenter.jpg"
                  alt="Chess King"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
            {/* Orbiting Cards */}
            <div className="absolute inset-0">
              {[
                { icon: Brain, title: "Clear Concepts", color: "bg-purple-600" },
                { icon: Lightbulb, title: "Core Understanding", color: "bg-green-600" },
                { icon: Scale, title: "Step by Step", color: "bg-red-600" },
                { icon: Gem, title: "Confidence", color: "bg-yellow-600" },
                { icon: Zap, title: "Real Improvement", color: "bg-teal-600" },
                { icon: BookOpen, title: "Supportive", color: "bg-orange-600" },
              ].map((item, index) => {
                const angle = (index * 60) - 90;
                const x = radius * Math.cos((angle * Math.PI) / 180);
                const y = radius * Math.sin((angle * Math.PI) / 180);
                return (
                  <div
                    key={index}
                    className="absolute w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `50%`,
                      top: `50%`,
                      marginLeft: `${x}px`,
                      marginTop: `${y}px`,
                    }}
                  >
                    <Card className="w-full h-full rounded-xl shadow-xl flex flex-col items-center justify-center text-center p-2 sm:p-3 md:p-4 bg-white text-gray-800 border-4 border-white hover:scale-110 transition-transform duration-300">
                      <div
                        className={`${item.color} rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center mx-auto mb-1 sm:mb-2`}
                      >
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <h4 className="text-xs sm:text-sm md:text-base font-semibold leading-tight">{item.title}</h4>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-10 sm:mb-16" style={{ color: "#5C1F1C" }}>
            Our <span style={{ color: "#8B4513" }}>Journey</span> Through Time
          </h2>
          <div className="relative">
            {/* Desktop timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#5C1F1C] rounded-full" />
            <div className="space-y-12 sm:space-y-20">
              {[
                {
                  year: "2010",
                  title: "The Beginning",
                  description:
                    "Chesspure was founded with a simple yet powerful vision — to make high-quality chess coaching accessible to every aspiring player. Recognizing the need for structured, personalized, and practical training, focusing on making the game fun and understandable.  Chesspure was founded to help beginners and intermediate players build strong fundamentals, improve confidence, and succeed in competitive play.",
                  image: "/found.png",
                  position: "left",
                  icon: <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
                },
                {
                  year: "2014",
                  title: "Growing the Community",
                  description:
                    "Parents saw the value in our structured approach. We expanded to a dedicated training center, helping students win their first local tournaments and gain confidence.",
                  image: "national.png",
                  position: "right",
                  icon: <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
                },
                {
                  year: "2018",
                  title: "Online Expansion",
                  description:
                    "To reach more students, we launched our online coaching. This allowed us to bring our 'step-by-step' teaching method to students across different states.",
                  image: "online.png",
                  position: "left",
                  icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
                },
                {
                  year: "2020",
                  title: "Building Champions",
                  description:
                    "Our students began consistently performing well in rated tournaments. We introduced advanced intermediate modules to bridge the gap between casual play and competitive chess.",
                  image: "champion.png",
                  position: "right",
                  icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
                },
                {
                  year: "2023",
                  title: "Personalized Learning Era",
                  description:
                    "We refined our curriculum to offer 1-on-1 coaching and interactive group classes that adapt to the student's level, ensuring no one feels left behind.",
                  image: "ai.png",
                  position: "left",
                  icon: <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
                },
              ].map((event, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center relative ${
                    event.position === "right" ? "md:justify-end" : "md:justify-start"
                  }`}
                >
                  {/* Desktop left side */}
                  <div className="hidden md:block w-1/2">
                    {event.position === "left" && (
                      <div className="flex justify-end pr-8 sm:pr-10">
                        <Card className="bg-[#5C1F1C] p-5 sm:p-6 md:p-8 rounded-xl shadow-lg max-w-md lg:max-w-lg border border-gray-200 hover:scale-105 transition-transform duration-300">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                          />
                          <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">
                            {event.title}
                          </h3>
                          <p className="text-white text-sm sm:text-base leading-relaxed">{event.description}</p>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 md:relative w-10 h-10 sm:w-12 sm:h-12 bg-[#5C1F1C] rounded-full flex items-center justify-center z-10 shadow-xl border-4 border-white">
                    {event.icon}
                  </div>
                  <div className="absolute text-lg sm:text-xl font-bold -mt-12 md:hidden" style={{ color: "#5C1F1C" }}>
                    {event.year}
                  </div>

                  {/* Desktop right side */}
                  <div className="hidden md:block w-1/2">
                    {event.position === "right" && (
                      <div className="flex justify-start pl-8 sm:pl-10">
                        <Card className="bg-[#5C1F1C] p-5 sm:p-6 md:p-8 rounded-xl shadow-lg max-w-md lg:max-w-lg border border-gray-200 hover:scale-105 transition-transform duration-300">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                          />
                          <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">
                            {event.title}
                          </h3>
                          <p className="text-white text-sm sm:text-base leading-relaxed">{event.description}</p>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Mobile card */}
                  <div className="md:hidden mt-8 w-full px-2 sm:px-4">
                    <Card className="bg-white p-5 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                      />
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3" style={{ color: "#5C1F1C" }}>
                        {event.title}
                      </h3>
                      <p className="text-gray-700 text-sm sm:text-base">{event.description}</p>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Educational Philosophy - UPDATED CONTENT */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-10 sm:mb-16" style={{ color: "#5C1F1C" }}>
            Our Teaching <span style={{ color: "#8B4513" }}>Approach</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side: Text Description */}
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Designed for Your Level
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you&apos;re just starting out or aiming to move beyond the basics, our lessons are designed to fit your level. We offer <strong>1-on-1 coaching</strong> and <strong>interactive group classes</strong> that cover everything from piece fundamentals and opening principles to tactical patterns, middlegame planning, and endgames.
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-[#FFC727] p-5 my-6">
                <p className="text-gray-800 font-medium italic">
                  &quot;At ChessPure, we believe every student can grow with the right training. That’s why we focus on patient instruction and personalized feedback.&quot;
                </p>
              </div>

              <div className="pt-4">
                <Button className="bg-[#5C1F1C] hover:bg-[#8B4513] text-white px-8 py-6 rounded-full text-lg shadow-xl">
                  Start Your Journey
                </Button>
              </div>
            </div>

            {/* Right Side: The Checklist */}
            <div className="bg-[#5C1F1C] text-white rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
               {/* Decorative background element */}
               <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#FFC727] rounded-full opacity-10 blur-3xl"></div>

              <h3 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: "#FFC727" }}>
                The ChessPure Method
              </h3>
              <ul className="space-y-6 text-lg">
                {[
                  "Explain concepts clearly",
                  "Guide students step by step",
                  "Strengthen core understanding",
                  "Build confidence through practice",
                  "Help players see real improvement"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 transform transition-all hover:translate-x-2">
                    <div className="bg-white/10 p-2 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-[#FFC727]" />
                    </div>
                    <span className="pt-1 font-medium tracking-wide">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10 pt-8 border-t border-white/20 text-center">
                 <p className="text-xl font-serif italic text-white/90">
                   "One pure move at a time."
                 </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 sm:mb-16" style={{color: "#5C1F1C"}}>
            Why Choose <span style={{ color: "#8B4513" }}>ChessPure?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                title: "Structured Training",
                description: "Curriculum that helps players move from beginner to intermediate logic effectively.",
                icon: <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-[#5C1F1C]" />,
              },
              {
                title: "Supportive Environment",
                description: "A perfect place to learn where mistakes are seen as stepping stones to mastery.",
                icon: <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-[#5C1F1C]" />,
              },
              {
                title: "Personalized Feedback",
                description: "We don't just teach moves; we help you understand the 'Why' behind them.",
                icon: <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 text-[#5C1F1C]" />,
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="bg-white text-gray-800 p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 transform hover:-translate-y-2 transition-all duration-300 group"
              >
                <CardContent className="p-0 flex flex-col items-center">
                  <div className="mb-4 sm:mb-6 p-4 bg-orange-50 rounded-full group-hover:bg-[#FFC727] transition-colors duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4" style={{ color: "#5C1F1C" }}>
                    {value.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
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