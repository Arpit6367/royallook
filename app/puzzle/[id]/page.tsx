// "use client";
// import { useSession } from "next-auth/react";
// import { useRouter, useParams, useSearchParams } from "next/navigation";
// import { useEffect, useState, useRef, useMemo } from "react";
// import { Chessboard } from "react-chessboard";
// import { Chess } from "chess.js";
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
//   AlertTriangle,
// } from "lucide-react";
// import { toast } from "sonner";

// interface Puzzle {
//   id: string;
//   fen: string;
//   solution: string;
//   stage: string;
//   title: string;
//   description?: string;
//   data?: any; // Changed to any to handle potential parsing needs
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

//   const [game, setGame] = useState(new Chess());
//   const [solutionMoves, setSolutionMoves] = useState<string[]>([]);
//   const [moveIndex, setMoveIndex] = useState(0);
//   const [orientation, setOrientation] = useState<"white" | "black">("white");

//   const [stars, setStars] = useState<string[]>([]);
//   const [hintSquares, setHintSquares] = useState<Record<string, React.CSSProperties>>({});
  
//   const [statusState, setStatusState] =
//     useState<"IDLE" | "CORRECT" | "WRONG" | "COMPLETED">("IDLE");

//   const [containerWidth, setContainerWidth] = useState(500);
//   const boardContainerRef = useRef<HTMLDivElement>(null);

//   // Responsive Board Observer
//   useEffect(() => {
//     if (!boardContainerRef.current) return;
//     const resizeObserver = new ResizeObserver(() => {
//       setContainerWidth(boardContainerRef.current!.offsetWidth);
//     });
//     resizeObserver.observe(boardContainerRef.current);
//     return () => resizeObserver.disconnect();
//   }, []);

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
//         if (!data.fen || !data.solution) throw new Error("Puzzle data incomplete.");

//         // 1. Initialize Game
//         const newGame = new Chess();
//         newGame.clear(); 
//         try {
//           // skipValidation is crucial for Kingless star puzzles
//           newGame.load(data.fen, { skipValidation: true });
//         } catch (e) {
//           console.error("FEN Load Error:", e);
//           // Fallback: If load fails, try setting up board manually if needed, 
//           // but usually skipValidation handles it.
//         }

//         setGame(newGame);
//         setOrientation(newGame.turn() === "b" ? "black" : "white");

//         // 2. Robust Star Data Parsing
//         let parsedData = data.data;
//         // Sometimes DB returns JSON string instead of object
//         if (typeof parsedData === "string") {
//             try {
//                 parsedData = JSON.parse(parsedData);
//             } catch (e) {
//                 parsedData = {};
//             }
//         }

//         if (parsedData?.stars && Array.isArray(parsedData.stars)) {
//           setStars(parsedData.stars);
//         } else {
//           setStars([]);
//         }

//         setPuzzle(data);
//         setSolutionMoves(data.solution.trim().split(" "));
//         setMoveIndex(0);
//         setStatusState("IDLE");

//         // 3. Load Next Puzzle Logic
//         let url = "";
//         if (context === "todo") {
//           url = `/api/assignments/next?currentId=${puzzleId}`;
//         } else if (folderId) {
//           url = `/api/content/next?folderId=${folderId}&currentId=${puzzleId}`;
//         }

//         if (url) {
//           try {
//             const nextRes = await fetch(url);
//             if (nextRes.ok) {
//               const nextData = await nextRes.json();
//               const candidateId =
//                 nextData?.id ??
//                 nextData?.nextId ??
//                 nextData?.nextPuzzleId ??
//                 (Array.isArray(nextData) && nextData[0]?.id) ??
//                 null;
//               setNextPuzzleId(candidateId || null);
//             }
//           } catch (e) {
//             setNextPuzzleId(null);
//           }
//         } else {
//           setNextPuzzleId(null);
//         }
//       } catch (err: any) {
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
//       const qs = query.toString();
//       router.push(qs ? `/puzzle/${nextPuzzleId}?${qs}` : `/puzzle/${nextPuzzleId}`);
//     } else {
//       router.push("/learn");
//     }
//   };

//   const handleSkip = () => handleNext();

//   // --- HINT LOGIC (UPDATED) ---
//   const handleHint = () => {
//     if (statusState === "COMPLETED" || moveIndex >= solutionMoves.length) return;

