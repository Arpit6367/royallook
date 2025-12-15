"use client";
import { useSession } from "next-auth/react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
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

interface Puzzle {
  id: string;
  fen: string;
  solution: string;
  stage: string;
  title: string;
  description?: string;
  data?: {
    stars?: string[];
  };
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

  const [game, setGame] = useState(new Chess());
  const [solutionMoves, setSolutionMoves] = useState<string[]>([]);
  const [moveIndex, setMoveIndex] = useState(0);
  const [orientation, setOrientation] = useState<"white" | "black">("white");

  // Stars state
  const [stars, setStars] = useState<string[]>([]);

  // REPLACED: hintArrow with hintSquares for highlighting
  const [hintSquares, setHintSquares] = useState<Record<string, React.CSSProperties>>({});
  
  const [statusState, setStatusState] =
    useState<"IDLE" | "CORRECT" | "WRONG" | "COMPLETED">("IDLE");

  const [containerWidth, setContainerWidth] = useState(500);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  // Responsive Board
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
    setHintSquares({}); // Reset hints on load

    const loadPuzzle = async () => {
      try {
        const res = await fetch(`/api/puzzles/${puzzleId}`);
        if (!res.ok) throw new Error("Puzzle not found.");

        const data: Puzzle = await res.json();
        if (!data.fen || !data.solution) throw new Error("Puzzle data incomplete.");

        const newGame = new Chess();
        newGame.clear();
        newGame.load(data.fen, { skipValidation: true });

        setGame(newGame);
        setOrientation(newGame.turn() === "b" ? "black" : "white");

        if (data.data?.stars && Array.isArray(data.data.stars)) {
          setStars(data.data.stars);
        } else {
          setStars([]);
        }

        setPuzzle(data);
        setSolutionMoves(data.solution.trim().split(" "));
        setMoveIndex(0);
        setStatusState("IDLE");

        // Load next puzzle logic
        let url = "";
        if (context === "todo") {
          url = `/api/assignments/next?currentId=${puzzleId}`;
        } else if (folderId) {
          url = `/api/content/next?folderId=${folderId}&currentId=${puzzleId}`;
        }

        if (url) {
          try {
            const nextRes = await fetch(url);
            if (nextRes.ok) {
              const nextData = await nextRes.json();
              const candidateId =
                nextData?.id ??
                nextData?.nextId ??
                nextData?.nextPuzzleId ??
                (Array.isArray(nextData) && nextData[0]?.id) ??
                null;
              setNextPuzzleId(candidateId || null);
            } else {
              setNextPuzzleId(null);
            }
          } catch (e) {
            setNextPuzzleId(null);
          }
        } else {
          setNextPuzzleId(null);
        }
      } catch (err: any) {
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
      const qs = query.toString();
      router.push(qs ? `/puzzle/${nextPuzzleId}?${qs}` : `/puzzle/${nextPuzzleId}`);
    } else {
      router.push("/learn");
    }
  };

  const handleSkip = () => handleNext();

  // MODIFIED: Highlight Squares instead of Arrow
  const handleHint = () => {
    if (statusState === "COMPLETED" || moveIndex >= solutionMoves.length) return;

    const correctSan = solutionMoves[moveIndex];
    const tempGame = new Chess(game.fen());
    const moves = tempGame.moves({ verbose: true });
    
    // Find the move object to get 'from' and 'to' squares
    const correctMoveObj = moves.find((m) => m.san === correctSan);

    if (correctMoveObj) {
      // Set background color for the From and To squares
      setHintSquares({
        [correctMoveObj.from]: { backgroundColor: "rgba(255, 255, 0, 0.5)" }, // Yellow transparent
        [correctMoveObj.to]: { backgroundColor: "rgba(255, 255, 0, 0.5)" }
      });
      toast.info("Best Move Highlighted!");
    }
  };

  const onDrop = (from: string, to: string) => {
    if (statusState === "COMPLETED" || statusState === "WRONG") return false;

    const gameCopy = new Chess(game.fen());
    let move = null;
    try {
      move = gameCopy.move({ from, to, promotion: "q" });
    } catch (e) {
      // Illegal normal move
    }

    if (!move && stars.includes(to)) {
      const piece = gameCopy.get(from);
      if (piece) {
        gameCopy.remove(from);
        gameCopy.put(piece, to);
        move = { from, to, san: `${from}-${to}` };
      }
    }

    if (!move) return false;

    const expected = solutionMoves[moveIndex];
    const isCorrect =
      move.san === expected ||
      (expected.includes("-") && `${from}-${to}` === expected);

    if (isCorrect) {
      setGame(gameCopy);
      if (stars.includes(to)) {
        setStars((prev) => prev.filter((s) => s !== to));
      }

      setHintSquares({}); // Clear hints on correct move
      handleCorrectStep();
      return true;
    } else {
      handleIncorrect(move.san);
      return false;
    }
  };

