"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Star, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";

export function AchievementsSection() {
    const achievements = [
        {
            icon: Trophy,
            count: "50+",
            label: "Tournament Wins",
            description: "State & National level victories",
            accentColor: "#FFDA44",
        },
        {
            icon: Crown,
            count: "3",
            label: "Grandmasters",
            description: "Produced by our academy",
            accentColor: "#E76F51",
        },
        {
            icon: Medal,
            count: "100+",
            label: "Rated Players",
            description: "FIDE rated students",
            accentColor: "#2A9D8F",
        },
        {
            icon: Star,
            count: "100%",
            label: "Success Rate",
            description: "Improvement in 6 months",
            accentColor: "#F4A261",
        },
    ];

    return (
        <section className="py-24 px-6 bg-white relative overflow-hidden">
            {/* Background texture */}
            <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyRDJBMjYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-sm font-bold uppercase tracking-widest text-[#E76F51] mb-4 block"
                    >
                        Proven Excellence
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2D2A26] mb-6"
                    >
                        Our <span className="text-[#E76F51]">Success Stories</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-[#5C5852] max-w-2xl mx-auto"
                    >
                        Numbers that reflect our commitment to building champions.
                    </motion.p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {achievements.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div
                                    className="relative bg-[#FDFBF7] rounded-[2rem] p-8 h-full text-center border-2 border-transparent hover:border-current transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                                    style={{ borderColor: 'transparent' }}
                                >
                                    {/* Top accent bar */}
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1.5 rounded-t-[2rem]"
                                        style={{ backgroundColor: item.accentColor }}
                                    />

                                    <div
                                        className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg"
                                        style={{ backgroundColor: `${item.accentColor}20` }}
                                    >
                                        <Icon className="w-8 h-8" style={{ color: item.accentColor }} />
                                    </div>

                                    <motion.h3
                                        className="text-5xl md:text-6xl font-black text-[#2D2A26] mb-2"
                                        initial={{ scale: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {item.count}
                                    </motion.h3>
                                    <h4 className="text-lg font-bold text-[#2D2A26] mb-1">{item.label}</h4>
                                    <p className="text-sm text-[#5C5852]">{item.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <Link href="/achievements" className="inline-flex items-center gap-2 text-[#E76F51] font-bold hover:underline group">
                        View All Achievements <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
