

// "use client";
// import { useSession } from "next-auth/react";
// import { useRouter, useParams, useSearchParams } from "next/navigation";
// import { useEffect, useState, useRef, useMemo } from "react";
// import { Chessboard } from "react-chessboard";
// import { Chess, PieceSymbol, Color } from "chess.js";
// import {
//   ArrowLeft,
//   CheckCircle,
//   XCircle,
//   Lightbulb,
//   RotateCcw,
//   Play,
//   Loader2,
//   SkipForward,
//   ArrowRight,
// } from "lucide-react";
// import { toast } from "sonner";

// interface PuzzleData {
//   stars?: string[];
// }

// interface Puzzle {
//   id: string;
//   fen: string;
//   solution: string;
//   stage: string;
//   title: string;
//   description?: string;
//   data?: PuzzleData | string;
// }

// export default function PuzzlePage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const params = useParams();
//   const searchParams = useSearchParams();

//   const puzzleId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
//   const context = searchParams.get("context") || null;
//   const folderId = searchParams.get("folderId") || null;

//   const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
//   const [nextPuzzleId, setNextPuzzleId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Game State
//   const [game, setGame] = useState(new Chess());
//   const [currentFen, setCurrentFen] = useState("start");
//   const [solutionMoves, setSolutionMoves] = useState<string[]>([]);
//   const [moveIndex, setMoveIndex] = useState(0);
//   const [orientation, setOrientation] = useState<"white" | "black">("white");

//   const [stars, setStars] = useState<string[]>([]);
//   const [hintSquares, setHintSquares] = useState<Record<string, React.CSSProperties>>({});
  
//   const [statusState, setStatusState] =
//     useState<"IDLE" | "CORRECT" | "WRONG" | "COMPLETED">("IDLE");

//   const [containerWidth, setContainerWidth] = useState(500);
//   const boardContainerRef = useRef<HTMLDivElement>(null);

//   // Resize Observer
//   useEffect(() => {
//     if (!boardContainerRef.current) return;
//     const resizeObserver = new ResizeObserver(() => {
//       setContainerWidth(boardContainerRef.current!.offsetWidth);
//     });
//     resizeObserver.observe(boardContainerRef.current);
//     return () => resizeObserver.disconnect();
//   }, []);

//   // --- HELPER: Safe Board Loading ---
//   const getSafeGame = (fen: string) => {
//     const g = new Chess();
//     g.clear();
//     try {
//       g.load(fen);
//     } catch (e) {
//       // Manual setup for "illegal" boards (e.g. puzzles without kings)
//       const [placement] = fen.split(' ');
//       const rows = placement.split('/');
//       rows.forEach((row, rIdx) => {
//         let cIdx = 0;
//         for (const char of row) {
//           if (/\d/.test(char)) {
//             cIdx += parseInt(char);
//           } else {
//             const square = String.fromCharCode(97 + cIdx) + (8 - rIdx);
//             const color = char === char.toUpperCase() ? 'w' : 'b';
//             const type = char.toLowerCase();
//             g.put({ type: type as PieceSymbol, color: color as Color }, square as any);
//             cIdx++;
//           }
//         }
//       });
//     }
//     return g;
//   };

//   // Load Puzzle
//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/api/auth/signin");
//       return;
//     }
//     if (status !== "authenticated" || !puzzleId) return;

//     setError(null);
//     setHintSquares({}); 

//     const loadPuzzle = async () => {
//       try {
//         const res = await fetch(`/api/puzzles/${puzzleId}`);
//         if (!res.ok) throw new Error("Puzzle not found.");

//         const data: Puzzle = await res.json();
        
//         // Parse Stars
//         let parsedData: PuzzleData = {};
//         if (typeof data.data === "string") {
//             try { parsedData = JSON.parse(data.data); } catch (e) {}
//         } else if (typeof data.data === "object" && data.data !== null) {
//             parsedData = data.data as PuzzleData;
//         }
//         setStars(parsedData.stars && Array.isArray(parsedData.stars) ? parsedData.stars : []);

//         // Load Game State
//         const newGame = getSafeGame(data.fen);
//         setGame(newGame);
//         setCurrentFen(data.fen); 
        
//         // Determine Orientation based on Side to Move
//         if (data.fen.includes(" w ")) setOrientation("white");
//         else if (data.fen.includes(" b ")) setOrientation("black");
        