//     const correctMoveStr = solutionMoves[moveIndex]; // e.g., "e4" or "e2-e4"
//     let fromSquare = "";

//     // Strategy 1: Try Standard Chess Logic
//     // (Works for standard puzzles where the board is legal)
//     try {
//         const tempGame = new Chess(game.fen());
//         const moves = tempGame.moves({ verbose: true });
//         const moveObj = moves.find((m) => m.san === correctMoveStr);
//         if (moveObj) {
//             fromSquare = moveObj.from;
//         }
//     } catch (e) {
//         // Ignore errors if board is illegal
//     }

//     // Strategy 2: Fallback for Star/Custom Puzzles
//     // If board is illegal (no king), moves() returns empty.
//     // We check if solution is in coordinate notation (e.g., "a1-b2")
//     if (!fromSquare && correctMoveStr.includes("-")) {
//         const parts = correctMoveStr.split("-");
//         fromSquare = parts[0]; // Extract "a1"
//     }

//     if (fromSquare) {
//       // Only highlight the Source square
//       setHintSquares({
//         [fromSquare]: { backgroundColor: "rgba(255, 255, 0, 0.6)" }, // Yellow
//       });
//       toast.info("Piece to move highlighted!");
//     } else {
//       // Strategy 3: Hard Fallback - Just highlight the piece at the start of the SAN if possible,
//       // or warn user if solution format is completely unknown in an illegal board state.
//       toast.warning("Could not determine hint for this specific position.");
//     }
//   };

//   const onDrop = (from: string, to: string) => {
//     if (statusState === "COMPLETED" || statusState === "WRONG") return false;

//     const gameCopy = new Chess(game.fen());
//     let move = null;

//     // 1. Try Standard Move
//     try {
//       move = gameCopy.move({ from, to, promotion: "q" });
//     } catch (e) {
//       // Illegal normal move
//     }

//     // 2. Try Custom Star Move (if standard move failed)
//     // Allows moving any piece to a star square if it's a star puzzle
//     if (!move && stars.includes(to)) {
//       const piece = gameCopy.get(from);
//       if (piece) {
//         gameCopy.remove(from);
//         gameCopy.put(piece, to);
//         move = { from, to, san: `${from}-${to}` };
//       }
//     }

//     if (!move) return false;

//     const expected = solutionMoves[moveIndex];
    
//     // Check correctness: Match SAN OR Coordinate notation (e.g. "e2-e4")
//     const isCorrect =
//       move.san === expected ||
//       (expected.includes("-") && `${from}-${to}` === expected);

//     if (isCorrect) {
//       setGame(gameCopy);
      
//       // Collect Star
//       if (stars.includes(to)) {
//         setStars((prev) => prev.filter((s) => s !== to));
//       }

//       setHintSquares({}); // Clear hints
//       handleCorrectStep();
//       return true;
//     } else {
//       handleIncorrect(move.san);
//       return false;
//     }
//   };

//   const handleCorrectStep = () => {
//     const nextIndex = moveIndex + 1;

//     // Check completion
//     if (nextIndex >= solutionMoves.length) {
//       // Ensure all stars are collected if it's a star puzzle
//       // (Using puzzle.data directly here, assuming it's synced or checking state)
//       const hasStars = stars.length > 0; // If stars state still has items, not done
      
//       // Note: We check if the *original* puzzle had stars to enforce collection
//       // But simply checking if stars state is not empty is enough logic here
//       if (hasStars) {
//         // In rare cases where solution ends but stars remain (bad puzzle design?), 
//         // we might block or just let it finish. 
//         // Ideally, solution moves should cover all stars.
//       }

//       setStatusState("COMPLETED");
//       saveProgress(true, null);
//       toast.success("Puzzle Completed! 🎉");
//       return;
//     }

//     setMoveIndex(nextIndex);
//     setStatusState("CORRECT");

//     const reply = solutionMoves[nextIndex];
//     if (reply && !reply.includes("-")) {
//       setTimeout(() => {
//         setGame((prev) => {
//           const g = new Chess(prev.fen());
//           try {
//             g.move(reply);
//           } catch (e) {}
//           return g;
//         });
//         setMoveIndex(nextIndex + 1);
//         setStatusState("IDLE");
//       }, 400);
//     } else {
//       setStatusState("IDLE");
//     }
//   };

