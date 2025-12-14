"use client";

import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
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

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    {
      name: "About",
      href: "/about"
    },
    { name: "Courses", href: "/courses" },
    { name: "Gallery", href: "/gallery" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <style jsx>{`
        :root {
          --primary: #ffffff;
          --accent: #FFD700;
          --text-dark: #5C1F1C;
          --text-light: #74292F;
        }
        .nav-link {
          @apply font-medium text-gray-800 hover:text-[#5C1F1C] transition-colors duration-200;
        }
        .dropdown-link {
          @apply block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-[#5C1F1C] transition-colors;
        }
        @media (hover: none) {
          .nav-link:hover {
            color: inherit;
          }
        }
      `}</style>

      <header className="bg-white shadow-md fixed w-full z-50 top-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo + Title */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <Image
                  src="/logo.webp"
                  alt="Chesspure Academy Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain transition-transform group-hover:scale-110"
                  priority
                />
              </div>
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 tracking-tight">
                Chesspure <span className="text-yellow-500">Academy</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setIsAboutOpen(!isAboutOpen)}
                        className="nav-link flex items-center space-x-1 px-3 py-2 rounded-md text-base"
                        aria-expanded={isAboutOpen}
                        aria-haspopup="true"
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isAboutOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isAboutOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-yellow-200 overflow-hidden z-50"
                            onClick={() => setIsAboutOpen(false)}
                          >
                            {item.dropdownItems?.map((dropItem) => (
                              <Link
                                key={dropItem.name}
                                href={dropItem.href}
                                className="dropdown-link"
                              >
                                {dropItem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="nav-link px-3 py-2 rounded-md text-base whitespace-nowrap"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Desktop Auth Nav */}
              <div className="ml-4">
                <AuthNav />
              </div>
            </nav>

            {/* Mobile Header Controls */}
            {/* CHANGED: Removed AuthNav from here to prevent overcrowding */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-800 hover:bg-gray-100 transition-colors"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMobileMenuOpen ? "close" : "open"}
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-white border-t border-gray-200 overflow-hidden shadow-lg"
            >
              <div className="px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => setIsAboutOpen(!isAboutOpen)}
                          className="flex items-center justify-between w-full text-left nav-link py-3 text-base font-medium"
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            className={`w-5 h-5 transition-transform ${
                              isAboutOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isAboutOpen && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-4 mt-1 space-y-1 overflow-hidden border-l-2 border-gray-100 pl-2"
                            >
                              {item.dropdownItems?.map((dropItem) => (
                                <Link
                                  key={dropItem.name}
                                  href={dropItem.href}
                                  className="block py-2 pl-3 pr-4 text-sm text-gray-700 hover:text-[#5C1F1C] rounded-md"
                                  onClick={() => {
                                    setIsAboutOpen(false);
                                    setIsMobileMenuOpen(false);
                                  }}
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
                        className="block nav-link py-3 text-base font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* CHANGED: Added AuthNav here with isMobile prop */}
                <AuthNav isMobile={true} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}