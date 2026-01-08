"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Crown,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

// Brand Colors
const primaryColor = "#5C1F1C";     // Deep brown (footer bg)
const accentColor = "#FFDA44";      // Gold/yellow (accents)
const textLight = "#FFFFFF";        // White text
const textMuted = "#FDFBF7";        // Warm cream for secondary text

export function Footer() {
  const currentTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/chessacademy", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/chesspure", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/chesspureacademy", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/@chesspureacademy", label: "YouTube" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Courses", href: "/courses" },
    { name: "Coaches", href: "/coaches" },
    { name: "Events", href: "/events" },
    { name: "Contact", href: "/contact" },
  ];

  const programs = [
    { name: "Beginner Course", href: "/courses" },
    { name: "Intermediate", href: "/courses" },
    { name: "Advanced Coaching", href: "/courses" },
    { name: "Tournament Prep", href: "/courses" },
  ];

  return (
    <footer className="relative text-white font-sans overflow-hidden" style={{ backgroundColor: primaryColor }}>
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FFDA44] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>

      <div className="container mx-auto px-4 py-16 sm:py-20 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Academy Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundColor: accentColor }}
              >
                <Crown className="w-7 h-7" style={{ color: primaryColor }} />
              </div>
              <div>
                <h3 className="font-bold text-xl leading-none tracking-tight">Royal Look<br />Academy</h3>
              </div>
            </Link>

            <p className="text-sm mb-8 leading-relaxed opacity-90 max-w-xs" style={{ color: textMuted }}>
              Dedicated to world-class chess education and building champions from Visakhapatnam to the world stage.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, backgroundColor: textLight }}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-white/10 hover:text-[#5C1F1C] border border-white/10"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#FFDA44] rounded-full"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 py-1 transition-all hover:translate-x-1 hover:text-[#FFDA44] opacity-80 hover:opacity-100"
                  >
                    <ArrowRight className="w-3 h-3 text-[#FFDA44]" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-bold text-lg mb-6 relative inline-block">
              Programs
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#FFDA44] rounded-full"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              {programs.map((program, index) => (
                <li key={index}>
                  <Link
                    href={program.href}
                    className="flex items-center gap-2 py-1 transition-all hover:translate-x-1 hover:text-[#FFDA44] opacity-80 hover:opacity-100"
                  >
                    <ArrowRight className="w-3 h-3 text-[#FFDA44]" />
                    {program.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#FFDA44] rounded-full"></span>
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Phone className="w-5 h-5 text-[#FFDA44]" />
                </div>
                <div>
                  <p className="font-bold text-base hover:text-[#FFDA44] transition-colors cursor-pointer">+91 0000000000</p>
                  <p className="text-xs opacity-60">Mon - Sun, 10 AM - 8 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Mail className="w-5 h-5 text-[#FFDA44]" />
                </div>
                <div>
                  <p className="font-bold text-base hover:text-[#FFDA44] transition-colors cursor-pointer">contact@royallookchess.com</p>
                  <p className="text-xs opacity-60">Response within 24 hrs</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-[#FFDA44]" />
                </div>
                <div>
                  <p className="font-medium hover:text-[#FFDA44] transition-colors cursor-pointer">Visakhapatnam, Andhra Pradesh, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs opacity-60 gap-4">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} Royal Look Chess Academy. All rights reserved. • India Time: {currentTime}
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/terms" className="hover:text-[#FFDA44] hover:underline transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="hover:text-[#FFDA44] hover:underline transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}