//   const handleIncorrect = (wrongSan: string) => {
//     setStatusState("WRONG");
//     toast.error("Wrong Move!");
//     saveProgress(false, wrongSan);
//     setTimeout(() => setStatusState("IDLE"), 700);
//   };

//   const saveProgress = (isCorrect: boolean, wrongMove: string | null) => {
//     const studentId = (session?.user as any)?.id;
//     if (!studentId) return;

//     fetch("/api/progress", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         studentId,
//         puzzleId,
//         isCorrect,
//         wrongMove,
//       }),
//     });
//   };

//   const resetPuzzle = () => {
//     if (!puzzle) return;
//     const newGame = new Chess();
//     newGame.clear();
//     try {
//         newGame.load(puzzle.fen, { skipValidation: true });
//     } catch(e) {}
    
//     setGame(newGame);
//     setOrientation(newGame.turn() === "b" ? "black" : "white");
//     setMoveIndex(0);
//     setStatusState("IDLE");
//     setHintSquares({}); 
    
//     // Reset stars from puzzle data
//     let parsedData = puzzle.data;
//     if (typeof parsedData === "string") {
//         try { parsedData = JSON.parse(parsedData); } catch(e) {}
//     }
//     setStars(parsedData?.stars || []);
//   };

//   // MERGE STYLES: Combine Stars (Image) + Hints (Background Color)
//   const customSquareStyles = useMemo(() => {
//     const styles: Record<string, React.CSSProperties> = {};

//     // 1. Apply Star Styles (Background Image)
//     stars.forEach((square) => {
//       styles[square] = {
//         backgroundImage:
//           'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZDcwMCIgc3Ryb2tlPSJnb2xkIiBzdHJva2Utd2lkdGg9IjMiPjxwb2x5Z29uIHBvaW50cz0iMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMiIvPjwvc3ZnPg==")',
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         backgroundSize: "60%",
//       };
//     });

//     // 2. Apply/Merge Hint Styles (Background Color)
//     Object.entries(hintSquares).forEach(([square, style]) => {
//       styles[square] = {
//         ...styles[square], // Keep star image if it exists
//         ...style, // Add highlight color
//       };
//     });

//     return styles;
//   }, [stars, hintSquares]);

//   if (error) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-stone-100 p-4">
//         <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border-2 border-red-100">
//           <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-bold mb-2">Unable to Load Puzzle</h2>
//           <p className="text-slate-500 text-sm">{error}</p>
//           <button onClick={() => router.back()} className="mt-6 w-full py-3 bg-stone-800 text-white rounded-lg">
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!puzzle)
//     return (
//       <div className="h-screen flex items-center justify-center text-slate-600 font-bold">
//         <Loader2 className="animate-spin mr-2 text-orange-600" />
//         Loading Puzzle...
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-slate-50 py-10 px-4 flex flex-col items-center">
//       <div className="w-full max-w-6xl space-y-8">
//         {/* HEADER */}
//         <div className="flex items-center justify-between">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-stone-600 hover:text-black transition font-semibold"
//           >
//             <ArrowLeft className="h-5 w-5" /> Back
//           </button>

//           <div className="text-center">
//             <h1 className="text-3xl font-extrabold text-slate-800">{puzzle.title}</h1>
//             <span className="inline-block mt-1 px-3 py-0.5 text-xs font-bold rounded-full bg-orange-100 text-orange-700 uppercase">
//               {puzzle.stage}
//             </span>
//           </div>

//           <button
//             onClick={handleSkip}
//             className="flex items-center text-stone-500 hover:text-stone-700 transition font-medium text-sm"
//           >
//             Skip <SkipForward className="ml-2 h-4 w-4" />
//           </button>
//         </div>

//         {/* MAIN AREA */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* CHESSBOARD */}
//           <div className="flex justify-center">
//             <div
//               ref={boardContainerRef}
//               className="w-full max-w-[550px] aspect-square rounded-xl overflow-hidden shadow-2xl bg-white border-4 border-white"
//             >
//               <Chessboard
//                 position={game.fen()}
//                 onPieceDrop={onDrop}
//                 boardOrientation={orientation}
//                 boardWidth={containerWidth}
//                 animationDuration={200}
//                 customDarkSquareStyle={{ backgroundColor: "#779556" }}
//                 customLightSquareStyle={{ backgroundColor: "#ebecd0" }}
//                 customSquareStyles={customSquareStyles}
//               />
//             </div>
//           </div>

