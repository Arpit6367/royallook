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

  const puzzleId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
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
  const [hintSquares, setHintSquares] = useState<Record<string, React.CSSProperties>>({});
  
  const [statusState, setStatusState] =
    useState<"IDLE" | "CORRECT" | "WRONG" | "COMPLETED">("IDLE");

  const [containerWidth, setContainerWidth] = useState(500);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  // Resize Observer
  useEffect(() => {
    if (!boardContainerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setContainerWidth(boardContainerRef.current!.offsetWidth);
    });
    resizeObserver.observe(boardContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // --- HELPER: Safe Board Loading ---
  // This manually places pieces if standard load fails (e.g. no kings)
  const getSafeGame = (fen: string) => {
    const g = new Chess();
    g.clear();
    try {
      g.load(fen);
    } catch (e) {
      // Manual setup for "illegal" boards
      const [placement] = fen.split(' ');
      const rows = placement.split('/');
      rows.forEach((row, rIdx) => {
        let cIdx = 0;
        for (const char of row) {
          if (/\d/.test(char)) {
            cIdx += parseInt(char);
          } else {
            const square = String.fromCharCode(97 + cIdx) + (8 - rIdx);
            const color = char === char.toUpperCase() ? 'w' : 'b';
            const type = char.toLowerCase();
            g.put({ type: type as PieceSymbol, color: color as Color }, square as any);
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
            try { parsedData = JSON.parse(data.data); } catch (e) {}
        } else if (typeof data.data === "object" && data.data !== null) {
            parsedData = data.data as PuzzleData;
        }
        setStars(parsedData.stars && Array.isArray(parsedData.stars) ? parsedData.stars : []);

        // Load Game State safely
        const newGame = getSafeGame(data.fen);
        setGame(newGame);
        setCurrentFen(data.fen); 
        
        // Orientation
        if (data.fen.includes(" w ")) setOrientation("white");
        else if (data.fen.includes(" b ")) setOrientation("black");
        
        setPuzzle(data);
        setSolutionMoves(data.solution.trim().split(" "));
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

  // Hint Logic
  const handleHint = () => {
    if (statusState === "COMPLETED" || moveIndex >= solutionMoves.length) return;
    const correctMoveStr = solutionMoves[moveIndex];
    let fromSquare = "";

    if (correctMoveStr.includes("-")) fromSquare = correctMoveStr.split("-")[0];
    else {
        try {
            const temp = getSafeGame(currentFen); // Use safe loader
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

  // Geometry Check for Custom Moves
  const isGeometryValid = (piece: string, from: string, to: string) => {
    const type = piece[1].toLowerCase(); 
    const x1 = from.charCodeAt(0), y1 = parseInt(from[1]);
    const x2 = to.charCodeAt(0), y2 = parseInt(to[1]);
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);

    if (type === 'n') return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
    if (type === 'r') return dx === 0 || dy === 0;
    if (type === 'b') return dx === dy;
    if (type === 'q') return dx === 0 || dy === 0 || dx === dy;
    if (type === 'k') return dx <= 1 && dy <= 1;
    if (type === 'p') return (piece[0] === 'w' ? (y2 > y1) : (y2 < y1)) && dx <= 1 && dy <= 2; 
    
    return false;
  };

  const onDrop = (from: string, to: string, piece: string) => {
    if (statusState === "COMPLETED" || statusState === "WRONG") return false;

    // Use Safe Game Loader (Critical Fix)
    const gameCopy = getSafeGame(currentFen);

    let validMove = false;
    let newFen = "";

    // 1. Try Standard Move
    try {
        const move = gameCopy.move({ from, to, promotion: "q" });
        if (move) {
            validMove = true;
            newFen = gameCopy.fen();
        }
    } catch (e) {}

    // 2. Try Custom Move (Geometry Check)
    if (!validMove) {
        if (isGeometryValid(piece, from, to)) {
            validMove = true;
            
            // Manual Board Update
            gameCopy.remove(from as any);
            gameCopy.put({ type: piece[1].toLowerCase() as PieceSymbol, color: piece[0] as Color }, to as any);
            
            // Generate FEN manually to force update
            newFen = gameCopy.fen();
            
            // Hack: If chess.js generated a FEN with missing parts because of no kings,
            // we accept it because getSafeGame handles it on next render.
        }
    }

    if (!validMove) return false;

    // 3. Check Solution
    const expected = solutionMoves[moveIndex];
    // Allow coordinate match (e2-e4) or SAN match if available
    const isCorrect = 
        expected === `${from}-${to}` || 
        expected === `${from}${to}` ||
        (validMove && !expected.includes("-") && expected === to) ||
        (validMove && expected === `${from}${to}`.replace("-", ""));

    if (isCorrect) {
        setGame(gameCopy);
        setCurrentFen(newFen);

        // Collect Star
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
    // Only auto-play if stars are gone (assuming star puzzle requires manual moves)
    if (stars.length === 0 && reply && !reply.includes("-")) {
         setTimeout(() => {
            const g = getSafeGame(fenAfterMove);
            try { 
                g.move(reply); 
                const replyFen = g.fen();
                setGame(g);
                setCurrentFen(replyFen);
                setMoveIndex(nextIndex + 1);
            } catch {}
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
    try { parsedData = typeof puzzle.data === 'string' ? JSON.parse(puzzle.data) : puzzle.data || {}; } catch {}
    setStars(parsedData.stars || []);
  };

  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    stars.forEach((square) => {
      styles[square] = {
        backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZDcwMCIgc3Ryb2tlPSJnb2xkIiBzdHJva2Utd2lkdGg9IjMiPjxwb2x5Z29uIHBvaW50cz0iMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMiIvPjwvc3ZnPg==")',
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "60%",
      };
    });
    Object.entries(hintSquares).forEach(([square, style]) => {
      styles[square] = { ...styles[square], ...style };
    });
    return styles;
  }, [stars, hintSquares]);

  if (!puzzle) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 font-bold"><ArrowLeft /> Back</button>
          <div className="text-center">
            <h1 className="text-3xl font-extrabold">{puzzle.title}</h1>
            <span className="inline-block mt-1 px-3 py-0.5 text-xs font-bold rounded-full bg-orange-100 text-orange-700 uppercase">
                {puzzle.stage}
            </span>
          </div>
          <button onClick={handleSkip} className="flex items-center gap-2 font-bold text-gray-500">Skip <SkipForward/></button>
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
                        <p className="text-sm text-gray-500">{stars.length > 0 ? `${stars.length} stars remaining` : "Find the best move"}</p>
                    </div>
                </div>
            </div>
            {statusState !== "COMPLETED" ? (
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={resetPuzzle} className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-white border hover:bg-gray-50"><RotateCcw/> Reset</button>
                    <button onClick={handleHint} className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-blue-50 border hover:bg-blue-100"><Lightbulb/> Hint</button>
                </div>
            ) : (
                <button onClick={handleNext} className="w-full py-4 rounded-xl font-bold text-lg bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center gap-2">Next <ArrowRight/></button>
            )}
            {puzzle.description && <div className="mt-4 p-4 bg-slate-100 rounded-xl text-sm">{puzzle.description}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}