  const handleCorrectStep = () => {
    const nextIndex = moveIndex + 1;

    if (nextIndex >= solutionMoves.length) {
      const hasStars = puzzle?.data?.stars && puzzle.data.stars.length > 0;
      const allCollected = stars.length === 0;

      if (hasStars && !allCollected) {
        toast.warning("Collect all stars to complete the puzzle!");
        setStatusState("IDLE");
        return;
      }

      setStatusState("COMPLETED");
      saveProgress(true, null);
      toast.success("Puzzle Completed! 🎉");
      return;
    }

    setMoveIndex(nextIndex);
    setStatusState("CORRECT");

    const reply = solutionMoves[nextIndex];
    if (reply && !reply.includes("-")) {
      setTimeout(() => {
        setGame((prev) => {
          const g = new Chess(prev.fen());
          try {
            g.move(reply);
          } catch (e) {}
          return g;
        });
        setMoveIndex(nextIndex + 1);
        setStatusState("IDLE");
      }, 400);
    } else {
      setStatusState("IDLE");
    }
  };

  const handleIncorrect = (wrongSan: string) => {
    setStatusState("WRONG");
    toast.error("Wrong Move!");
    saveProgress(false, wrongSan);
    setTimeout(() => setStatusState("IDLE"), 700);
  };

  const saveProgress = (isCorrect: boolean, wrongMove: string | null) => {
    const studentId = (session?.user as any)?.id;
    if (!studentId) return;

    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        puzzleId,
        isCorrect,
        wrongMove,
      }),
    });
  };

  const resetPuzzle = () => {
    if (!puzzle) return;
    const newGame = new Chess();
    newGame.clear();
    newGame.load(puzzle.fen, { skipValidation: true });
    setGame(newGame);
    setOrientation(newGame.turn() === "b" ? "black" : "white");
    setMoveIndex(0);
    setStatusState("IDLE");
    setHintSquares({}); // Clear hints
    setStars(puzzle.data?.stars || []);
  };

  // MERGE STYLES: Combine Stars (Image) + Hints (Background Color)
  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // 1. Apply Star Styles (Background Image)
    stars.forEach((square) => {
      styles[square] = {
        backgroundImage:
          'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZDcwMCIgc3Ryb2tlPSJnb2xkIiBzdHJva2Utd2lkdGg9IjMiPjxwb2x5Z29uIHBvaW50cz0iMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMiIvPjwvc3ZnPg==")',
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "60%",
      };
    });

    // 2. Apply/Merge Hint Styles (Background Color)
    Object.entries(hintSquares).forEach(([square, style]) => {
      styles[square] = {
        ...styles[square], // Keep star image if it exists
        ...style, // Add highlight color
      };
    });

    return styles;
  }, [stars, hintSquares]);

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-stone-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border-2 border-red-100">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Unable to Load Puzzle</h2>
          <p className="text-slate-500 text-sm">{error}</p>
          <button onClick={() => router.back()} className="mt-6 w-full py-3 bg-stone-800 text-white rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!puzzle)
    return (
      <div className="h-screen flex items-center justify-center text-slate-600 font-bold">
        <Loader2 className="animate-spin mr-2 text-orange-600" />
        Loading Puzzle...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex flex-col items-center">
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
            <h1 className="text-3xl font-extrabold text-slate-800">{puzzle.title}</h1>
            <span className="inline-block mt-1 px-3 py-0.5 text-xs font-bold rounded-full bg-orange-100 text-orange-700 uppercase">
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

        {/* MAIN AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CHESSBOARD */}
          <div className="flex justify-center">
            <div
              ref={boardContainerRef}
              className="w-full max-w-[550px] aspect-square rounded-xl overflow-hidden shadow-2xl bg-white border-4 border-white"
            >
              <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                boardOrientation={orientation}
                boardWidth={containerWidth}
                animationDuration={200}
                customDarkSquareStyle={{ backgroundColor: "#779556" }}
                customLightSquareStyle={{ backgroundColor: "#ebecd0" }}
                customSquareStyles={customSquareStyles}
              />
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-col justify-center space-y-6 pt-4">
            {/* STATUS */}
            <div
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                statusState === "COMPLETED"
                  ? "bg-green-50 border-green-200"
                  : statusState === "WRONG"
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4">
                {statusState === "COMPLETED" ? (
                  <CheckCircle className="h-10 w-10 text-green-600" />
                ) : statusState === "WRONG" ? (
                  <XCircle className="h-10 w-10 text-red-600" />
                ) : (
                  <Play className="h-10 w-10 text-blue-500" />
                )}

                <div>
                  <h2 className="text-xl font-bold">
                    {statusState === "COMPLETED"
                      ? "Puzzle Solved!"
                      : statusState === "WRONG"
                      ? "Incorrect Move"
                      : `${game.turn() === "w" ? "White" : "Black"} to Move`}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {stars.length > 0
                      ? `${stars.length} star${stars.length > 1 ? "s" : ""} remaining`
                      : statusState === "COMPLETED"
                      ? "Great job! All done."
                      : "Find the best move."}
                  </p>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            {statusState !== "COMPLETED" ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={resetPuzzle}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-white border-2 border-slate-200 hover:bg-slate-50"
                >
                  <RotateCcw className="h-5 w-5" /> Reset
                </button>

                <button
                  onClick={handleHint}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-blue-50 border-2 border-blue-100 hover:bg-blue-100"
                >
                  <Lightbulb className="h-5 w-5" /> Hint
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl font-bold text-lg shadow-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 transition"
              >
                {nextPuzzleId ? "Next Puzzle" : "Back to Library"} <ArrowRight className="h-5 w-5" />
              </button>
            )}

            {puzzle.description && (
              <div className="mt-4 p-4 bg-slate-100 rounded-xl text-slate-600 text-sm">
                <span className="font-bold block mb-1">Description:</span>
                {puzzle.description}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}