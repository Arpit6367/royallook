"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import Link from "next/link"; // Ensure Link is imported from next/link

// Brand Colors
const primaryColor = "#5C1F1C";
const accentColor = "#FFC727";
const white = "#FFFFFF";
const fontFamily = "'Poppins', 'Montserrat', 'Nunito', sans-serif";

function GlowingOrb({
  color = "blue",
  size = 200,
  position = { x: 50, y: 50 },
  mobileSize = 150,
  mobilePosition = { x: 50, y: 50 },
}) {
  return (
    <>
      {/* Desktop */}
      <motion.div
        className="absolute rounded-full blur-3xl opacity-30 hidden md:block"
        style={{
          width: size,
          height: size,
          left: `${position.x}%`,
          top: `${position.y}%`,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Mobile */}
      <motion.div
        className="absolute rounded-full blur-3xl opacity-30 md:hidden"
        style={{
          width: mobileSize,
          height: mobileSize,
          left: `${mobilePosition.x}%`,
          top: `${mobilePosition.y}%`,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
}

function ThreeDCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
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
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => setRotate({ x: 0, y: 0 });

  return (
    <motion.div
      ref={cardRef}
      className={`transform-gpu transition-all duration-300 ease-out ${className}`}
      style={{
        transform: `perspective(1200px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      q: "What time are the classes?",
      a: "We run classes on weekdays 4 PM – 8 PM and weekends 9 AM – 6 PM. Morning, afternoon and evening batches are available. New batches start every month.",
    },
    {
      q: "Are there any pre-requisites?",
      a: "No prior chess knowledge is required. Our beginner program starts from the fundamentals and builds a strong foundation.",
    },
    {
      q: "Can I get a discount?",
      a: "Yes! Quarterly plans give 10% off, family packages and school-partnership discounts are also available.",
    },
    {
      q: "Who will take my classes?",
      a: "All sessions are conducted by FIDE-rated coaches (2000+ ELO) with an average of 8+ years teaching experience.",
    },
    {
      q: "Is there a weekend-only batch?",
      a: "Absolutely – we have dedicated Saturday & Sunday batches (9 AM – 6 PM). You can pick the slot that fits your schedule.",
    },
  ];

  return (
    <section className="py-16 md:py-30 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <GlowingOrb
        color="#FFC727"
        size={600}
        position={{ x: 10, y: 20 }}
        mobileSize={200}
        mobilePosition={{ x: 20, y: 10 }}
      />
      <GlowingOrb
        color="#FF8C42"
        size={500}
        position={{ x: 90, y: 80 }}
        mobileSize={180}
        mobilePosition={{ x: 80, y: 90 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left – Title + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8 text-center lg:text-left"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight">
              Have <span className="block">Questions?</span>
              <span style={{ color: primaryColor }}>We’re here to answer them.</span>
            </h2>
            <Link href="/contact" target="_blank">
              <Button
                className="w-full sm:w-auto bg-gradient-to-r from-[#FFC727] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FFC727] text-[#5C1F1C] font-bold text-base sm:text-lg px-8 py-6 rounded-full shadow-2xl hover:shadow-yellow-500/40 transform hover:scale-105 transition-all duration-300 group"
              >
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2 group-hover:scale-110 transition-transform" />
                Book a Free Trial
              </Button>
            </Link>
          </motion.div>

          {/* Right – Gradient Accordion */}
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <ThreeDCard className="rounded-2xl overflow-hidden shadow-xl border-0">
                  <div className="bg-gradient-to-br from-[#5C1F1C] via-[#8B4513] to-[#A0522D] p-1 rounded-2xl">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl">
                      <button
                        onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-4 sm:p-6 text-left group"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <motion.div
                            animate={{ rotate: openFAQ === idx ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-[#5C1F1C]"
                          >
                            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                          </motion.div>
                          <p className="text-base sm:text-lg font-semibold text-gray-800 pr-2">
                            {item.q}
                          </p>
                        </div>
                      </button>

                      <AnimatePresence>
                        {openFAQ === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-gray-200">
                              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                {item.a}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </ThreeDCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const inquiryTypes = [
    "General Information",
    "Course Enrollment",
    "Private Coaching",
    "Tournament Registration",
    "Workshop Booking",
    "Partnership Inquiry",
    "Media & Press",
    "Other",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct Mailto link
    const recipient = "contact@chesspure.com";
    const mailSubject = encodeURIComponent(formData.subject || "Contact Inquiry - Chess Pure");
    
    // Construct Email Body
    const bodyLines = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone || "Not provided"}`,
      `Inquiry Type: ${formData.inquiryType}`,
      `--------------------------------------`,
      `Message:`,
      formData.message
    ];
    
    const mailBody = encodeURIComponent(bodyLines.join("\n"));

    // Trigger Mail Client
    window.location.href = `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;

    // Show success UI
    setIsSubmitted(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      inquiryType: "",
    });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ fontFamily }}>
      {/* Hero Section */}
      <section
        className="relative py-24 sm:py-32 md:py-40 text-white overflow-hidden text-center"
        style={{
          backgroundImage: 'url("/conbg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Badge
            className="mb-3 sm:mb-4 text-sm sm:text-lg px-4 py-1"
            style={{ backgroundColor: accentColor, color: primaryColor }}
          >
            Get In Touch
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed px-4">
            Ready to start your chess journey? We're here to help every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Form - 2 Column Layout */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* LEFT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
              <img
                src="/conknight.png"
                alt="Contact Illustration"
                className="w-full h-auto object-cover aspect-video lg:aspect-auto lg:h-[550px] xl:h-[650px]"
              />
            </div>
          </motion.div>

          {/* RIGHT FORM */}
          <ThreeDCard className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-br from-[#5C1F1C] via-[#8B4513] to-[#A0522D] p-1 sm:p-1.5 rounded-3xl">
              <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-8 text-center"
                  style={{ color: primaryColor }}
                >
                  Send a Message
                </h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12 sm:py-16"
                  >
                    <CheckCircle className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6" style={{ color: "#10B981" }} />
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3" style={{ color: "#10B981" }}>
                      Opening Email Client...
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-lg">
                      Please send the draft in your mail app. We'll get back to you soon!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <Label htmlFor="name" className="font-semibold text-gray-800 text-sm sm:text-base">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                          className="mt-1.5 h-11 sm:h-12 bg-white/80 border-gray-300 focus:border-[#5C1F1C] text-sm sm:text-base"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="font-semibold text-gray-800 text-sm sm:text-base">Email *</Label>
                        <Input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          className="mt-1.5 h-11 sm:h-12 bg-white/80 border-gray-300 focus:border-[#5C1F1C] text-sm sm:text-base"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <Label htmlFor="phone" className="font-semibold text-gray-800 text-sm sm:text-base">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="mt-1.5 h-11 sm:h-12 bg-white/80 border-gray-300 text-sm sm:text-base"
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div>
                        <Label className="font-semibold text-gray-800 text-sm sm:text-base">Inquiry Type *</Label>
                        <Select
                          value={formData.inquiryType}
                          onValueChange={(value) => handleInputChange("inquiryType", value)}
                          required
                        >
                          <SelectTrigger className="mt-1.5 h-11 sm:h-12 bg-white/80 border-gray-300 text-sm sm:text-base">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {inquiryTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="font-semibold text-gray-800 text-sm sm:text-base">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        required
                        className="mt-1.5 h-11 sm:h-12 bg-white/80 border-gray-300 text-sm sm:text-base"
                        placeholder="Course inquiry"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="font-semibold text-gray-800 text-sm sm:text-base">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        rows={4}
                        required
                        className="mt-1.5 bg-white/80 border-gray-300 text-sm sm:text-base min-h-[100px]"
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full py-6 sm:py-7 text-base sm:text-lg font-bold rounded-2xl bg-gradient-to-r from-[#FFC727] to-[#FFD700] text-[#5C1F1C] hover:shadow-xl hover:shadow-yellow-500/40 transform hover:scale-105 transition-all duration-300"
                    >
                      Draft Email <Send className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </ThreeDCard>
        </div>
      </section>

      {/* How to Reach Us */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-12 sm:mb-16"
            style={{ color: primaryColor }}
          >
            How to Reach Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {[
              {
                icon: MapPin,
                title: "Visit Us",
                details: ["Plot No 401, Green Valley, Behind 36inn, SBI Street, Yendada-530045"],
              },
              {
                icon: Phone,
                title: "Call Us",
                details: ["Office: +91-7981240311", "WhatsApp: +91-7981240311"],
              },
              {
                icon: Mail,
                title: "Email",
                details: ["contact@chesspure.com"],
              },
              {
                icon: Clock,
                title: "Hours",
                details: ["Mon-Sun: 10 AM to 8 PM"],
              },
            ].map(({ icon: Icon, title, details }, idx) => (
              <ThreeDCard key={idx} className="rounded-2xl overflow-hidden shadow-xl h-full">
                <div className="bg-gradient-to-br from-[#5C1F1C] via-[#8B4513] to-[#A0522D] p-1 rounded-2xl h-full">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 sm:p-6 h-full text-center flex flex-col justify-center">
                    <div
                      className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-5 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Icon className="w-6 h-6 sm:w-9 sm:h-9 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: primaryColor }}>
                      {title}
                    </h3>
                    {details.map((d, i) => (
                      <p key={i} className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                        {d}
                      </p>
                    ))}
                  </div>
                </div>
              </ThreeDCard>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />
    </div>
  );
}