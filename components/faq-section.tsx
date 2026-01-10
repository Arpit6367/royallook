"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
    const faqs = [
        {
            question: "What is the best age to start chess?",
            answer: "We recommend starting as early as 5-6 years old. This is when cognitive development is rapid, and children can easily grasp logic and pattern recognition. However, it's never too late to learn!",
        },
        {
            question: "Do you offer online classes?",
            answer: "Yes! We have a robust online training platform with live interactive sessions, grandmaster webinars, and digital homework. We train students from over 15 countries.",
        },
        {
            question: "How long does it take to get a FIDE rating?",
            answer: "Typically, with consistent training (2-3 times/week) and regular tournament participation, a dedicated student can achieve an initial FIDE rating within 12-18 months.",
        },
        {
            question: "Is trial class available?",
            answer: "Absolutely. We offer a free 30-minute assessment and trial session to gauge the student's level and recommend the right course.",
        },
        {
            question: "What is the student-to-coach ratio?",
            answer: "For group classes, we maintain a strict 8:1 ratio to ensure personal attention. For elite batches, it's 4:1. One-on-one coaching is also available.",
        },
    ];

    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-sm font-bold uppercase tracking-wider text-[#E76F51] mb-2 block">
                        Got Questions?
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#2D2A26] mb-6">
                        Frequently Asked <span className="text-[#E76F51]">Questions</span>
                    </h2>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border border-[#E6E0D4] rounded-2xl px-6 bg-[#FDFBF7] data-[state=open]:border-[#E76F51] transition-all"
                        >
                            <AccordionTrigger className="text-lg font-bold text-[#2D2A26] hover:text-[#E76F51] hover:no-underline py-6">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-[#5C5852] text-base leading-relaxed pb-6">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
