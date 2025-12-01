"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, RotateCcw, Play, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Remove if you don't use Sonner

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
  const puzzleId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
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

  // --- 2. FETCH DATA ---
  useEffect(() => {
    if (status === "unauthenticated") router.push("/api/auth/signin");
    if (status === "authenticated" && puzzleId) {
      fetch(`/api/puzzles/${puzzleId}/details`)
        .then((res) => {
          if(!res.ok) throw new Error("Failed");
          return res.json();
        })
        .then((data) => {
          setPuzzle(data);
          const newGame = new Chess(data.fen);
          setGame(newGame);
          setSolutionMoves(data.solution.trim().split(" "));
          setMoveIndex(0);
        })
        .catch(() => router.push("/learn"));
    }
  }, [status, puzzleId, router]);

  // --- 3. MOVE LOGIC ---
  const onDrop = (source: string, target: string) => {
    if (statusState === "COMPLETED" || statusState === "WRONG") return false;

    try {
      // 1. Validate Chess Move
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({ from: source, to: target, promotion: "q" });
      if (!move) return false;

      // 2. Validate Solution
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
    
    // Auto-play Opponent
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

  // --- 4. API ---
  const updateProgress = async (isSolved: boolean, wrongMove: string | null) => {
    const studentId = (session?.user as any)?.id;
    if (!studentId) return;

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        studentId, 
        puzzleId, 
        isCorrect: isSolved,
        wrongMove
      }),
    });
  };

  const resetPuzzle = () => {
    if (!puzzle) return;
    setGame(new Chess(puzzle.fen));
    setMoveIndex(0);
    setStatusState("IDLE");
  };

  if (!puzzle) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin mr-2"/> Loading...</div>;

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push('/learn')} className="flex items-center text-stone-500 hover:text-black font-bold transition">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Dashboard
          </button>
          <div className="text-center">
             <h1 className="text-2xl font-bold text-stone-800">{puzzle.title}</h1>
             <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded uppercase tracking-wider">{puzzle.stage}</span>
          </div>
          <div className="w-20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Board */}
          <div className="flex justify-center md:justify-end">
            <div ref={boardContainerRef} className="w-full max-w-[550px] aspect-square shadow-2xl rounded-lg overflow-hidden border-[6px] border-stone-300 bg-white">
              <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                boardWidth={containerWidth}
                animationDuration={200}
                customDarkSquareStyle={{ backgroundColor: "#779556" }}
                customLightSquareStyle={{ backgroundColor: "#ebecd0" }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col justify-center space-y-6 max-w-md">
            <div className={`p-6 rounded-xl border-2 flex items-center gap-4 transition-all duration-300 ${statusState === 'COMPLETED' ? 'bg-green-50 border-green-200 text-green-800' : statusState === 'WRONG' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-white border-stone-200 text-stone-600'}`}>
               {statusState === 'COMPLETED' ? <CheckCircle className="h-10 w-10 text-green-600" /> : statusState === 'WRONG' ? <XCircle className="h-10 w-10 text-red-600" /> : <Play className="h-10 w-10 text-stone-400" />}
               <div>
                 <h2 className="font-bold text-lg">{statusState === 'COMPLETED' ? "Puzzle Solved!" : statusState === 'WRONG' ? "Incorrect Move" : `${game.turn() === 'w' ? "White" : "Black"} to Move`}</h2>
                 <p className="text-sm opacity-80">{statusState === 'COMPLETED' ? "Great job! Return to menu." : "Find the best continuation."}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button onClick={resetPuzzle} className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-stone-200 rounded-xl font-bold text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition">
                 <RotateCcw className="h-5 w-5"/> Reset
               </button>
               <button onClick={() => alert("Look for checks, captures, and threats!")} className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-stone-200 rounded-xl font-bold text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition">
                 <Lightbulb className="h-5 w-5"/> Hint
               </button>
            </div>

            {statusState === 'COMPLETED' && (
              <button onClick={() => router.push('/learn')} className="w-full py-4 bg-green-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-green-700 transition transform active:scale-95">
                Continue Learning
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}