//           {/* CONTROLS */}
//           <div className="flex flex-col justify-center space-y-6 pt-4">
//             {/* STATUS */}
//             <div
//               className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
//                 statusState === "COMPLETED"
//                   ? "bg-green-50 border-green-200"
//                   : statusState === "WRONG"
//                   ? "bg-red-50 border-red-200"
//                   : "bg-white border-slate-200 shadow-sm"
//               }`}
//             >
//               <div className="flex items-center gap-4">
//                 {statusState === "COMPLETED" ? (
//                   <CheckCircle className="h-10 w-10 text-green-600" />
//                 ) : statusState === "WRONG" ? (
//                   <XCircle className="h-10 w-10 text-red-600" />
//                 ) : (
//                   <Play className="h-10 w-10 text-blue-500" />
//                 )}

//                 <div>
//                   <h2 className="text-xl font-bold">
//                     {statusState === "COMPLETED"
//                       ? "Puzzle Solved!"
//                       : statusState === "WRONG"
//                       ? "Incorrect Move"
//                       : `${game.turn() === "w" ? "White" : "Black"} to Move`}
//                   </h2>
//                   <p className="text-sm text-slate-500">
//                     {stars.length > 0
//                       ? `${stars.length} star${stars.length > 1 ? "s" : ""} remaining`
//                       : statusState === "COMPLETED"
//                       ? "Great job! All done."
//                       : "Find the best move."}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* ACTION BUTTONS */}
//             {statusState !== "COMPLETED" ? (
//               <div className="grid grid-cols-2 gap-4">
//                 <button
//                   onClick={resetPuzzle}
//                   className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-white border-2 border-slate-200 hover:bg-slate-50"
//                 >
//                   <RotateCcw className="h-5 w-5" /> Reset
//                 </button>

//                 <button
//                   onClick={handleHint}
//                   className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-blue-50 border-2 border-blue-100 hover:bg-blue-100"
//                 >
//                   <Lightbulb className="h-5 w-5" /> Hint
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={handleNext}
//                 className="w-full py-4 rounded-xl font-bold text-lg shadow-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 transition"
//               >
//                 {nextPuzzleId ? "Next Puzzle" : "Back to Library"} <ArrowRight className="h-5 w-5" />
//               </button>
//             )}

//             {puzzle.description && (
//               <div className="mt-4 p-4 bg-slate-100 rounded-xl text-slate-600 text-sm">
//                 <span className="font-bold block mb-1">Description:</span>
//                 {puzzle.description}
//               </div>
//             )}
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
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

// --- INTERFACES ---

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
  // Ensure the 'data' field is handled correctly, often stored as JSON in the database
  data?: PuzzleData | string; 
}

// --- UTILITY: Get piece info from react-chessboard string ('wN', 'bR', etc.)
const getPieceInfo = (pieceStr: string) => ({
    color: pieceStr[0] as Color,
    type: pieceStr[1].toLowerCase() as PieceSymbol,
});