//         setPuzzle(data);
//         setSolutionMoves(data.solution.trim().split(" "));
//         setMoveIndex(0);
//         setStatusState("IDLE");

//         // Fetch Next Puzzle ID
//         let url = "";
//         if (context === "todo") url = `/api/assignments/next?currentId=${puzzleId}`;
//         else if (folderId) url = `/api/content/next?folderId=${folderId}&currentId=${puzzleId}`;

//         if (url) {
//             try {
//                 const nextRes = await fetch(url);
//                 if (nextRes.ok) {
//                     const nextData = await nextRes.json();
//                     setNextPuzzleId(nextData?.id || nextData?.nextId || (Array.isArray(nextData) && nextData[0]?.id) || null);
//                 }
//             } catch (e) {}
//         }

//       } catch (err: any) {
//         console.error(err);
//         setError(err.message || "Failed to load puzzle");
//       }
//     };

//     loadPuzzle();
//   }, [status, puzzleId, folderId, context, router]);

//   const handleNext = () => {
//     if (nextPuzzleId) {
//       const query = new URLSearchParams();
//       if (context) query.set("context", context);
//       if (folderId) query.set("folderId", folderId);
//       router.push(`/puzzle/${nextPuzzleId}?${query.toString()}`);
//     } else {
//       router.push("/learn");
//     }
//   };

//   const handleSkip = () => handleNext();

//   const handleHint = () => {
//     if (statusState === "COMPLETED" || moveIndex >= solutionMoves.length) return;
//     const correctMoveStr = solutionMoves[moveIndex];
//     let fromSquare = "";

//     if (correctMoveStr.includes("-")) {
//         fromSquare = correctMoveStr.split("-")[0];
//     } else {
//         try {
//             const temp = getSafeGame(currentFen);
//             const move = temp.move(correctMoveStr); // Chess.js can parse SAN "Nf3"
//             if (move) fromSquare = move.from;
//         } catch(e) {}
//     }

//     if (fromSquare) {
//       setHintSquares({ [fromSquare]: { backgroundColor: "rgba(255, 255, 0, 0.5)" } });
//       toast.info("Piece to move highlighted!");
//     } else {
//       toast.warning("Cannot determine hint.");
//     }
//   };

//   const isGeometryValid = (piece: string, from: string, to: string) => {
//     const type = piece[1].toLowerCase(); 
//     const x1 = from.charCodeAt(0), y1 = parseInt(from[1]);
//     const x2 = to.charCodeAt(0), y2 = parseInt(to[1]);
//     const dx = Math.abs(x1 - x2);
//     const dy = Math.abs(y1 - y2);

//     if (type === 'n') return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
//     if (type === 'r') return dx === 0 || dy === 0;
//     if (type === 'b') return dx === dy;
//     if (type === 'q') return dx === 0 || dy === 0 || dx === dy;
//     if (type === 'k') return dx <= 1 && dy <= 1;
//     if (type === 'p') return (piece[0] === 'w' ? (y2 > y1) : (y2 < y1)) && dx <= 1 && dy <= 2; 
    
//     return false;
//   };

//   // --- MAIN MOVE VALIDATION LOGIC ---
//   const onDrop = (from: string, to: string, piece: string) => {
//     if (statusState === "COMPLETED" || statusState === "WRONG") return false;

//     const gameCopy = getSafeGame(currentFen);
//     let validMove = false;
//     let newFen = "";
//     let moveObject: any = null; // Store move details (specifically for SAN)

//     // 1. Try Standard Chess Move
//     try {
//         const move = gameCopy.move({ from, to, promotion: "q" });
//         if (move) {
//             validMove = true;
//             newFen = gameCopy.fen();
//             moveObject = move; // Important: Capture the chess.js move object
//         }
//     } catch (e) {}

//     // 2. Try Custom Move (if standard illegal but geometry ok, for star puzzles)
//     if (!validMove) {
//         if (isGeometryValid(piece, from, to)) {
//             validMove = true;
//             gameCopy.remove(from as any);
//             gameCopy.put({ type: piece[1].toLowerCase() as PieceSymbol, color: piece[0] as Color }, to as any);
//             newFen = gameCopy.fen();
//         }
//     }

//     if (!validMove) return false;

