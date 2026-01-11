"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Trophy,
    Star,
    Medal,
    Crown,
    Filter,
    Calendar as CalendarIcon,
    Users,
    Lightbulb,
    Target
} from "lucide-react";
import { format } from "date-fns";
import { AchievementsSection } from "@/components/achievements-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Card } from "@/components/ui/card";

export default function AchievementsPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");

    const achievements = [
        {
            id: 1,
            title: "State Championship Win",
            category: "tournament",
            date: "2025-12-20",
            description: "Our student Rahul secured 1st place in the Under-14 category at the Royal State Open with a perfect score of 9/9.",
            image: "/blog-1.jpeg",
            award: "Gold Medal + Trophy"
        },
        {
            id: 2,
            title: "New Grandmaster Title",
            category: "title",
            date: "2025-11-15",
            description: "Coach Rajesh Kumar achieved his final GM norm at the International Chess Festival, becoming the city's first Grandmaster.",
            image: "/blog-2.jpg",
            award: "Grandmaster Title"
        },
        {
            id: 3,
            title: "National Team Selection",
            category: "selection",
            date: "2025-10-05",
            description: "Three of our academy students were selected to represent the state in the upcoming National Juniors Championship.",
            image: "/blog-3.webp",
            award: "State Team Jersey"
        },
        {
            id: 4,
            title: "Best Academy Award",
            category: "academy",
            date: "2025-09-12",
            description: "Royal Look Academy was voted 'Best Chess Academy' in the region for the third consecutive year.",
            image: "/blog-4.png",
            award: "Excellence Award"
        },
        {
            id: 5,
            title: "Inter-School Champions",
            category: "tournament",
            date: "2025-08-30",
            description: "Our junior team swept the Inter-School Chess Championship, winning gold in all three age categories.",
            image: "/blog-5.jpg",
            award: "Team Trophy"
        },
        {
            id: 6,
            title: "Rising Star: Ananya",
            category: "student",
            date: "2025-08-15",
            description: "8-year-old Ananya defeated a rated player (1800 ELO) in a simul exhibition, showing incredible promise.",
            image: "/blog-1.jpeg",
            award: "Young Achiever"
        },
    ];

    const categories = [
        { id: "all", name: "All Achievements", icon: Trophy },
        { id: "tournament", name: "Tournaments", icon: Medal },
        { id: "title", name: "Titles", icon: Crown },
        { id: "student", name: "Student Success", icon: Star },
        { id: "academy", name: "Academy", icon: Trophy },
    ];

    const dummyImages = [
        "/image.jpg", "/image1.jpg", "/image13.jpg",
        "/image3.jpg", "/image4.jpg", "/image5.jpg",
        "/image6.jpg", "/image7.jpg", "/image13.jpg",
        "/image9.jpg", "/image10.jpg", "/image11.jpg", "/image12.jpg"
    ];

    const filteredAchievements =
        selectedCategory === "all"
            ? achievements
            : achievements.filter((item) => item.category === selectedCategory);

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-[#E76F51]/20">

            {/* 1. HERO */}
            <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
                {/* Background "Film Strip" Effect */}
                <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden select-none">
                    <div className="grid grid-cols-4 gap-4 transform -rotate-12 scale-110">
                        {dummyImages.slice(0, 8).map((src, i) => (
                            <div key={i} className="aspect-square relative grayscale">
                                <Image src={src} alt="" fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#E76F51] mb-4 block">
                            Excellence & Glory
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-[#2D2A26] mb-6 leading-tight tracking-tight">
                            Hall of <span className="italic font-serif text-[#E76F51]">Fame</span>
                        </h1>
                        <p className="text-xl text-[#5C5852] max-w-2xl mx-auto leading-relaxed">
                            Celebrating the triumphs, milestones, and hard-earned victories of our students and coaches.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. SHARED ACHIEVEMENTS SECTION (Stats) */}
            <AchievementsSection />

            {/* 3. MAIN HALL OF FAME CONTENT */}
            <section className="py-16 px-6 bg-white" id="hall-of-fame">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2A26]">Latest Victories</h2>
                    </div>

                    {/* Filters */}
                    <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-y border-[#E6E0D4] py-4 mb-12">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0 justify-center md:justify-start">
                                {categories.map((cat) => {
                                    const Icon = cat.icon;
                                    const isActive = selectedCategory === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${isActive
                                                ? "bg-[#2D2A26] text-white shadow-lg scale-105"
                                                : "bg-white border border-[#E6E0D4] text-[#5C5852] hover:border-[#E76F51] hover:text-[#E76F51]"
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {cat.name}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredAchievements.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className="group relative bg-white rounded-3xl border border-[#E6E0D4] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col sm:flex-row h-full">
                                    <div className="relative w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <Badge className="bg-[#FFDA44] text-[#2D2A26] hover:bg-[#FFDA44] border-none font-bold">
                                                {item.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="relative w-full sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold text-[#2D2A26] mb-2 group-hover:text-[#E76F51] transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-[#5C5852] font-medium mb-4">
                                                <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4" /> {format(new Date(item.date), "MMM d, yyyy")}</span>
                                            </div>
                                            <p className="text-[#5C5852]/80 text-sm leading-relaxed mb-6 line-clamp-3">
                                                {item.description}
                                            </p>
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-[#E6E0D4] flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[#E76F51] font-bold text-sm">
                                                <Trophy className="w-4 h-4" />
                                                {item.award}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. MENTORSHIP SECTION */}
            <section className="py-24 px-6 bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="w-full md:w-1/2 space-y-8 order-2 md:order-1">
                        <span className="text-sm font-bold uppercase tracking-wider text-[#E76F51]">World-Class Coaching</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#2D2A26]">
                            Guided by <span className="text-[#E76F51]">Masters</span>
                        </h2>
                        <p className="text-xl text-[#5C5852] leading-relaxed">
                            Our achievements are a direct reflection of our coaching philosophy. We don't just teach moves; we cultivate champions through personalized mentorship from FIDE-rated coaches and Grandmasters.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "1-on-1 Grandmaster Sessions",
                                "Personalized Opening Reportoire",
                                "Psychological Match Preparation",
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[#2D2A26] font-bold">
                                    <div className="w-8 h-8 rounded-full bg-[#FFDA44]/20 flex items-center justify-center">
                                        <Medal className="w-4 h-4 text-[#2D2A26]" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-full md:w-1/2 order-1 md:order-2">
                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl skew-y-3 border-4 border-white">
                            <Image src="/image5.jpg" alt="Mentorship" fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#E76F51]/20 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. LEARNING ENVIRONMENT SECTION */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-bold uppercase tracking-wider text-[#E76F51]">The Atmosphere</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#2D2A26] mt-2">
                            Where <span className="text-[#E76F51]">Growth</span> Happens
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Users, title: "Peer Learning", desc: "A collaborative environment where students challenge and learn from each other every day." },
                            { icon: Lightbulb, title: "Analysis Labs", desc: "Dedicated spaces and tools for deep diving into game analysis and engine preparation." },
                            { icon: Target, title: "Pro-Level Setup", desc: "Train on professional DGT boards and clocks to simulate real tournament pressure." },
                        ].map((item, i) => (
                            <Card key={i} className="p-8 bg-[#FDFBF7] border-none hover:bg-[#E76F51] hover:text-white transition-all duration-300 group rounded-[2rem]">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                    <item.icon className="w-7 h-7 text-[#E76F51]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="opacity-80 leading-relaxed font-medium">{item.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. REVIEWS SECTION (Shared) */}
            <TestimonialsSection />

            {/* 7. CTA SECTION */}
            <section className="relative py-22 bg-[#FDFBF7] text-[#2D2A26] overflow-hidden border-t border-[#E6E0D4]">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFDA44]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E76F51]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
                        Join the <br />
                        <span className="text-[#E76F51]">Winners Circle.</span>
                    </h2>
                    <p className="text-xl text-[#5C5852] mb-12 max-w-2xl mx-auto">
                        Your trophy is waiting. The journey to the podium starts with one decision.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link href="/contact">
                            <Button className="h-16 px-10 rounded-full bg-[#2D2A26] text-white text-lg font-bold hover:bg-[#E76F51] hover:text-white transition-all duration-300 shadow-2xl hover:shadow-[#E76F51]/20">
                                Start Training
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
