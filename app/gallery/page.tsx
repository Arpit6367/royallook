"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera, Trophy, Users, BookOpen, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Brand Colors
const primaryColor = "#5C1F1C";
const accentColor = "#FFC727";
const fontFamily = "'Poppins', 'Montserrat', 'Nunito', sans-serif";

const galleryCategories = [
  { id: "all", name: "All Photos", icon: Camera },
  { id: "tournaments", name: "Tournaments", icon: Trophy },
  { id: "certificate", name: "Certificates", icon: Users },
  { id: "events", name: "Events", icon: BookOpen },
];

// Dummy Images
const dummyImages = [
  "/homepage.jpeg",
  "/gallery1.avif",
  "/gallery3.avif",
  "/gallery6.avif",
  "/gallery7.avif",
  "/gallery8.avif",
  "/gallery2.webp",
  "/gallery4.avif",
  "/gallery5.webp",
  "/gallery9.webp",
  "/gal1.jpeg",
  "/gal2.jpeg",
  "/gal3.jpeg",
];

const galleryImages = [
  {
    id: 1,
    src: dummyImages[0],
    alt: "National Chess Championship 2025",
    category: "tournaments",
    title: "National Championship",
    description: "Top players compete for the national title",
  },
  {
    id: 2,
    src: dummyImages[1],
    alt: "Beginner Chess Workshop",
    category: "tournaments",
    title: "Beginner Bootcamp",
    description: "Young learners mastering the basics",
  },
  {
    id: 3,
    src: dummyImages[2],
    alt: "Advanced Tactics Class",
    category: "tournaments",
    title: "Tactics Mastery",
    description: "Solving complex puzzles and strategies",
  },
  {
    id: 4,
    src: dummyImages[3],
    alt: "FIDE Arbiter Certificate",
    category: "certificate",
    title: "FIDE Arbiter",
    description: "Certified by International Chess Federation",
  },
  {
    id: 5,
    src: dummyImages[4],
    alt: "National Arbiter Award",
    category: "certificate",
    title: "National Arbiter",
    description: "Recognized by All India Chess Federation",
  },
  {
    id: 6,
    src: dummyImages[5],
    alt: "Arena International Master",
    category: "certificate",
    title: "Arena International Master",
    description: "Top-rated online chess achievement",
  },
  {
    id: 7,
    src: dummyImages[6],
    alt: "Inter-School Chess Event",
    category: "events",
    title: "Inter-School Championship",
    description: "50+ schools participated in the annual event",
  },
  {
    id: 8,
    src: dummyImages[7],
    alt: "Summer Chess Camp",
    category: "events",
    title: "Summer Chess Camp",
    description: "Fun learning with grandmaster coaches",
  },
  {
    id: 9,
    src: dummyImages[8],
    alt: "Summer Chess Camp",
    category: "events",
    title: "Summer Chess Camp",
    description: "Fun learning with grandmaster coaches",
  },
  {
    id: 10,
    src: dummyImages[9],
    alt: "Summer Chess Camp",
    category: "events",
    title: "Summer Chess Camp",
    description: "Fun learning with grandmaster coaches",
  },
  {
    id: 11,
    src: dummyImages[10],
    alt: "Summer Chess Camp",
    category: "events",
    title: "Summer Chess Camp",
    description: "Fun learning with grandmaster coaches",
  },
  {
    id: 12,
    src: dummyImages[11],
    alt: "Summer Chess Camp",
    category: "events",
    title: "Summer Chess Camp",
    description: "Fun learning with grandmaster coaches",
  },
  {
    id: 13,
    src: dummyImages[12],
    alt: "Summer Chess Camp",
    category: "events",
    title: "Summer Chess Camp",
    description: "Fun learning with grandmaster coaches",
  },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<(typeof galleryImages)[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const openLightbox = (image: typeof galleryImages[0]) => {
    setSelectedImage(image);
    setCurrentImageIndex(filteredImages.findIndex((img) => img.id === image.id));
  };

  const closeLightbox = () => setSelectedImage(null);

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  return (
    <div className="min-h-screen" style={{ fontFamily }}>
      {/* Hero Section - Responsive */}
      <section
        className="relative py-30 sm:py-28 md:py-36 lg:py-40 text-white overflow-hidden"
        style={{
          backgroundImage: 'url("/galbg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6">
              Chess Gallery
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
              Capturing moments of learning, competition, and chess excellence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar - Responsive */}
      <section className="py-6 sm:py-8 border-b" style={{ backgroundColor: primaryColor, borderColor: "#4A1A17" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
              {galleryCategories.map((category) => {
                const Icon = category.icon;
                const selected = selectedCategory === category.id;
                return (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 font-medium text-xs sm:text-sm
                      ${selected
                        ? "bg-white text-[#5C1F1C] shadow-lg scale-105"
                        : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                      }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> {category.name}
                  </Button>
                );
              })}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 sm:gap-2 rounded-lg p-1" style={{ backgroundColor: "#4A1A17" }}>
              <Button
                onClick={() => setViewMode("grid")}
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="px-3 sm:px-4 text-white text-xs sm:text-sm"
                style={{ backgroundColor: viewMode === "grid" ? accentColor : "transparent" }}
              >
                <Grid3X3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Grid
              </Button>
              <Button
                onClick={() => setViewMode("masonry")}
                variant={viewMode === "masonry" ? "default" : "ghost"}
                size="sm"
                className="px-3 sm:px-4 text-white text-xs sm:text-sm"
                style={{ backgroundColor: viewMode === "masonry" ? accentColor : "transparent" }}
              >
                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Masonry
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid - Responsive */}
      <section className="py-10 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                : "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6"
            }
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group cursor-pointer break-inside-avoid"
                onClick={() => openLightbox(image)}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={800}
                    height={600}
                    className={`w-full object-cover transition-transform duration-300 ${
                      viewMode === "grid" ? "h-56 sm:h-64 lg:h-72" : "h-auto"
                    } group-hover:scale-105`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                    </div>
                  </div>
                  <div
                    className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {galleryCategories.find((cat) => cat.id === image.category)?.name || "Other"}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox - Responsive & Touch-Friendly */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6"
          onClick={closeLightbox}
        >
          <div className="relative w-full max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl p-1 sm:p-2">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg"
                sizes="90vw"
              />
            </div>

            {/* Close Button */}
            <Button
              onClick={closeLightbox}
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 border border-white/30 text-white hover:bg-white hover:text-[#5C1F1C] rounded-full"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>

            {/* Prev Button */}
            <Button
              onClick={prevImage}
              variant="outline"
              size="icon"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 border border-white/30 text-white hover:bg-white hover:text-[#5C1F1C] rounded-full"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>

            {/* Next Button */}
            <Button
              onClick={nextImage}
              variant="outline"
              size="icon"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 border border-white/30 text-white hover:bg-white hover:text-[#5C1F1C] rounded-full"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>

            {/* Caption */}
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 rounded-lg sm:rounded-xl bg-white/95 backdrop-blur-sm p-3 sm:p-4 shadow-lg">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2" style={{ color: primaryColor }}>
                {selectedImage.title}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-700">{selectedImage.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}