export default function PuzzlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const puzzleId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  const context = searchParams.get("context") || null;
  const folderId = searchParams.get("folderId") || null;

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [nextPuzzleId, setNextPuzzleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize with a fresh game instance
  const [game, setGame] = useState(new Chess());
  const [currentFen, setCurrentFen] = useState("start");
  const [solutionMoves, setSolutionMoves] = useState<string[]>([]);
  const [moveIndex, setMoveIndex] = useState(0);
  const [orientation, setOrientation] = useState<"white" | "black">("white");

  const [stars, setStars] = useState<string[]>([]);
  const [hintSquares, setHintSquares] = useState<Record<string, React.CSSProperties>>({});
  
  const [statusState, setStatusState] =
    useState<"IDLE" | "CORRECT" | "WRONG" | "COMPLETED">("IDLE");

  const [containerWidth, setContainerWidth] = useState(500);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  // Responsive Board Observer
  useEffect(() => {
    if (!boardContainerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setContainerWidth(boardContainerRef.current!.offsetWidth);
    });
    resizeObserver.observe(boardContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

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
        
        // --- 1. Parse Stars (Robust JSON handling) ---
        let parsedData: PuzzleData = {};
        if (typeof data.data === "string") {
            try { parsedData = JSON.parse(data.data); } catch (e) { console.error("Error parsing puzzle data string:", e); }
        } else if (typeof data.data === "object" && data.data !== null) {
            parsedData = data.data as PuzzleData;
        }
        setStars(parsedData.stars && Array.isArray(parsedData.stars) ? parsedData.stars : []);

        // --- 2. Robust Game Loading ---
        const newGame = new Chess();
        try {
            // Try standard load. This handles most standard FENs.
            newGame.load(data.fen);
        } catch (e) {
            console.warn("Standard load failed. Using FEN for display, piece movement might rely on custom logic.");
             // If load fails (e.g., no kings), we still use the engine for basic features.
             // We MUST keep the original FEN for display and subsequent manual updates.
        }

        setGame(newGame);
        setCurrentFen(data.fen);
        
        // Auto-detect orientation based on side to move
        const turn = data.fen.split(' ')[1];
        if (turn === "w") setOrientation("white");
        else if (turn === "b") setOrientation("black");
        
        setPuzzle(data);
        setSolutionMoves(data.solution.trim().split(/\s+/)); // Use regex to handle multiple spaces
        setMoveIndex(0);
        setStatusState("IDLE");

        // Fetch Next ID
        let url = "";
        if (context === "todo") url = `/api/assignments/next?currentId=${puzzleId}`;
        else if (folderId) url = `/api/content/next?folderId=${folderId}&currentId=${puzzleId}`;

        if (url) {
            try {
                const nextRes = await fetch(url);
                if (nextRes.ok) {
                    const nextData = await nextRes.json();
                    setNextPuzzleId(nextData?.id || nextData?.nextId || (Array.isArray(nextData) && nextData[0]?.id) || null);
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

  // Hint: Highlight Source Square
  const handleHint = () => {
    if (statusState === "COMPLETED" || moveIndex >= solutionMoves.length) return;
    const correctMoveStr = solutionMoves[moveIndex];
    let fromSquare = "";

    // 1. Try Coordinate Notation (e2-e4 or e2e4)
    if (correctMoveStr.includes("-") || correctMoveStr.length === 4) {
        fromSquare = correctMoveStr.slice(0, 2);
    } else {
        // 2. Try SAN (Standard Notation) via engine
        try {
            const temp = new Chess(currentFen);
            const move = temp.move(correctMoveStr); 
            if (move) fromSquare = move.from;
        } catch(e) {}
    }

    if (fromSquare) {
      setHintSquares({ [fromSquare]: { backgroundColor: "rgba(255, 255, 0, 0.5)" } });
      toast.info("Piece to move highlighted!");
    } else {
      toast.warning("Cannot determine hint.");
    }
  };

  // --- CUSTOM MOVEMENT LOGIC (Only piece geometry) ---
  const isGeometryValid = (piece: string, from: string, to: string) => {
    const { type } = getPieceInfo(piece);
    const x1 = from.charCodeAt(0), y1 = parseInt(from[1]);
    const x2 = to.charCodeAt(0), y2 = parseInt(to[1]);
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);

    // Checks basic legal moves for all pieces
    if (type === 'n') return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
    if (type === 'r') return dx === 0 || dy === 0;
    if (type === 'b') return dx === dy;
    if (type === 'q') return dx === 0 || dy === 0 || dx === dy;
    if (type === 'k') return dx <= 1 && dy <= 1;
    
    // Simplifed Pawn logic for custom puzzles
    if (type === 'p') {
        const direction = piece[0] === 'w' ? 1 : -1;
        const startRank = piece[0] === 'w' ? 2 : 7;
        const fromRank = parseInt(from[1]);
        const isInitialMove = fromRank === startRank;

        // Forward 1 step
        if (dx === 0 && y2 - y1 === direction) return true;
        // Forward 2 steps from start
        if (dx === 0 && y2 - y1 === 2 * direction && isInitialMove) return true;
        // Capture
        if (dx === 1 && y2 - y1 === direction) return true;
    }
    
    return false;
  };

  const onDrop = (from: string, to: string, piece: string) => {
    if (statusState === "COMPLETED" || statusState === "WRONG") return false;

    let validMove = false;
    let newFen = currentFen;

    // Use a fresh game instance for validation and update
    const tempGame = new Chess();
    try { 
        tempGame.load(currentFen); 
    } catch { 
        // If load fails (e.g., non-standard FEN), manually clear and put pieces
        tempGame.clear(); 
        console.warn("Attempting custom load...");
        // This is complex, so we will rely purely on manual board manipulation below
    }

    // --- 1. Try Standard Move (For standard Puzzles) ---
    try {
        const move = tempGame.move({ from, to, promotion: "q" });
        if (move) {
            validMove = true;
            newFen = tempGame.fen();
        }
    } catch (e) {
        // console.log("Standard move failed:", e);
    }
    
    // --- 2. Try Custom/Forced Move (For non-standard/custom Puzzles) ---
    if (!validMove) {
        if (isGeometryValid(piece, from, to)) {
            validMove = true;
            
            // Re-load the state for manual manipulation
            const forcedGame = new Chess();
            try { forcedGame.load(currentFen); } catch {}
            
            const { color, type } = getPieceInfo(piece);
            
            // Force the move using `put` and `remove`
            forcedGame.remove(from as any);
            forcedGame.put({ type, color }, to as any);
            
            // --- FEN Construction Fix ---
            const fenParts = currentFen.split(' ');
            const newBoardPlacement = forcedGame.fen().split(' ')[0];
            const newTurnColor = color === 'w' ? 'b' : 'w'; // Flip the turn color
            
            // Use the forced board state but keep simplified non-piece parts (no castling, no en passant)
            // This is the safest way to update the FEN for custom, rule-bending puzzles.
            newFen = `${newBoardPlacement} ${newTurnColor} - - 0 1`; 
        }
    }

    if (!validMove) return false;

    // --- 3. Check Solution ---
    const expected = solutionMoves[moveIndex];
    const userMoveStr = `${from}-${to}`; // Coordinate notation

    // Robust solution check to handle e4-f6, e4f6, or e4->f6 notations
    const moveMatches = 
      expected === userMoveStr ||
      expected === userMoveStr.replace("-", "") ||
      expected.includes(userMoveStr) ||
      expected.includes(userMoveStr.replace("-", ""));

    if (moveMatches) {
        // Update game state
        setGame(new Chess(newFen)); // Use the calculated newFen
        setCurrentFen(newFen);      // Update visual board

        // Collect Star
        if (stars.includes(to)) {
            setStars((prev) => prev.filter((s) => s !== to));
        }

        setHintSquares({}); 
        handleCorrectStep(newFen);
        return true;
    } else {
        handleIncorrect(userMoveStr);
        // Return true to allow the piece to briefly move, then reset by statusState update
        // Or return false to revert the move immediately. (Returning false is safer for UX)
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

    // Auto-Play Opponent (Only if not a star puzzle, or if the solution move is a SAN/to square notation)
    const reply = solutionMoves[nextIndex];
    const isCoordinateMove = reply.includes("-") || reply.length === 4;

    if (stars.length === 0 && reply && !isCoordinateMove) {
          setTimeout(() => {
              const g = new Chess(fenAfterMove);
              try { 
                  // Move using SAN (or just the target square if it works)
                  const move = g.move(reply); 
                  if (move) {
                      const replyFen = g.fen();
                      setGame(g);
                      setCurrentFen(replyFen);
                      setMoveIndex(nextIndex + 1);
                  } else {
                      // Fallback: If SAN fails, rely on the next user move.
                      setMoveIndex(nextIndex + 1);
                  }
              } catch {
                 // If move throws, rely on the next user move
                 setMoveIndex(nextIndex + 1);
              }
              setStatusState("IDLE");
          }, 500);
    } else {
        // If it's a coordinate move, it's the next player's (user's) move
        setMoveIndex(nextIndex); // Keep index here for the user to make the move
        setStatusState("IDLE");
    }
  };

  const handleIncorrect = (wrongSan: string) => {
    setStatusState("WRONG");
    toast.error("Wrong Move! Resetting...");
    saveProgress(false, wrongSan);
    
    // Reset the board to the start position after a brief delay
    setTimeout(() => {
        resetPuzzle();
    }, 1000); 
  };

  const saveProgress = (isCorrect: boolean, wrongMove: string | null) => {
    const studentId = (session?.user as any)?.id;
    if (!studentId || !puzzleId) return;
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, puzzleId, isCorrect, wrongMove }),
    }).catch(e => console.error("Failed to save progress:", e));
  };

  const resetPuzzle = () => {
    if (!puzzle) return;
    const newGame = new Chess();
    try { newGame.load(puzzle.fen); } catch { /* Keep default or handle manually */ }
    
    setGame(newGame);
    setCurrentFen(puzzle.fen);
    setMoveIndex(0);
    setStatusState("IDLE");
    setHintSquares({});
    
    let parsedData: PuzzleData = {};
    try { parsedData = typeof puzzle.data === 'string' ? JSON.parse(puzzle.data) : puzzle.data || {}; } catch {}
    setStars(parsedData.stars || []);
  };

  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    // Add star graphics
    stars.forEach((square) => {
      styles[square] = {
        backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZDcwMCIgc3Ryb2tlPSJnb2xkIiBzdHJva2Utd2lkdGg9IjMiPjxwb2x5Z29uIHBvaW50cz0iMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMiIvPjwvc3ZnPg==")',
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "60%",
      };
    });
    // Add hint highlighting
    Object.entries(hintSquares).forEach(([square, style]) => {
      styles[square] = { ...styles[square], ...style };
    });

    // Add visual feedback for last move (optional, requires tracking last move in state)
    // Example: Highlight the 'from' square and 'to' square
    
    return styles;
  }, [stars, hintSquares]);

  if (!puzzle) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 font-bold text-slate-700 hover:text-slate-900"><ArrowLeft /> Back</button>
          <div className="text-center">
            <h1 className="text-3xl font-extrabold">{puzzle.title}</h1>
            <span className="inline-block mt-1 px-3 py-0.5 text-xs font-bold rounded-full bg-orange-100 text-orange-700 uppercase">
                {puzzle.stage}
            </span>
          </div>
          <button onClick={handleSkip} className="flex items-center gap-2 font-bold text-gray-500 hover:text-gray-700">Skip <SkipForward/></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <div ref={boardContainerRef} className="w-full max-w-[550px] aspect-square rounded-xl shadow-2xl bg-white border-4 border-white">
              <Chessboard
                position={currentFen}
                onPieceDrop={onDrop}
                boardOrientation={orientation}
                boardWidth={containerWidth}
                customDarkSquareStyle={{ backgroundColor: "#779556" }}
                customLightSquareStyle={{ backgroundColor: "#ebecd0" }}
                customSquareStyles={customSquareStyles}
                animationDuration={200}
              />
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-6 pt-4">
            <div className={`p-6 rounded-2xl border-2 transition-all ${statusState === "COMPLETED" ? "bg-green-50 border-green-200" : statusState === "WRONG" ? "bg-red-50 border-red-200" : "bg-white border-slate-200"}`}>
                <div className="flex items-center gap-4">
                    {statusState === "COMPLETED" ? <CheckCircle className="h-10 w-10 text-green-600" /> : statusState === "WRONG" ? <XCircle className="h-10 w-10 text-red-600" /> : <Play className="h-10 w-10 text-blue-500" />}
                    <div>
                        <h2 className="text-xl font-bold">{statusState === "COMPLETED" ? "Solved!" : statusState === "WRONG" ? "Try Again" : `${orientation === 'white' ? 'White' : 'Black'} to Move`}</h2>
                        <p className="text-sm text-gray-500">{stars.length > 0 ? `${stars.length} stars remaining` : `Move ${solutionMoves[moveIndex] || '...'} (${moveIndex + 1}/${solutionMoves.length})`}</p>
                    </div>
                </div>
            </div>
            {statusState !== "COMPLETED" ? (
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={resetPuzzle} className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-white border hover:bg-gray-50 text-slate-700"><RotateCcw/> Reset</button>
                    <button onClick={handleHint} className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-blue-50 border hover:bg-blue-100 text-blue-600"><Lightbulb/> Hint</button>
                </div>
            ) : (
                <button onClick={handleNext} className="w-full py-4 rounded-xl font-bold text-lg bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center gap-2">
                    {nextPuzzleId ? 'Next Puzzle' : 'Go to Library'} <ArrowRight/>
                </button>
            )}
            {puzzle.description && <div className="mt-4 p-4 bg-slate-100 rounded-xl text-sm text-slate-700">{puzzle.description}</div>}
            {error && (
                <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5"/>
                    <p className="font-semibold">Error: {error}</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}