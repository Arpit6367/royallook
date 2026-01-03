import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

// Brand Colors
const primaryColor = "#5C1F1C";     // Deep brown (footer bg)
const accentColor = "#FFC727";      // Gold/yellow (accents)
const white = "#FFFFFF";
const textLight = "#FFFFFF";        // White text on dark bg
const textMuted = "#D4AF37";        // Muted gold for secondary text
const fontFamily = "'Poppins', 'Montserrat', 'Nunito', sans-serif";

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
    <footer
      className="text-white"
      style={{ backgroundColor: primaryColor, fontFamily }}
    >
      <div className="container mx-auto px-4 py-10 sm:py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Academy Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              >
                <span className="text-xl font-bold" style={{ color: primaryColor }}>
                  ♔
                </span>
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">ChessPure Academy</h3>
                <p className="text-xs" style={{ color: textMuted }}>
                  Professional Chess Training
                </p>
              </div>
            </div>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: textLight }}>
              Dedicated to world-class chess education and building champions from Visakhapatnam to the world.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                    style={{ backgroundColor: accentColor }}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" style={{ color: primaryColor }} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-4" style={{ color: accentColor }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="block py-1 transition-colors hover:underline"
                    style={{ color: textLight }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-4" style={{ color: accentColor }}>
              Programs
            </h4>
            <ul className="space-y-2.5 text-sm">
              {programs.map((program, index) => (
                <li key={index}>
                  <Link
                    href={program.href}
                    className="block py-1 text-white/80 transition-colors hover:text-[#FFC727]"
                  >
                    {program.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-4" style={{ color: accentColor }}>
              Contact Info
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                <div>
                  <p style={{ color: textLight }}>+91 7981240311</p>
                  <p className="text-xs" style={{ color: textMuted }}>Mon - Sun, 10 AM - 8 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                <div>
                  <p style={{ color: textLight }}>contact@chesspure.com</p>
                  <p className="text-xs" style={{ color: textMuted }}>Response within 24 hrs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                <div>
                  <p style={{ color: textLight }}>Visakhapatnam, Andhra Pradesh</p>
                  <p className="text-xs" style={{ color: textMuted }}>India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-10 pt-6" style={{ borderColor: accentColor + "40" }}>
          <div className="flex flex-col sm:flex-row sm:justify-between items-center text-xs gap-4">
            <p style={{ color: textMuted }}>
              © 2025 ChessPure Academy. All rights reserved.
            </p>

            <p style={{ color: textMuted }} className="text-center sm:text-left">
              India • {currentTime}
            </p>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link
                href="/terms"
                className="hover:underline transition-colors"
                style={{ color: textMuted }}
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="hover:underline transition-colors"
                style={{ color: textMuted }}
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}