//     // 3. Check Solution against Expected
//     const expected = solutionMoves[moveIndex];
    
//     // Logic: 
//     // - Check 1: Does the SAN match? (e.g. expected="Nf3", moveObject.san="Nf3")
//     // - Check 2: Does coordinate match? (e.g. expected="g1-f3", current="g1-f3")
//     const isCorrect = 
//         (moveObject && moveObject.san === expected) || 
//         expected === `${from}-${to}` || 
//         expected === `${from}${to}`;

//     if (isCorrect) {
//         setGame(gameCopy);
//         setCurrentFen(newFen);

//         // Remove Star if landed on
//         if (stars.includes(to)) {
//             setStars((prev) => prev.filter((s) => s !== to));
//         }

//         setHintSquares({}); 
//         handleCorrectStep(newFen);
//         return true;
//     } else {
//         handleIncorrect(`${from}-${to}`);
//         return false;
//     }
//   };

//   const handleCorrectStep = (fenAfterMove: string) => {
//     const nextIndex = moveIndex + 1;

//     if (nextIndex >= solutionMoves.length) {
//         setStatusState("COMPLETED");
//         saveProgress(true, null);
//         toast.success("Puzzle Completed! 🎉");
//         return;
//     }

//     setMoveIndex(nextIndex);
//     setStatusState("CORRECT");

//     const reply = solutionMoves[nextIndex];
    
//     // Auto-play opponent move ONLY IF no stars remaining (assuming star puzzles are manual)
//     if (stars.length === 0 && reply && !reply.includes("-")) {
//          setTimeout(() => {
//             const g = getSafeGame(fenAfterMove);
//             try { 
//                 g.move(reply); 
//                 const replyFen = g.fen();
//                 setGame(g);
//                 setCurrentFen(replyFen);
//                 setMoveIndex(nextIndex + 1);
//             } catch (e) {
//                 // If standard move fails, maybe check custom? (Rare for opponent reply)
//             }
//             setStatusState("IDLE");
//          }, 500);
//     } else {
//         setStatusState("IDLE");
//     }
//   };

//   const handleIncorrect = (wrongSan: string) => {
//     setStatusState("WRONG");
//     toast.error("Wrong Move!");
//     saveProgress(false, wrongSan);
//     setTimeout(() => setStatusState("IDLE"), 500);
//   };

//   const saveProgress = (isCorrect: boolean, wrongMove: string | null) => {
//     const studentId = (session?.user as any)?.id;
//     if (!studentId) return;
//     fetch("/api/progress", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ studentId, puzzleId, isCorrect, wrongMove }),
//     });
//   };

//   const resetPuzzle = () => {
//     if (!puzzle) return;
//     const newGame = getSafeGame(puzzle.fen);
    
//     setGame(newGame);
//     setCurrentFen(puzzle.fen);
//     setMoveIndex(0);
//     setStatusState("IDLE");
//     setHintSquares({});
    
//     let parsedData: PuzzleData = {};
//     try { parsedData = typeof puzzle.data === 'string' ? JSON.parse(puzzle.data) : puzzle.data || {}; } catch {}
//     setStars(parsedData.stars || []);
//   };

//   const customSquareStyles = useMemo(() => {
//     const styles: Record<string, React.CSSProperties> = {};
//     // Add Stars
//     stars.forEach((square) => {
//       styles[square] = {
//         backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZDcwMCIgc3Ryb2tlPSJnb2xkIiBzdHJva2Utd2lkdGg9IjMiPjxwb2x5Z29uIHBvaW50cz0iMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMiIvPjwvc3ZnPg==")',
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         backgroundSize: "60%",
//       };
//     });
//     // Add Hints
//     Object.entries(hintSquares).forEach(([square, style]) => {
//       styles[square] = { ...styles[square], ...style };
//     });
//     return styles;
//   }, [stars, hintSquares]);

//   if (!puzzle) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

