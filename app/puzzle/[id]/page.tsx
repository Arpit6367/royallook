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
  const context = searchParams.get('context'); 
  const folderId = searchParams.get('folderId');

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [nextPuzzleId, setNextPuzzleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // Added Error State
  
  const [game, setGame] = useState(new Chess());
  const [solutionMoves, setSolutionMoves] = useState<string[]>([]);
  const [moveIndex, setMoveIndex] = useState(0);
  
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
      setError(null); // Reset error
      
      const loadData = async () => {
        try {
            // A. Load Puzzle
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

            // B. Load Next Puzzle (Fail silently if this part breaks, don't block the page)
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
                console.warn("Could not fetch next puzzle:", nextErr);
            }

        } catch (err: any) {
            console.error("Puzzle Load Error:", err);
            setError(err.message || "An unexpected error occurred.");
        }
      };

      loadData();
    }
  }, [status, puzzleId, router, context, folderId]);

  // --- 3. NAVIGATION HANDLERS ---
  const handleNext = () => {
    if (nextPuzzleId) {
       const query = new URLSearchParams();
       if(context) query.set('context', context);
       if(folderId) query.set('folderId', folderId);
       router.push(`/puzzle/${nextPuzzleId}?${query.toString()}`);
    } else {
       router.push('/learn'); 
    }
  };

  const handleSkip = () => {
    handleNext(); 
  };

  // --- 4. MOVE LOGIC ---
  const onDrop = (source: string, target: string) => {
    if (statusState === "COMPLETED" || statusState === "WRONG") return false;

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({ from: source, to: target, promotion: "q" });
      if (!move) return false;

      const expectedMoveSan = solutionMoves[moveIndex];
      if (move.san === expectedMoveSan) {
        setGame(gameCopy);
        handleCorrectStep();
        return true;
      } else {
        handleIncorrect(move.san);
        return false;
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
    setTimeout(() => setStatusState("IDLE"), 1500);
  };

  const updateProgress = async (isSolved: boolean, wrongMove: string | null) => {
    const studentId = (session?.user as any)?.id;
    if (!studentId) return;

    // Fire and forget - don't block UI
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
  };

  // --- RENDER STATES ---

  // 1. Error State (Shows why it's not opening)
  if (error) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-stone-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border-2 border-red-100">
                <div className="bg-red-50 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32}/>
                </div>
                <h2 className="text-xl font-bold text-stone-800 mb-2">Unable to Load Puzzle</h2>
                <p className="text-stone-500 mb-6 font-mono text-sm bg-stone-50 p-2 rounded">{error}</p>
                <button onClick={() => router.back()} className="w-full py-3 bg-stone-800 text-white rounded-lg font-bold hover:bg-black transition">
                    Go Back
                </button>
            </div>
        </div>
    );
  }

  // 2. Loading State
  if (!puzzle) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin mr-2 text-orange-600"/> Loading Puzzle...</div>;

  // 3. Success State (Game)
// --- SUCCESS STATE (GAME) ---
return (
  <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-200 py-10 px-4 flex flex-col items-center">

    <div className="w-full max-w-6xl space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-600 hover:text-black transition font-semibold"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-900">{puzzle.title}</h1>
          <span className="inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full bg-orange-200 text-orange-700 tracking-wide uppercase shadow-sm">
            {puzzle.stage}
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="flex items-center text-stone-500 hover:text-stone-700 transition font-medium text-sm"
        >
          Skip <SkipForward className="ml-2 h-4 w-4" />
        </button>
      </div>

      {/* LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* BOARD */}
        <div className="flex justify-center md:justify-end">
          <div
            ref={boardContainerRef}
            className="
              w-full max-w-[560px] aspect-square 
              rounded-2xl overflow-hidden border-[8px] border-stone-300
              shadow-[0_10px_35px_rgba(0,0,0,0.12)]
              bg-white
            "
          >
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              boardWidth={containerWidth}
              animationDuration={200}
              customDarkSquareStyle={{ backgroundColor: "#769656" }}
              customLightSquareStyle={{ backgroundColor: "#EEEED2" }}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col justify-center space-y-8">

          {/* STATUS CARD */}
          <div
            className={`
              p-6 rounded-2xl shadow-md border transition-all duration-300
              ${
                statusState === "COMPLETED"
                  ? "bg-green-100/70 border-green-300 text-green-800"
                  : statusState === "WRONG"
                  ? "bg-red-100/70 border-red-300 text-red-800"
                  : "bg-white border-stone-300 text-stone-700"
              }
            `}
          >
            <div className="flex items-center gap-5">
              {statusState === "COMPLETED" ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : statusState === "WRONG" ? (
                <XCircle className="h-12 w-12 text-red-600" />
              ) : (
                <Play className="h-12 w-12 text-stone-400" />
              )}

              <div>
                <h2 className="text-xl font-bold">
                  {statusState === "COMPLETED"
                    ? "Puzzle Solved!"
                    : statusState === "WRONG"
                    ? "Incorrect Move"
                    : `${game.turn() === "w" ? "White" : "Black"} to Move`}
                </h2>
                <p className="text-sm opacity-75 mt-1">
                  {statusState === "COMPLETED"
                    ? "You're improving fast — keep going!"
                    : "Find the best continuation."}
                </p>
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          {statusState !== "COMPLETED" && (
            <div className="grid grid-cols-2 gap-5">
              <button
                onClick={resetPuzzle}
                className="
                  flex items-center justify-center gap-2 py-4 rounded-xl font-semibold 
                  bg-white border border-stone-300 text-stone-700 
                  shadow-sm hover:bg-stone-50 hover:shadow transition
                "
              >
                <RotateCcw className="h-5 w-5" /> Reset
              </button>

              <button
                onClick={() =>
                  toast.info("Hint: Look for forcing moves (checks, captures, threats)")
                }
                className="
                  flex items-center justify-center gap-2 py-4 rounded-xl font-semibold
                  bg-white border border-stone-300 text-stone-700 
                  shadow-sm hover:bg-stone-50 hover:shadow transition
                "
              >
                <Lightbulb className="h-5 w-5" /> Hint
              </button>
            </div>
          )}

          {/* NEXT PUZZLE BUTTON */}
          {statusState === "COMPLETED" && (
            <button
              onClick={handleNext}
              className="
                w-full py-4 rounded-xl font-bold text-lg shadow-lg
                bg-green-600 hover:bg-green-700 text-white 
                transition transform hover:scale-[1.02] active:scale-95
                flex items-center justify-center gap-2
              "
            >
              {nextPuzzleId ? "Next Puzzle" : "Finish"} <ArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);
}