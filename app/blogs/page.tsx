"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Calendar, Clock, Eye, Heart, Search } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Brand Colors
const primaryColor = "#5C1F1C";
const accentColor = "#FFC727";

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

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const blogPosts = [
    {
      id: 1,
      title: "The Art of the Checkmate: 5 Patterns Every Player Must Know",
      excerpt:
        "From Scholar's Mate to Anastasia's Mate — master these 5 checkmate patterns to finish games in style.",
      content: `
# 5 Checkmate Patterns to Master

## 1. **Scholar's Mate** (4 moves)
The fastest checkmate — but deadly if your opponent isn't paying attention.

\`\`\`pgn
1.e4 e5 2.Qh5 Nc6 3.Bc4 Nf6?? 4.Qxf7#
\`\`\`

## 2. **Anastasia's Mate**
Queen + Knight combo on h7.

## 3. **Smothered Mate**
Knight delivers mate while king is trapped by own pieces.

## 4. **Back-Rank Mate**
Rook or Queen on the 8th rank.

## 5. **Arabian Mate**
Rook + Knight in the corner.

> **Pro Tip**: Always look for **queen + knight** or **rook + bishop** batteries near the enemy king.

---

Practice these daily. You'll spot them in your own games!
      `,
      author: "GM Vishal Kumar",
      authorImage: "/demo/author-1.jpg",
      date: "2025-11-08",
      readTime: "7 min",
      category: "checkmate",
      tags: ["Checkmate", "Tactics", "Patterns"],
      image: "/blog-1.jpeg",
      views: 4800,
      likes: 390,
    },
    {
      id: 2,
      title: "Why Your Child Should Play Chess: 7 Science-Backed Benefits",
      excerpt:
        "Boost IQ, focus, and emotional intelligence. Chess isn't just a game — it's brain training.",
      content: `
# Chess & Child Brain Development

## 1. **Improves Memory**
Harvard study: Chess players recall 30% more information.

## 2. **Boosts IQ**
Average **+8 IQ points** after 12 months of regular play.

## 3. **Enhances Focus**
40% longer attention span in chess-trained kids.

## 4. **Teaches Emotional Control**
Losing teaches resilience. Winning teaches humility.

## 5. **Better Math & Logic**
Top chess kids score **15% higher** in math.

## 6. **Develops Creativity**
Chess creates 10¹²⁰ possible games — more than atoms in the universe.

## 7. **Builds Confidence**
Every win is earned through skill, not luck.

---

> "Chess is mental torture." – Garry Kasparov  
> But it's also **mental training**.

Enroll your child today. The future starts with one move.
      `,
      author: "Dr. Neha Gupta",
      authorImage: "/demo/author-2.jpg",
      date: "2025-11-05",
      readTime: "9 min",
      category: "benefits",
      tags: ["Kids", "Science", "Brain"],
      image: "/blog-2.jpg",
      views: 6200,
      likes: 510,
    },
    {
      id: 3,
      title: "Ruy Lopez: The Spanish Torture Explained",
      excerpt:
        "The most respected opening in chess history. Learn the main lines and key ideas.",
      content: `
# Ruy Lopez (Spanish Opening)

**1.e4 e5 2.Nf3 Nc6 3.Bb5**

Used by every world champion. The "Spanish Torture" squeezes Black slowly.

## Main Lines

### 1. **Berlin Defense** (3...Nf6)
Carlsen's favorite. Leads to endgame.

### 2. **Morphy Defense** (3...a6)
The classical response.

### 3. **Closed Ruy**
Deep strategy with d3, c3, and kingside attack.

## Key Ideas for White
- Pressure on e5
- Control d4
- Kingside attack with h3, g4, Ng5

> **Pro Tip**: Play **a4** to stop ...b5 and fix the queenside.

---

Master the Ruy Lopez. Dominate the center.
      `,
      author: "IM Aryan Singh",
      authorImage: "/demo/author-3.jpg",
      date: "2025-11-01",
      readTime: "10 min",
      category: "openings",
      tags: ["Ruy Lopez", "Openings", "Strategy"],
      image: "/blog-3.webp",
      views: 3900,
      likes: 280,
    },
    {
      id: 4,
      title: "How to Study Chess Like a Pro (Without Burning Out)",
      excerpt:
        "A step-by-step training plan used by grandmasters. Train smarter, not harder.",
      content: `
# Pro-Level Chess Study Plan

## Daily Routine (2 Hours)

| Time | Activity |
|------|---------|
| 30 min | Tactics (Chess.com / Lichess) |
| 45 min | Game Analysis (your own games) |
| 30 min | Opening Prep (1 line only) |
| 15 min | Endgame Drill |

## Weekly Goals
- Solve **100 tactics**
- Analyze **3 games** deeply
- Watch **1 master class**

## Tools
- **Chess.com** – Puzzles
- **Lichess Study** – Opening prep
- **Stockfish** – Game analysis

> **Golden Rule**: Quality > Quantity

---

Consistency beats talent. Start today.
      `,
      author: "Coach Rohan Mehta",
      authorImage: "/demo/author-4.jpg",
      date: "2025-10-28",
      readTime: "8 min",
      category: "training",
      tags: ["Study", "Improvement", "Routine"],
      image: "/blog-4.png",
      views: 5500,
      likes: 420,
    },
    {
      id: 5,
      title: "The 7 Biggest Mistakes Beginners Make (And How to Fix Them)",
      excerpt:
        "Stop hanging pieces, blundering, and losing in 10 moves. Fix these now.",
      content: `
# 7 Deadly Beginner Mistakes

## 1. **Moving the Same Piece Twice**
Develop all pieces first.

## 2. **Ignoring Development**
Get king safe, connect rooks.

## 3. **Hanging Pieces**
Always ask: *"What is my opponent threatening?"*

## 4. **Not Controlling the Center**
Occupy d4, d5, e4, e5.

## 5. **Castling Too Late**
Castle by move 10.

## 6. **Pawn Grabbing**
Don't take the b2/g2 pawn early.

## 7. **No Plan**
After opening, ask: *"What is my plan?"*

---

Fix these 7. Jump 300 ELO in 30 days.
      `,
      author: "FM Kavya Reddy",
      authorImage: "/demo/author-5.jpg",
      date: "2025-10-20",
      readTime: "6 min",
      category: "beginner",
      tags: ["Mistakes", "Beginner", "Tips"],
      image: "/blog-5.jpg",
      views: 7100,
      likes: 580,
    },
  ];

  const categories = [
    { id: "all", name: "All Articles", count: blogPosts.length },
    { id: "checkmate", name: "Checkmate", count: blogPosts.filter(p => p.category === "checkmate").length },
    { id: "benefits", name: "Benefits", count: blogPosts.filter(p => p.category === "benefits").length },
    { id: "openings", name: "Openings", count: blogPosts.filter(p => p.category === "openings").length },
    { id: "training", name: "Training", count: blogPosts.filter(p => p.category === "training").length },
    { id: "beginner", name: "Beginner", count: blogPosts.filter(p => p.category === "beginner").length },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Hero Section - Responsive */}
      <section
        className="relative py-30 sm:py-28 md:py-36 lg:py-40 text-white overflow-hidden"
        style={{
          backgroundImage: 'url("/blogbg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="max-w-7xl mx-auto text-center relative z-10 px-4 sm:px-6 lg:px-8">
          <Badge
            className="mb-3 text-xs sm:mb-4 sm:text-sm md:mb-6 md:text-lg"
            style={{ backgroundColor: accentColor, color: primaryColor }}
          >
            Chess Blog
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-3 sm:mb-4 md:mb-6 leading-tight">
            Learn. Improve. Win.
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 md:mb-10 opacity-90">
            Master strategies, science, and secrets from India’s top chess minds.
          </p>
        </div>
      </section>

      {/* Search & Filter - Responsive */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#5C1F1C]/70" />
              <Input
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:pl-10 h-11 sm:h-12 bg-white/90 border-[#5C1F1C]/20 text-[#5C1F1C] placeholder-[#5C1F1C]/50 focus:border-[#5C1F1C]/40 backdrop-blur-md text-sm sm:text-base"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 lg:w-64 h-11 sm:h-12 bg-white/90 border-[#5C1F1C]/20 text-[#5C1F1C] backdrop-blur-md text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="text-sm">
                    {cat.name} ({cat.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Blog Grid - Responsive 3D Cards */}
      <section className="py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="h-full"
              >
                <ThreeDCard className="h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">
                  <div
                    className="bg-gradient-to-br from-[#5C1F1C] to-[#8B4513] p-1 sm:p-1.5 rounded-2xl sm:rounded-3xl h-full"
                  >
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl h-full overflow-hidden flex flex-col">
                      {/* Image */}
                      <div className="relative h-48 sm:h-56 lg:h-64">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                          <Badge className="bg-gradient-to-r from-[#FFC727] to-[#FFD700] text-[#5C1F1C] font-bold text-xs sm:text-sm">
                            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-6 flex-1 flex flex-col">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold mb-2 sm:mb-3 text-[#5C1F1C] line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm line-clamp-2 sm:line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 mb-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" /> {post.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4" /> {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" /> {post.readTime}
                          </span>
                        </div>



                        {/* CTA Button */}
                        <Button
                          onClick={() => setSelectedPost(post)}
                          className="w-full mt-auto bg-gradient-to-r from-[#FFC727] to-[#FFD700] text-[#5C1F1C] font-bold text-sm sm:text-base py-5 sm:py-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:shadow-yellow-500/40 transform hover:scale-105 transition-all duration-300"
                        >
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </ThreeDCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal - Responsive & Scrollable */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-[#5C1F1C]/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky Header */}
              <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-[#5C1F1C]/10 p-3 sm:p-4 flex justify-between items-start sm:items-center z-10">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold pr-8" style={{ color: primaryColor }}>
                  {selectedPost.title}
                </h2>
                <Button size="icon" variant="ghost" onClick={() => setSelectedPost(null)} className="shrink-0">
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg sm:rounded-xl mb-4 sm:mb-6 shadow-lg"
                />

                {/* Author & Stats */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6 text-xs sm:text-sm text-gray-700">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img
                      src={selectedPost.authorImage}
                      alt={selectedPost.author}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-[#5C1F1C]/20 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{selectedPost.author}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(selectedPost.date), "MMMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 sm:ml-auto text-gray-600 text-xs sm:text-sm">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {selectedPost.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {selectedPost.likes}
                    </span>
                  </div>
                </div>

                {/* Markdown Content */}
                <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-800 pb-6">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedPost.content}
                  </ReactMarkdown>
                </article>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-4 border-t border-gray-200">
                  {selectedPost.tags.map((tag: string) => (
                    <Badge key={tag} className="bg-[#5C1F1C]/10 text-[#5C1F1C] border border-[#5C1F1C]/20 text-xs sm:text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}