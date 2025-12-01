'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { 
  Users, Search, ChevronRight, Folder, FileText, 
  CheckCircle, XCircle, Clock, RotateCcw, Plus, MousePointer2, Loader2, AlertCircle, ArrowUpDown, Settings, Trash2,
  Trophy, Target, Activity
} from 'lucide-react'

// --- HELPER: MODAL ---
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black font-bold text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// --- HELPER TYPES ---
type Tool = { type: string, color: 'w' | 'b' } | 'TRASH' | null

export default function CoachDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'students' | 'analysis'>('students')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/api/auth/signin')
    if (session && (session.user as any).role !== 'COACH') router.push('/')
  }, [status, session, router])

  if (status === 'loading') return <div className="p-10 flex justify-center"><Loader2 className="animate-spin"/></div>

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-30">
      <header className="bg-white border-b px-8 py-5 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Coach Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome, {session?.user?.name}</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-md font-medium transition ${activeTab === 'students' ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            My Students
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 rounded-md font-medium transition ${activeTab === 'analysis' ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Analysis Board
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'students' ? <MyStudentsView coachId={(session?.user as any)?.id} /> : <AnalysisView />}
      </main>
    </div>
  )
}

// ==========================================
// 1. MY STUDENTS VIEW (ENHANCED STATS)
// ==========================================
function MyStudentsView({ coachId }: { coachId: string }) {
  const [students, setStudents] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  
  // Stats State
  const [stats, setStats] = useState<any[]>([])
  const [loadingStats, setLoadingStats] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  // Derived Summary Stats
  const totalSolved = stats.filter(s => s.isSolved).length
  const totalAttempts = stats.reduce((acc, curr) => acc + curr.attempts, 0)
  const successRate = stats.length > 0 ? Math.round((totalSolved / stats.length) * 100) : 0

  // 1. Fetch Students
  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        const myStudents = data.filter((u: any) => u.role === 'STUDENT' && u.coachId === coachId)
        setStudents(myStudents)
      }
    }).catch(console.error)
  }, [coachId])

  // 2. Fetch Performance
  useEffect(() => {
    if (!selectedStudent) return
    
    setLoadingStats(true)
    fetch(`/api/progress?studentId=${selectedStudent.id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to fetch")
        return r.json()
      })
      .then(data => {
        if (Array.isArray(data)) setStats(data)
        else setStats([])
      })
      .catch(() => setStats([]))
      .finally(() => setLoadingStats(false))
  }, [selectedStudent])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT: LIST */}
      <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border p-4 h-fit">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Users className="text-orange-500" /> Class Roster ({students.length})
        </h2>
        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
          {students.map(s => (
            <div 
              key={s.id}
              onClick={() => setSelectedStudent(s)}
              className={`p-4 rounded-lg border cursor-pointer transition hover:bg-orange-50 ${selectedStudent?.id === s.id ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'bg-white border-slate-200'}`}
            >
              <div className="font-bold text-slate-800">{s.name}</div>
              <div className="text-xs text-slate-500 flex justify-between mt-1">
                <span>{s.email}</span>
                <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-700">{s.stage}</span>
              </div>
            </div>
          ))}
          {students.length === 0 && <div className="text-gray-400 text-sm text-center py-4">No students assigned yet.</div>}
        </div>
      </div>

      {/* RIGHT: DETAILS */}
      <div className="lg:col-span-8">
        {selectedStudent ? (
          <div className="bg-white rounded-xl shadow-sm border p-6 min-h-[500px]">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">{selectedStudent.name}</h2>
                <p className="text-slate-500 text-sm">{selectedStudent.email} • {selectedStudent.stage}</p>
              </div>
              <button 
                onClick={() => setIsAssignModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition"
              >
                <Plus className="w-5 h-5"/> Assign Homework
              </button>
            </div>

            {/* --- NEW: SUMMARY STATS --- */}
            <div className="grid grid-cols-3 gap-4 mb-8">
               <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center">
                  <span className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Solved Puzzles</span>
                  <div className="text-3xl font-bold text-green-800 flex items-center gap-2">
                     <Trophy size={24}/> {totalSolved}
                  </div>
               </div>
               <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Success Rate</span>
                  <div className="text-3xl font-bold text-blue-800 flex items-center gap-2">
                     <Target size={24}/> {successRate}%
                  </div>
               </div>
               <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex flex-col items-center">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Activity</span>
                  <div className="text-3xl font-bold text-purple-800 flex items-center gap-2">
                     <Activity size={24}/> {stats.length}
                  </div>
               </div>
            </div>

            <h3 className="font-bold text-lg mb-4 border-b pb-2">Recent Activity Log</h3>
            
            {loadingStats ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-500"/></div>
            ) : (
              <div className="space-y-4">
                 {Array.isArray(stats) && stats.length === 0 && <p className="text-slate-400 italic text-center py-8">No puzzle activity recorded yet.</p>}

                 {Array.isArray(stats) && stats.map((stat) => (
                   <div key={stat.id} className="border rounded-xl p-4 bg-slate-50 hover:shadow-md transition">
                      <div className="flex justify-between mb-2">
                         <span className="font-bold text-lg text-slate-800">{stat.puzzle?.title || "Unknown Puzzle"}</span>
                         {stat.isSolved ? (
                           <span className="flex items-center gap-1 text-green-700 font-bold bg-green-100 px-2 py-1 rounded text-xs">
                             <CheckCircle size={14}/> Solved
                           </span>
                         ) : (
                           <span className="flex items-center gap-1 text-red-700 font-bold bg-red-100 px-2 py-1 rounded text-xs">
                             <XCircle size={14}/> Unsolved
                           </span>
                         )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                         <div className="flex items-center gap-1"><RotateCcw size={14}/> {stat.attempts} Attempts</div>
                         <div className="flex items-center gap-1"><Clock size={14}/> Last played: {new Date(stat.lastPlayed).toLocaleDateString()}</div>
                      </div>

                      {/* Mistakes Section */}
                      {stat.mistakes && Array.isArray(stat.mistakes) && stat.mistakes.length > 0 && (
                        <div className="bg-white border border-red-200 p-3 rounded-lg">
                           <span className="text-xs font-bold text-red-500 uppercase tracking-wide flex items-center gap-1">
                             <AlertCircle size={12}/> Mistakes Made (Wrong Moves)
                           </span>
                           <div className="mt-2 flex flex-wrap gap-2">
                              {stat.mistakes.map((move: string, idx: number) => (
                                <span key={idx} className="font-mono text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">
                                  {move}
                                </span>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                 ))}
              </div>
            )}

          </div>
        ) : (
          <div className="h-full bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
            <Users className="w-16 h-16 mb-4 opacity-20"/>
            <p>Select a student from the list to view analytics.</p>
          </div>
        )}
      </div>

      {/* ASSIGNMENT MODAL */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title={`Assign to ${selectedStudent?.name}`}>
        <HomeworkBrowser 
          onAssign={async (puzzleId) => {
             await fetch('/api/assignments', {
                method: 'POST',
                body: JSON.stringify({ studentId: selectedStudent.id, puzzleId })
             })
             alert("Homework Assigned!")
             setIsAssignModalOpen(false)
          }}
        />
      </Modal>

    </div>
  )
}

// ==========================================
// 2. HOMEWORK BROWSER (Unchanged)
// ==========================================
function HomeworkBrowser({ onAssign }: { onAssign: (id: string) => void }) {
  const [currentStage, setCurrentStage] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([])
  const [content, setContent] = useState<{folders: any[], puzzles: any[]}>({ folders: [], puzzles: [] })

  useEffect(() => {
    if(!currentStage) return
    const parent = breadcrumbs[breadcrumbs.length - 1]
    const url = parent 
      ? `/api/content?parentId=${parent.id}` 
      : `/api/content?stage=${currentStage}`
    fetch(url).then(r => r.json()).then(setContent)
  }, [currentStage, breadcrumbs])

  if (!currentStage) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(stage => (
          <button key={stage} onClick={() => setCurrentStage(stage)} className="h-24 border rounded-lg bg-slate-50 hover:border-orange-500 font-bold text-slate-600 shadow-sm">{stage}</button>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-sm border-b pb-2 overflow-x-auto">
        <button onClick={() => { setCurrentStage(null); setBreadcrumbs([]) }} className="font-bold text-gray-500">Levels</button>
        <ChevronRight size={14}/>
        <span className="font-bold text-orange-600">{currentStage}</span>
        {breadcrumbs.map((b, i) => (
          <div key={b.id} className="flex items-center gap-2">
            <ChevronRight size={14}/>
            <button onClick={() => setBreadcrumbs(breadcrumbs.slice(0, i+1))} className="hover:underline whitespace-nowrap">{b.name}</button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
        {content.folders.length === 0 && content.puzzles.length === 0 && <p className="col-span-3 text-center text-gray-400 py-8">Empty Folder</p>}
        
        {content.folders.map(f => (
          <div key={f.id} onClick={() => setBreadcrumbs([...breadcrumbs, f])} className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100">
            <Folder className="text-blue-500 mb-2"/>
            <span className="text-xs font-bold text-center">{f.name}</span>
          </div>
        ))}

        {content.puzzles.map(p => (
          <div key={p.id} className="p-4 bg-white border rounded-lg flex flex-col items-center justify-center relative group hover:border-orange-500">
            <FileText className="text-orange-500 mb-2"/>
            <span className="text-xs font-medium text-center truncate w-full">{p.title}</span>
            <button 
              onClick={() => onAssign(p.id)}
              className="absolute inset-0 bg-orange-600/90 text-white font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition"
            >
              Assign
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// 3. ANALYSIS VIEW (Same as before)
// ==========================================
function AnalysisView() {
  const game = useRef(new Chess())
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  const [squares, setSquares] = useState<Record<string, any>>({})
  const [orientation, setOrientation] = useState<'white'|'black'>('white')
  const [setupMode, setSetupMode] = useState(false)
  const [selectedTool, setSelectedTool] = useState<Tool>(null)

  const updateBoard = () => setFen(game.current.fen())

  const clearHighlight = (square: string) => {
    setSquares((prev) => {
      if (prev[square]) {
        const newSquares = { ...prev }
        delete newSquares[square]
        return newSquares
      }
      return prev
    })
  }

  const onDrop = (source: string, target: string) => {
    if (setupMode) {
      const piece = game.current.get(source as any)
      if(!piece) return false
      game.current.remove(source as any)
      game.current.put(piece, target as any)
      updateBoard()
      clearHighlight(target)
      return true
    }
    try {
      const move = game.current.move({ from: source, to: target, promotion: 'q' })
      if (!move) return false
      setFen(game.current.fen())
      clearHighlight(target)
      return true
    } catch { return false }
  }

  const onSquareClick = (square: string) => {
    if (setupMode && selectedTool) {
       if (selectedTool === 'TRASH') {
         game.current.remove(square as any)
       } else {
         game.current.put({ type: selectedTool.type as any, color: selectedTool.color }, square as any)
       }
       updateBoard()
       clearHighlight(square)
    }
  }

  const onSquareRightClick = (square: string) => {
    if (!setupMode) {
       setSquares(prev => {
        const s = { ...prev }
        if (!s[square]) s[square] = { backgroundColor: 'rgba(0, 255, 0, 0.4)' } 
        else if (s[square].backgroundColor === 'rgba(0, 255, 0, 0.4)') {
            s[square] = { 
                background: 'radial-gradient(circle, gold 20%, transparent 30%)',
                backgroundColor: 'rgba(0, 0, 0, 0)' 
            } 
        } 
        else delete s[square]
        return s
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 flex justify-center">
        <div className="w-[600px] h-[600px] border-4 border-slate-700 rounded shadow-2xl relative">
          <Chessboard 
            position={fen} 
            onPieceDrop={onDrop} 
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick} 
            customSquareStyles={squares}
            areArrowsAllowed={true}
            boardOrientation={orientation}
            arePiecesDraggable={true}
          />
          {setupMode && <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded animate-pulse">SETUP MODE</div>}
        </div>
      </div>
      
      <div className="lg:col-span-4 bg-white p-6 rounded-xl h-fit border shadow-sm space-y-6">
        <div>
          <h3 className="font-bold mb-4 flex items-center gap-2"><MousePointer2 className="text-orange-500"/> Analysis Tools</h3>
          
          <div className="mb-4">
             <label className="text-xs font-bold text-gray-400">FEN Position</label>
             <input className="w-full border p-2 rounded text-xs font-mono" value={fen} onChange={(e) => {
                try { game.current.load(e.target.value); updateBoard(); } catch {}
             }} />
          </div>

          <div className="flex gap-2 mb-4">
             <button onClick={() => { game.current.reset(); updateBoard(); setSquares({}) }} className="flex-1 py-2 border rounded hover:bg-gray-50 flex items-center justify-center gap-2 font-medium">
               <RotateCcw size={16}/> Reset
             </button>
             <button onClick={() => setOrientation(o => o === 'white' ? 'black' : 'white')} className="flex-1 py-2 border rounded hover:bg-gray-50 flex items-center justify-center gap-2 font-medium">
               <ArrowUpDown size={16}/> Flip
             </button>
          </div>
          
          <button 
             onClick={() => { setSetupMode(!setupMode); setSelectedTool(null) }} 
             className={`w-full py-3 rounded font-bold flex items-center justify-center gap-2 ${setupMode ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'}`}
          >
             <Settings size={16}/> {setupMode ? 'Exit Setup Mode' : 'Edit Board Position'}
          </button>
        </div>

        {setupMode && (
          <div className="border-t pt-4">
             <p className="text-sm text-gray-500 mb-2">Select a piece to place on the board:</p>
             <div className="flex flex-wrap gap-2 mb-2">
                {['p','n','b','r','q','k'].map(p => (
                   <button key={'w'+p} onClick={() => setSelectedTool({type: p, color: 'w'})} className={`w-8 h-8 border rounded flex items-center justify-center font-serif font-bold ${selectedTool !== 'TRASH' && selectedTool?.type === p && selectedTool.color === 'w' ? 'bg-blue-100 border-blue-500' : ''}`}>
                      <span className="text-black">{p.toUpperCase()}</span>
                   </button>
                ))}
             </div>
             <div className="flex flex-wrap gap-2 mb-4">
                {['p','n','b','r','q','k'].map(p => (
                   <button key={'b'+p} onClick={() => setSelectedTool({type: p, color: 'b'})} className={`w-8 h-8 border rounded flex items-center justify-center font-serif font-bold bg-slate-800 text-white ${selectedTool !== 'TRASH' && selectedTool?.type === p && selectedTool.color === 'b' ? 'ring-2 ring-blue-500' : ''}`}>
                      {p.toUpperCase()}
                   </button>
                ))}
             </div>
             <div className="flex gap-2">
                <button onClick={() => setSelectedTool('TRASH')} className={`flex-1 py-2 border border-red-200 text-red-600 rounded flex items-center justify-center gap-2 ${selectedTool === 'TRASH' ? 'bg-red-50 ring-1 ring-red-500' : ''}`}>
                   <Trash2 size={16}/> Remove
                </button>
                <button onClick={() => { game.current.clear(); updateBoard() }} className="flex-1 py-2 border rounded hover:bg-gray-50">Clear</button>
             </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded text-sm text-blue-800">
           <p className="font-bold">Controls:</p>
           <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>Drag pieces to make moves.</li>
              <li>Right-click squares to <b>Highlight</b>.</li>
              <li>Right-click & Drag to draw <b>Arrows</b>.</li>
              <li>Use <b>Edit Board Position</b> to set up any scenario.</li>
           </ul>
        </div>
      </div>
    </div>
  )
}