//   return (
//     <div className="min-h-screen bg-slate-50 py-10 px-4 flex flex-col items-center">
//       <div className="w-full max-w-6xl space-y-8">
//         <div className="flex items-center justify-between">
//           <button onClick={() => router.back()} className="flex items-center gap-2 font-bold"><ArrowLeft /> Back</button>
//           <div className="text-center">
//             <h1 className="text-3xl font-extrabold">{puzzle.title}</h1>
//             <span className="inline-block mt-1 px-3 py-0.5 text-xs font-bold rounded-full bg-orange-100 text-orange-700 uppercase">
//                 {puzzle.stage}
//             </span>
//           </div>
//           <button onClick={handleSkip} className="flex items-center gap-2 font-bold text-gray-500">Skip <SkipForward/></button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div className="flex justify-center">
//             <div ref={boardContainerRef} className="w-full max-w-[550px] aspect-square rounded-xl shadow-2xl bg-white border-4 border-white">
//               <Chessboard
//                 position={currentFen}
//                 onPieceDrop={onDrop}
//                 boardOrientation={orientation}
//                 boardWidth={containerWidth}
//                 customDarkSquareStyle={{ backgroundColor: "#779556" }}
//                 customLightSquareStyle={{ backgroundColor: "#ebecd0" }}
//                 customSquareStyles={customSquareStyles}
//                 animationDuration={200}
//               />
//             </div>
//           </div>

//           <div className="flex flex-col justify-center space-y-6 pt-4">
//             <div className={`p-6 rounded-2xl border-2 transition-all ${statusState === "COMPLETED" ? "bg-green-50 border-green-200" : statusState === "WRONG" ? "bg-red-50 border-red-200" : "bg-white border-slate-200"}`}>
//                 <div className="flex items-center gap-4">
//                     {statusState === "COMPLETED" ? <CheckCircle className="h-10 w-10 text-green-600" /> : statusState === "WRONG" ? <XCircle className="h-10 w-10 text-red-600" /> : <Play className="h-10 w-10 text-blue-500" />}
//                     <div>
//                         <h2 className="text-xl font-bold">{statusState === "COMPLETED" ? "Solved!" : statusState === "WRONG" ? "Try Again" : `${orientation === 'white' ? 'White' : 'Black'} to Move`}</h2>
//                         <p className="text-sm text-gray-500">{stars.length > 0 ? `${stars.length} stars remaining` : "Find the best move"}</p>
//                     </div>
//                 </div>
//             </div>
//             {statusState !== "COMPLETED" ? (
//                 <div className="grid grid-cols-2 gap-4">
//                     <button onClick={resetPuzzle} className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-white border hover:bg-gray-50"><RotateCcw/> Reset</button>
//                     <button onClick={handleHint} className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-blue-50 border hover:bg-blue-100"><Lightbulb/> Hint</button>
//                 </div>
//             ) : (
//                 <button onClick={handleNext} className="w-full py-4 rounded-xl font-bold text-lg bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center gap-2">Next <ArrowRight/></button>
//             )}
//             {puzzle.description && <div className="mt-4 p-4 bg-slate-100 rounded-xl text-sm">{puzzle.description}</div>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useSession } from "next-auth/react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, PieceSymbol, Color } from "chess.js";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Lightbulb,
  RotateCcw,
  Play,
  Loader2,
  SkipForward,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface PuzzleData {
  stars?: string[];
}

interface Puzzle {
  id: string;
  fen: string;
  solution: string;
  stage: string;
  title: string;
  description?: string;
  data?: PuzzleData | string;
}

