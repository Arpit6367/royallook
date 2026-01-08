"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Menu, X, Crown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AuthNav } from "./auth-nav";

interface NavItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; href: string }[];
}

export function Header() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Courses", href: "/courses" },
    { name: "Gallery", href: "/gallery" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact", href: "/contact" },
  ];

  const primaryColor = "#5C1F1C";
  const accentColor = "#FFDA44";

  return (
    <>
      <header
        className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-2" : "bg-white py-4"
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* Logo + Title */}
            <Link href="/" className="flex items-center space-x-3 group animate-fade-in-up">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#FFDA44]/20 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-[#5C1F1C]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base md:text-lg font-bold text-[#2D2A26] tracking-tight leading-none group-hover:text-[#5C1F1C] transition-colors">
                  ROYAL LOOK
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#FFDA44] tracking-widest uppercase">
                  Academy
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.hasDropdown ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsAboutOpen(!isAboutOpen)}
                        className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-[#2D2A26] hover:text-[#5C1F1C] hover:bg-[#FFDA44]/10 transition-all"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isAboutOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {isAboutOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#FFE082] overflow-hidden p-1"
                          >
                            {item.dropdownItems?.map((dropItem) => (
                              <Link
                                key={dropItem.name}
                                href={dropItem.href}
                                className="block px-4 py-2 text-sm text-[#5C5852] hover:bg-[#FFF8E1] hover:text-[#5C1F1C] rounded-lg transition-colors"
                              >
                                {dropItem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="relative px-4 py-2 text-sm font-bold text-[#2D2A26] transition-colors group-hover:text-[#5C1F1C]"
                    >
                      {item.name}
                      <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#FFDA44] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </Link>
                  )}
                </div>
              ))}

              {/* Desktop Auth Nav */}
              <div className="ml-6 pl-6 border-l border-gray-200">
                <AuthNav />
              </div>
            </nav>

            {/* Mobile Header Controls */}
            <div className="lg:hidden flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-[#2D2A26] bg-gray-50 hover:bg-[#FFF8E1] transition-colors border border-gray-100"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMobileMenuOpen ? "close" : "open"}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Full Width */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "100vh", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed inset-0 top-[72px] bg-[#FDFBF7] z-40 overflow-y-auto pb-20"
            >
              <div className="px-6 py-8 space-y-2">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block p-4 text-lg font-bold text-[#2D2A26] border-b border-[#E6E0D4] active:bg-[#FFDA44]/20 rounded-xl transition-colors"
                    >
                      <span className="flex items-center justify-between">
                        {item.name}
                        <ChevronDown className="-rotate-90 text-[#FFDA44] opacity-50" />
                      </span>
                    </Link>
                  </motion.div>
                ))}

                <div className="mt-8 p-4 bg-white rounded-2xl border border-[#E6E0D4] shadow-sm">
                  <p className="text-xs font-bold text-[#E76F51] uppercase tracking-wide mb-4 text-center">Student Access</p>
                  <AuthNav isMobile={true} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}