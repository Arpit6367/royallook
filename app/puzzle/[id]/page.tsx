"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, RotateCcw, Play, Loader2, SkipForward, ArrowRight, AlertTriangle } from "lucide-react";
import { toast } from "sonner"; 

interface Puzzle {
  id: string;
  fen: string;
  solution: string;
  stage: string;
  title: string;
  description?: string;
}

export default function PuzzlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Safe ID extraction
  const puzzleId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  
  // Get Context and the 'next' ID passed from the Dashboard
  const context = searchParams.get('context'); 
  const folderId = searchParams.get('folderId');
  const nextIdFromUrl = searchParams.get('next'); 

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [nextPuzzleId, setNextPuzzleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [game, setGame] = useState(new Chess());
  const [solutionMoves, setSolutionMoves] = useState<string[]>([]);
  const [moveIndex, setMoveIndex] = useState(0);
  
  // Hint State
  const [hintArrow, setHintArrow] = useState<string[][]>([]); // Array of [from, to] arrows
  
  const [statusState, setStatusState] = useState<"IDLE" | "CORRECT" | "WRONG" | "COMPLETED">("IDLE");
  const [containerWidth, setContainerWidth] = useState(500);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  // --- 1. RESPONSIVE BOARD ---
  useEffect(() => {
    if (!boardContainerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (boardContainerRef.current) setContainerWidth(boardContainerRef.current.offsetWidth);
    });
    resizeObserver.observe(boardContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // --- 2. DATA FETCHING ---
  useEffect(() => {
    if (status === "unauthenticated") {
        router.push("/api/auth/signin");
        return;
    }
    
    if (status === "authenticated" && puzzleId) {
      setError(null);
      setHintArrow([]); // Reset hints on new puzzle

      // 1. Set Next ID immediately if available in URL
      if (nextIdFromUrl) {
        setNextPuzzleId(nextIdFromUrl);
      }
      
      const loadData = async () => {
        try {
            // A. Load Current Puzzle
            const res = await fetch(`/api/puzzles/${puzzleId}`);
            if (!res.ok) {
                if (res.status === 404) throw new Error("Puzzle not found in database.");
                throw new Error("Failed to load puzzle data.");
            }
            
            const data = await res.json();
            
            if (!data.fen || !data.solution) {
                throw new Error("Puzzle data is incomplete (missing FEN or Solution).");
            }

            // Safe Game Initialization
            try {
                const newGame = new Chess(data.fen);
                setGame(newGame);
            } catch (chessError) {
                throw new Error("Invalid Board Setup (FEN Code is broken).");
            }

            setPuzzle(data);
            setSolutionMoves(data.solution.trim().split(" "));
            setMoveIndex(0);
            setStatusState("IDLE");

            // B. Load Next Puzzle (Only if NOT provided in URL)
            // This is a fallback for when the user didn't come from the dashboard
            if (!nextIdFromUrl) {
                try {
                    let url = '';
                    if (context === 'todo') {
                        url = `/api/assignments/next?currentId=${puzzleId}`;
                    } else if (folderId) {
                        url = `/api/content/next?folderId=${folderId}&currentId=${puzzleId}`;
                    }

                    if (url) {
                        const nextRes = await fetch(url);
                        if (nextRes.ok) {
                            const nextData = await nextRes.json();
                            if (nextData.id) setNextPuzzleId(nextData.id);
                        }
                    }
                } catch (nextErr) {
                    console.warn("Could not fetch next puzzle via API:", nextErr);
                }
            }

        } catch (err: any) {
            console.error("Puzzle Load Error:", err);
            setError(err.message || "An unexpected error occurred.");
        }
      };

      loadData();
    }
  }, [status, puzzleId, router, context, folderId, nextIdFromUrl]);

  // --- 3. NAVIGATION HANDLERS ---
  const handleNext = () => {
    if (nextPuzzleId) {
       const query = new URLSearchParams();
       if(context) query.set('context', context);
       if(folderId) query.set('folderId', folderId);
       // We don't pass 'next' here because the *next* page needs to fetch its own successor
       // unless your API provides a chain list.
       router.push(`/puzzle/${nextPuzzleId}?${query.toString()}`);
    } else {
       router.push('/learn'); // Changed from /learn to dashboard
    }
  };

  const handleSkip = () => {
    handleNext(); 
  };

  // --- 4. HINT LOGIC (NEW) ---
  const handleHint = () => {
    if (statusState === "COMPLETED" || moveIndex >= solutionMoves.length) return;

    const correctSan = solutionMoves[moveIndex];
    
    // Find the 'from' and 'to' squares for the SAN move
    // We create a temp game to convert SAN (e.g., "Nf3") to squares (e.g., "g1", "f3")
    const tempGame = new Chess(game.fen());
    const moves = tempGame.moves({ verbose: true });
    const correctMoveObj = moves.find(m => m.san === correctSan);

    if (correctMoveObj) {
        setHintArrow([[correctMoveObj.from, correctMoveObj.to]]);
        toast.info("Here is the best move!");
    } else {
        toast.error("Could not calculate hint.");
    }
  };

  // --- 5. MOVE LOGIC ---
  const onDrop = (source: string, target: string) => {
    if (statusState === "COMPLETED" || statusState === "WRONG") return false;

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({ from: source, to: target, promotion: "q" });
      if (!move) return false;

      const expectedMoveSan = solutionMoves[moveIndex];
      
      if (move.san === expectedMoveSan) {
        setGame(gameCopy);
        setHintArrow([]); // Clear hint on correct move
        handleCorrectStep();
        return true;
      } else {
        handleIncorrect(move.san);
        return false; // Snapback
      }
    } catch { return false; }
  };

  const handleCorrectStep = () => {
    const nextIndex = moveIndex + 1;
    if (nextIndex >= solutionMoves.length) {
      setStatusState("COMPLETED");
      updateProgress(true, null);
      toast.success("Puzzle Solved!");
      return;
    }
    setMoveIndex(nextIndex);
    setStatusState("CORRECT");
    
    // Auto-play opponent response
    setTimeout(() => {
      const opponentMoveSan = solutionMoves[nextIndex];
      if (opponentMoveSan) {
        setGame((prev) => {
          const g = new Chess(prev.fen());
          g.move(opponentMoveSan);
          return g;
        });
        setMoveIndex(nextIndex + 1);
        setStatusState("IDLE");
      }
    }, 500);
  };

  const handleIncorrect = (wrongMoveSan: string) => {
    setStatusState("WRONG");
    toast.error("Incorrect move");
    updateProgress(false, wrongMoveSan);
    setTimeout(() => setStatusState("IDLE"), 1000);
  };

  const updateProgress = async (isSolved: boolean, wrongMove: string | null) => {
    const studentId = (session?.user as any)?.id;
    if (!studentId) return;

    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        studentId, 
        puzzleId, 
        isCorrect: isSolved,
        wrongMove
      }),
    }).catch(e => console.error("Failed to save progress", e));
  };

  const resetPuzzle = () => {
    if (!puzzle) return;
    setGame(new Chess(puzzle.fen));
    setMoveIndex(0);
    setStatusState("IDLE");
    setHintArrow([]);
  };

  // --- RENDER ---

  if (error) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-stone-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border-2 border-red-100">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4"/>
                <h2 className="text-xl font-bold text-stone-800 mb-2">Unable to Load Puzzle</h2>
                <p className="text-stone-500 mb-6 font-mono text-sm bg-stone-50 p-2 rounded">{error}</p>
                <button onClick={() => router.back()} className="w-full py-3 bg-stone-800 text-white rounded-lg font-bold hover:bg-black transition">
                    Go Back
                </button>
            </div>
        </div>
    );
  }

  if (!puzzle) return <div className="h-screen flex items-center justify-center text-slate-600 font-bold"><Loader2 className="animate-spin mr-2 text-orange-600"/> Loading Puzzle...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-600 hover:text-black transition font-semibold">
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-slate-800">{puzzle.title}</h1>
            <span className="inline-block mt-1 px-3 py-0.5 text-xs font-bold rounded-full bg-orange-100 text-orange-700 uppercase">
              {puzzle.stage}
            </span>
          </div>
          <button onClick={handleSkip} className="flex items-center text-stone-500 hover:text-stone-700 transition font-medium text-sm">
            Skip <SkipForward className="ml-2 h-4 w-4" />
          </button>
        </div>

        {/* GAME AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* BOARD */}
          <div className="flex justify-center md:justify-end">
            <div ref={boardContainerRef} className="w-full max-w-[550px] aspect-square rounded-xl overflow-hidden shadow-2xl bg-white border-4 border-white">
              <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                boardWidth={containerWidth}
                animationDuration={200}
                customDarkSquareStyle={{ backgroundColor: "#779556" }}
                customLightSquareStyle={{ backgroundColor: "#ebecd0" }}
                // Hint Arrows
                customArrows={hintArrow as [string, string][]}
              />
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-col justify-center space-y-6 pt-4">
            
            {/* Status Card */}
            <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                statusState === "COMPLETED" ? "bg-green-50 border-green-200" : 
                statusState === "WRONG" ? "bg-red-50 border-red-200" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center gap-4">
                {statusState === "COMPLETED" ? <CheckCircle className="h-10 w-10 text-green-600" /> : 
                 statusState === "WRONG" ? <XCircle className="h-10 w-10 text-red-600" /> : 
                 <Play className="h-10 w-10 text-blue-500" />}
                
                <div>
                  <h2 className={`text-xl font-bold ${
                      statusState === "COMPLETED" ? "text-green-800" : 
                      statusState === "WRONG" ? "text-red-800" : "text-slate-800"
                  }`}>
                    {statusState === "COMPLETED" ? "Puzzle Solved!" : 
                     statusState === "WRONG" ? "Incorrect Move" : 
                     `${game.turn() === "w" ? "White" : "Black"} to Move`}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    {statusState === "COMPLETED" ? "Great job! Ready for the next one?" : "Find the best continuation."}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {statusState !== "COMPLETED" ? (
              <div className="grid grid-cols-2 gap-4">
                <button onClick={resetPuzzle} className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition">
                  <RotateCcw className="h-5 w-5" /> Reset
                </button>
                <button onClick={handleHint} className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-blue-50 border-2 border-blue-100 text-blue-600 hover:bg-blue-100 transition">
                  <Lightbulb className="h-5 w-5" /> Hint
                </button>
              </div>
            ) : (
              <button onClick={handleNext} className="w-full py-4 rounded-xl font-bold text-lg shadow-lg bg-orange-500 hover:bg-orange-600 text-white transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                {nextPuzzleId ? "Next Puzzle" : "Back to Library"} <ArrowRight />
              </button>
            )}

            {/* Description (Optional) */}
            {puzzle.description && (
                <div className="mt-4 p-4 bg-slate-100 rounded-xl text-slate-600 text-sm">
                    <span className="font-bold block mb-1 text-slate-700">Description:</span>
                    {puzzle.description}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}