export default function PuzzlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const puzzleId = Array.isArray(params?.id)
    ? params.id[0]
    : (params?.id as string | undefined);
  const context = searchParams.get("context") || null;
  const folderId = searchParams.get("folderId") || null;

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [nextPuzzleId, setNextPuzzleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Game State
  const [game, setGame] = useState(new Chess());
  const [currentFen, setCurrentFen] = useState("start");
  const [solutionMoves, setSolutionMoves] = useState<string[]>([]);
  const [moveIndex, setMoveIndex] = useState(0);
  const [orientation, setOrientation] = useState<"white" | "black">("white");

  const [stars, setStars] = useState<string[]>([]);
  const [hintSquares, setHintSquares] = useState<
    Record<string, React.CSSProperties>
  >({});

  const [statusState, setStatusState] = useState<
    "IDLE" | "CORRECT" | "WRONG" | "COMPLETED"
  >("IDLE");

  // Layout State
  const [containerWidth, setContainerWidth] = useState(300); // Default safe width
  const boardContainerRef = useRef<HTMLDivElement>(null);

  // Resize Observer - Responsive Board Sizing
  useEffect(() => {
    if (!boardContainerRef.current) return;
    
    const updateWidth = () => {
      if(boardContainerRef.current) {
        setContainerWidth(boardContainerRef.current.offsetWidth);
      }
    };

    // Initial calcs
    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
    
    resizeObserver.observe(boardContainerRef.current);
    
    // Add window listener as fallback for rapid orientation changes on mobile
    window.addEventListener('resize', updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // --- HELPER: Safe Board Loading ---
  const getSafeGame = (fen: string) => {
    const g = new Chess();
    g.clear();
    try {
      g.load(fen);
    } catch (e) {
      const [placement] = fen.split(" ");
      const rows = placement.split("/");
      rows.forEach((row, rIdx) => {
        let cIdx = 0;
        for (const char of row) {
          if (/\d/.test(char)) {
            cIdx += parseInt(char);
          } else {
            const square = String.fromCharCode(97 + cIdx) + (8 - rIdx);
            const color = char === char.toUpperCase() ? "w" : "b";
            const type = char.toLowerCase();
            g.put(
              { type: type as PieceSymbol, color: color as Color },
              square as any
            );
            cIdx++;
          }
        }
      });
    }
    return g;
  };

  // Load Puzzle
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
      return;
    }
    if (status !== "authenticated" || !puzzleId) return;

    setError(null);
    setHintSquares({});

    const loadPuzzle = async () => {
      try {
        const res = await fetch(`/api/puzzles/${puzzleId}`);
        if (!res.ok) throw new Error("Puzzle not found.");

        const data: Puzzle = await res.json();

        // Parse Stars
        let parsedData: PuzzleData = {};
        if (typeof data.data === "string") {
          try {
            parsedData = JSON.parse(data.data);
          } catch (e) {}
        } else if (typeof data.data === "object" && data.data !== null) {
          parsedData = data.data as PuzzleData;
        }
        setStars(
          parsedData.stars && Array.isArray(parsedData.stars)
            ? parsedData.stars
            : []
        );

        // Load Game State
        const newGame = getSafeGame(data.fen);
        setGame(newGame);
        setCurrentFen(data.fen);

        // Determine Orientation based on Side to Move
        if (data.fen.includes(" w ")) setOrientation("white");
        else if (data.fen.includes(" b ")) setOrientation("black");

        setPuzzle(data);
        setSolutionMoves(data.solution.trim().split(" "));
        setMoveIndex(0);
        setStatusState("IDLE");

        // Fetch Next Puzzle ID
        let url = "";
        if (context === "todo")
          url = `/api/assignments/next?currentId=${puzzleId}`;
        else if (folderId)
          url = `/api/content/next?folderId=${folderId}&currentId=${puzzleId}`;

        if (url) {
          try {
            const nextRes = await fetch(url);
            if (nextRes.ok) {
              const nextData = await nextRes.json();
              setNextPuzzleId(
                nextData?.id ||
                  nextData?.nextId ||
                  (Array.isArray(nextData) && nextData[0]?.id) ||
                  null
              );
            }
          } catch (e) {}
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load puzzle");
      }
    };

    loadPuzzle();
  }, [status, puzzleId, folderId, context, router]);

  const handleNext = () => {
    if (nextPuzzleId) {
      const query = new URLSearchParams();
      if (context) query.set("context", context);
      if (folderId) query.set("folderId", folderId);
      router.push(`/puzzle/${nextPuzzleId}?${query.toString()}`);
    } else {
      router.push("/learn");
    }
  };

  const handleSkip = () => handleNext();

  const handleHint = () => {
    if (statusState === "COMPLETED" || moveIndex >= solutionMoves.length)
      return;
    const correctMoveStr = solutionMoves[moveIndex];
    let fromSquare = "";

    if (correctMoveStr.includes("-")) {
      fromSquare = correctMoveStr.split("-")[0];
    } else {
      try {
        const temp = getSafeGame(currentFen);
        const move = temp.move(correctMoveStr); 
        if (move) fromSquare = move.from;
      } catch (e) {}
    }

    if (fromSquare) {
      setHintSquares({
        [fromSquare]: { backgroundColor: "rgba(255, 255, 0, 0.5)" },
      });
      toast.info("Piece to move highlighted!");
    } else {
      toast.warning("Cannot determine hint.");
    }
  };

  const isGeometryValid = (piece: string, from: string, to: string) => {
    const type = piece[1].toLowerCase();
    const x1 = from.charCodeAt(0),
      y1 = parseInt(from[1]);
    const x2 = to.charCodeAt(0),
      y2 = parseInt(to[1]);
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);

    if (type === "n")
      return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
    if (type === "r") return dx === 0 || dy === 0;
    if (type === "b") return dx === dy;
    if (type === "q") return dx === 0 || dy === 0 || dx === dy;
    if (type === "k") return dx <= 1 && dy <= 1;
    if (type === "p")
      return (
        (piece[0] === "w" ? y2 > y1 : y2 < y1) && dx <= 1 && dy <= 2
      );

    return false;
  };

  // --- MAIN MOVE VALIDATION LOGIC ---
  const onDrop = (from: string, to: string, piece: string) => {
    if (statusState === "COMPLETED" || statusState === "WRONG") return false;

    const gameCopy = getSafeGame(currentFen);
    let validMove = false;
    let newFen = "";
    let moveObject: any = null; 

    // 1. Try Standard Chess Move
    try {
      const move = gameCopy.move({ from, to, promotion: "q" });
      if (move) {
        validMove = true;
        newFen = gameCopy.fen();
        moveObject = move;
      }
    } catch (e) {}

    // 2. Try Custom Move (if standard illegal but geometry ok, for star puzzles)
    if (!validMove) {
      if (isGeometryValid(piece, from, to)) {
        validMove = true;
        gameCopy.remove(from as any);
        gameCopy.put(
          {
            type: piece[1].toLowerCase() as PieceSymbol,
            color: piece[0] as Color,
          },
          to as any
        );
        newFen = gameCopy.fen();
      }
    }

    if (!validMove) return false;

    // 3. Check Solution against Expected
    const expected = solutionMoves[moveIndex];

    const isCorrect =
      (moveObject && moveObject.san === expected) ||
      expected === `${from}-${to}` ||
      expected === `${from}${to}`;

    if (isCorrect) {
      setGame(gameCopy);
      setCurrentFen(newFen);

      // Remove Star if landed on
      if (stars.includes(to)) {
        setStars((prev) => prev.filter((s) => s !== to));
      }

      setHintSquares({});
      handleCorrectStep(newFen);
      return true;
    } else {
      handleIncorrect(`${from}-${to}`);
      return false;
    }
  };

  const handleCorrectStep = (fenAfterMove: string) => {
    const nextIndex = moveIndex + 1;

    if (nextIndex >= solutionMoves.length) {
      setStatusState("COMPLETED");
      saveProgress(true, null);
      toast.success("Puzzle Completed! 🎉");
      return;
    }

    setMoveIndex(nextIndex);
    setStatusState("CORRECT");

    const reply = solutionMoves[nextIndex];

    // Auto-play opponent move ONLY IF no stars remaining
    if (stars.length === 0 && reply && !reply.includes("-")) {
      setTimeout(() => {
        const g = getSafeGame(fenAfterMove);
        try {
          g.move(reply);
          const replyFen = g.fen();
          setGame(g);
          setCurrentFen(replyFen);
          setMoveIndex(nextIndex + 1);
        } catch (e) {
          // If standard move fails, custom logic could go here
        }
        setStatusState("IDLE");
      }, 500);
    } else {
      setStatusState("IDLE");
    }
  };

  const handleIncorrect = (wrongSan: string) => {
    setStatusState("WRONG");
    toast.error("Wrong Move!");
    saveProgress(false, wrongSan);
    setTimeout(() => setStatusState("IDLE"), 500);
  };

  const saveProgress = (isCorrect: boolean, wrongMove: string | null) => {
    const studentId = (session?.user as any)?.id;
    if (!studentId) return;
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, puzzleId, isCorrect, wrongMove }),
    });
  };

  const resetPuzzle = () => {
    if (!puzzle) return;
    const newGame = getSafeGame(puzzle.fen);

    setGame(newGame);
    setCurrentFen(puzzle.fen);
    setMoveIndex(0);
    setStatusState("IDLE");
    setHintSquares({});

    let parsedData: PuzzleData = {};
    try {
      parsedData =
        typeof puzzle.data === "string"
          ? JSON.parse(puzzle.data)
          : puzzle.data || {};
    } catch {}
    setStars(parsedData.stars || []);
  };

  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    // Add Stars
    stars.forEach((square) => {
      styles[square] = {
        backgroundImage:
          'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZDcwMCIgc3Ryb2tlPSJnb2xkIiBzdHJva2Utd2lkdGg9IjMiPjxwb2x5Z29uIHBvaW50cz0iMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMiIvPjwvc3ZnPg==")',
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "60%",
      };
    });
    // Add Hints
    Object.entries(hintSquares).forEach(([square, style]) => {
      styles[square] = { ...styles[square], ...style };
    });
    return styles;
  }, [stars, hintSquares]);

  if (!puzzle)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-slate-500 font-medium">Loading your puzzle...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-3 sm:px-6 flex flex-col items-center">
      {/* Container Max Width */}
      <div className="w-full max-w-7xl space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline font-bold">Back</span>
          </button>

          <div className="text-center flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold truncate text-slate-800">
              {puzzle.title}
            </h1>
            <span className="inline-block mt-1 px-3 py-0.5 text-[10px] sm:text-xs font-bold rounded-full bg-orange-100 text-orange-700 uppercase tracking-wide">
              {puzzle.stage}
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors p-2 hover:bg-orange-50 rounded-lg"
          >
            <span className="hidden sm:inline font-bold">Skip</span>
            <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Game Layout Grid: Stacks on mobile, Side-by-side on LG screens */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 lg:items-start">
          
          {/* Left Column: Chess Board */}
          <div className="flex justify-center w-full lg:col-span-7 xl:col-span-8">
            <div
              ref={boardContainerRef}
              className="w-full max-w-[95vw] sm:max-w-[550px] lg:max-w-[650px] aspect-square rounded-xl shadow-xl bg-white border-[6px] border-white ring-1 ring-slate-200 overflow-hidden"
            >
              <Chessboard
                position={currentFen}
                onPieceDrop={onDrop}
                boardOrientation={orientation}
                boardWidth={containerWidth}
                customDarkSquareStyle={{ backgroundColor: "#779556" }}
                customLightSquareStyle={{ backgroundColor: "#ebecd0" }}
                customSquareStyles={customSquareStyles}
                animationDuration={200}
                arePiecesDraggable={statusState !== "COMPLETED"}
              />
            </div>
          </div>

          {/* Right Column: Controls & Info */}
          <div className="flex flex-col w-full lg:col-span-5 xl:col-span-4 space-y-4 lg:space-y-6 lg:sticky lg:top-6">
            
            {/* Status Card */}
            <div
              className={`p-5 sm:p-6 rounded-2xl border-2 transition-all shadow-sm ${
                statusState === "COMPLETED"
                  ? "bg-green-50 border-green-200"
                  : statusState === "WRONG"
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {statusState === "COMPLETED" ? (
                    <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
                  ) : statusState === "WRONG" ? (
                    <XCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-600" />
                  ) : (
                    <Play className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 fill-blue-500/20" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                    {statusState === "COMPLETED"
                      ? "Solved!"
                      : statusState === "WRONG"
                      ? "Try Again"
                      : `${orientation === "white" ? "White" : "Black"} to Move`}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-500 font-medium">
                    {statusState === "COMPLETED"
                      ? "Great job!"
                      : statusState === "WRONG"
                      ? "That wasn't quite right."
                      : stars.length > 0
                      ? `${stars.length} stars remaining`
                      : "Find the best move"}
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            {statusState !== "COMPLETED" ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={resetPuzzle}
                  className="flex items-center justify-center gap-2 py-3 sm:py-4 rounded-xl font-bold bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" /> Reset
                </button>
                <button
                  onClick={handleHint}
                  className="flex items-center justify-center gap-2 py-3 sm:py-4 rounded-xl font-bold bg-blue-50 border-2 border-blue-100 text-blue-700 hover:bg-blue-100 hover:border-blue-200 transition-all active:scale-95"
                >
                  <Lightbulb className="w-5 h-5" /> Hint
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl font-bold text-lg bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 hover:shadow-orange-600/40 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Next Puzzle <ArrowRight className="w-6 h-6" />
              </button>
            )}

            {/* Description */}
            {puzzle.description && (
              <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Instructions</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {puzzle.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}