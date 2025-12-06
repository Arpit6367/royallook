'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { 
  Users, Search, ChevronRight, Folder, FileText, 
  CheckCircle, XCircle, Clock, RotateCcw, Plus, MousePointer2, Loader2, AlertCircle, ArrowUpDown, Settings, Trash2,
  Trophy, Target, Activity, BookOpen, ChevronLeft, PlayCircle
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
  const [activeTab, setActiveTab] = useState<'students' | 'courses' | 'analysis'>('students')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/api/auth/signin')
    if (session && (session.user as any).role !== 'COACH') router.push('/')
  }, [status, session, router])

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-orange-600 w-10 h-10"/></div>

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-30">
      <header className="bg-white border-b px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Coach Dashboard
          </h1>
          <p className="text-slate-500 text-sm">Welcome back, {session?.user?.name}</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg shadow-inner">
          {[
            { id: 'students', label: 'My Students', icon: Users },
            { id: 'courses', label: 'Curriculum', icon: BookOpen },
            { id: 'analysis', label: 'Analysis Board', icon: MousePointer2 },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm transition-all ${
                activeTab === tab.id 
                ? 'bg-white shadow text-orange-600' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'students' && <MyStudentsView coachId={(session?.user as any)?.id} />}
        {activeTab === 'courses' && <CoursesView />}
        {activeTab === 'analysis' && <AnalysisView />}
      </main>
    </div>
  )
}

// ==========================================
// 1. COURSES VIEW (NEW FEATURE)
// ==========================================
function CoursesView() {
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [activeChapter, setActiveChapter] = useState<any>(null)
  const game = useRef(new Chess())
  const [boardFen, setBoardFen] = useState('start')

  useEffect(() => {
    fetch('/api/courses').then(r => r.json()).then(setCourses).catch(console.error)
  }, [])

  // Load Chapter Content
  useEffect(() => {
    if (activeChapter) {
      try {
        game.current.load(activeChapter.fen)
        setBoardFen(activeChapter.fen)
      } catch (e) {
        game.current.reset()
        setBoardFen('start')
      }
    }
  }, [activeChapter])

  const onDrop = (source: string, target: string) => {
    try {
      const move = game.current.move({ from: source, to: target, promotion: 'q' })
      if (!move) return false
      setBoardFen(game.current.fen())
      return true
    } catch { return false }
  }

  // --- LIST VIEW ---
  if (!selectedCourse) {
    return (
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <BookOpen className="text-orange-600"/> Available Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => (
            <div key={c.id} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                 <span className={`px-2 py-1 rounded text-xs font-bold ${c.level === 'BEGINNER' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                   {c.level}
                 </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{c.title}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-3">{c.description || "No description."}</p>
              
              <div className="mt-auto pt-4 border-t flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">{c.chapters.length} Lessons</span>
                <button 
                  onClick={() => { setSelectedCourse(c); if(c.chapters.length > 0) setActiveChapter(c.chapters[0]) }}
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 group-hover:bg-orange-600 transition-colors"
                >
                  Start Teaching <ChevronRight size={16}/>
                </button>
              </div>
            </div>
          ))}
          {courses.length === 0 && <div className="col-span-3 text-center py-10 text-slate-400">No courses found. Ask Admin to create some.</div>}
        </div>
      </div>
    )
  }

  // --- TEACHING MODE ---
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl shadow-lg border overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 text-white p-4 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-4">
           <button onClick={() => { setSelectedCourse(null); setActiveChapter(null) }} className="hover:bg-slate-700 p-2 rounded-lg transition">
             <ChevronLeft />
           </button>
           <div>
             <h2 className="font-bold text-lg">{selectedCourse.title}</h2>
             <p className="text-xs text-slate-400">Teaching Mode</p>
           </div>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-sm font-medium opacity-80 mr-2">
              Lesson: {selectedCourse.chapters.findIndex((c:any) => c.id === activeChapter?.id) + 1} / {selectedCourse.chapters.length}
            </span>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Chapters */}
        <div className="w-64 bg-slate-50 border-r overflow-y-auto hidden md:block">
           <div className="p-4 font-bold text-xs text-slate-400 uppercase tracking-wider">Lessons</div>
           {selectedCourse.chapters.map((chap: any, idx: number) => (
             <button 
               key={chap.id}
               onClick={() => setActiveChapter(chap)}
               className={`w-full text-left p-4 border-b text-sm font-medium transition-colors flex items-center gap-3 ${activeChapter?.id === chap.id ? 'bg-orange-50 text-orange-700 border-l-4 border-l-orange-500' : 'hover:bg-slate-100 text-slate-600'}`}
             >
               <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${activeChapter?.id === chap.id ? 'bg-orange-200' : 'bg-slate-200'}`}>
                 {idx + 1}
               </div>
               <span className="truncate">{chap.title}</span>
             </button>
           ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
           {/* Left: Interactive Board */}
           <div className="flex-1 bg-slate-200 flex flex-col items-center justify-center p-4 relative">
              <div className="w-full max-w-[550px] aspect-square shadow-2xl rounded-sm overflow-hidden border-4 border-white">
                 <Chessboard 
                    position={boardFen} 
                    onPieceDrop={onDrop}
                    arePiecesDraggable={true}
                    animationDuration={200}
                 />
              </div>
              <div className="mt-4 flex gap-4">
                 <button 
                   onClick={() => { game.current.load(activeChapter.fen); setBoardFen(activeChapter.fen) }}
                   className="bg-white px-4 py-2 rounded shadow text-sm font-bold flex items-center gap-2 hover:bg-orange-50 text-slate-700"
                 >
                   <RotateCcw size={16}/> Reset Position
                 </button>
              </div>
           </div>

           {/* Right: Script/Notes */}
           <div className="w-[400px] bg-white border-l flex flex-col overflow-hidden">
              <div className="p-6 border-b bg-slate-50">
                 <h3 className="text-xl font-bold text-slate-800 mb-1">{activeChapter?.title}</h3>
                 <span className="text-xs font-bold text-slate-400 uppercase">Instructor Notes</span>
              </div>
              <div className="p-6 overflow-y-auto flex-1 prose prose-slate">
                 <p className="whitespace-pre-wrap text-slate-600 leading-relaxed">
                   {activeChapter?.content || "No notes provided for this lesson."}
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 2. MY STUDENTS VIEW (Same as before)
// ==========================================
function MyStudentsView({ coachId }: { coachId: string }) {
  const [students, setStudents] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [stats, setStats] = useState<any[]>([])
  const [loadingStats, setLoadingStats] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  const totalSolved = stats.filter(s => s.isSolved).length
  const successRate = stats.length > 0 ? Math.round((totalSolved / stats.length) * 100) : 0

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        const myStudents = data.filter((u: any) => u.role === 'STUDENT' && u.coachId === coachId)
        setStudents(myStudents)
      }
    }).catch(console.error)
  }, [coachId])

  useEffect(() => {
    if (!selectedStudent) return
    setLoadingStats(true)
    fetch(`/api/progress?studentId=${selectedStudent.id}`)
      .then(r => r.json())
      .then(data => setStats(Array.isArray(data) ? data : []))
      .catch(() => setStats([]))
      .finally(() => setLoadingStats(false))
  }, [selectedStudent])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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

      <div className="lg:col-span-8">
        {selectedStudent ? (
          <div className="bg-white rounded-xl shadow-sm border p-6 min-h-[500px]">
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

            <div className="grid grid-cols-3 gap-4 mb-8">
               <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center">
                  <span className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Solved</span>
                  <div className="text-3xl font-bold text-green-800 flex items-center gap-2"><Trophy size={24}/> {totalSolved}</div>
               </div>
               <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Success</span>
                  <div className="text-3xl font-bold text-blue-800 flex items-center gap-2"><Target size={24}/> {successRate}%</div>
               </div>
               <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex flex-col items-center">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Activity</span>
                  <div className="text-3xl font-bold text-purple-800 flex items-center gap-2"><Activity size={24}/> {stats.length}</div>
               </div>
            </div>

            <h3 className="font-bold text-lg mb-4 border-b pb-2">Recent Activity</h3>
            {loadingStats ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-500"/></div>
            ) : (
              <div className="space-y-4">
                 {Array.isArray(stats) && stats.length === 0 && <p className="text-slate-400 italic text-center py-8">No puzzle activity recorded yet.</p>}
                 {Array.isArray(stats) && stats.map((stat) => (
                   <div key={stat.id} className="border rounded-xl p-4 bg-slate-50 hover:shadow-md transition">
                      <div className="flex justify-between mb-2">
                         <span className="font-bold text-lg text-slate-800">{stat.puzzle?.title || "Unknown Puzzle"}</span>
                         {stat.isSolved ? 
                           <span className="flex items-center gap-1 text-green-700 font-bold bg-green-100 px-2 py-1 rounded text-xs"><CheckCircle size={14}/> Solved</span> : 
                           <span className="flex items-center gap-1 text-red-700 font-bold bg-red-100 px-2 py-1 rounded text-xs"><XCircle size={14}/> Unsolved</span>
                         }
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                         <div className="flex items-center gap-1"><RotateCcw size={14}/> {stat.attempts} Attempts</div>
                         <div className="flex items-center gap-1"><Clock size={14}/> {new Date(stat.lastPlayed).toLocaleDateString()}</div>
                      </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-full bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
            <Users className="w-16 h-16 mb-4 opacity-20"/>
            <p>Select a student to view analytics.</p>
          </div>
        )}
      </div>

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
// 3. HOMEWORK BROWSER (Puzzles)
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
// 4. ANALYSIS VIEW
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
        const newSquares = { ...prev }; delete newSquares[square]; return newSquares
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
       if (selectedTool === 'TRASH') game.current.remove(square as any)
       else game.current.put({ type: selectedTool.type as any, color: selectedTool.color }, square as any)
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
            s[square] = { background: 'radial-gradient(circle, gold 20%, transparent 30%)', backgroundColor: 'rgba(0, 0, 0, 0)' } 
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
            boardOrientation={orientation}
            arePiecesDraggable={true}
          />
          {setupMode && <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded animate-pulse">SETUP MODE</div>}
        </div>
      </div>
      
      <div className="lg:col-span-4 bg-white p-6 rounded-xl h-fit border shadow-sm space-y-6">
        <div>
          <h3 className="font-bold mb-4 flex items-center gap-2"><MousePointer2 className="text-orange-500"/> Analysis Tools</h3>
          <div className="flex gap-2 mb-4">
             <button onClick={() => { game.current.reset(); updateBoard(); setSquares({}) }} className="flex-1 py-2 border rounded hover:bg-gray-50 flex items-center justify-center gap-2 font-medium"><RotateCcw size={16}/> Reset</button>
             <button onClick={() => setOrientation(o => o === 'white' ? 'black' : 'white')} className="flex-1 py-2 border rounded hover:bg-gray-50 flex items-center justify-center gap-2 font-medium"><ArrowUpDown size={16}/> Flip</button>
          </div>
          <button onClick={() => { setSetupMode(!setupMode); setSelectedTool(null) }} className={`w-full py-3 rounded font-bold flex items-center justify-center gap-2 ${setupMode ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'}`}>
             <Settings size={16}/> {setupMode ? 'Exit Setup Mode' : 'Edit Board Position'}
          </button>
        </div>
        {setupMode && (
          <div className="border-t pt-4">
             <div className="flex flex-wrap gap-2 mb-2">
                {['p','n','b','r','q','k'].map(p => (
                   <button key={'w'+p} onClick={() => setSelectedTool({type: p, color: 'w'})} className={`w-8 h-8 border rounded flex items-center justify-center font-serif font-bold ${selectedTool !== 'TRASH' && selectedTool?.type === p && selectedTool.color === 'w' ? 'bg-blue-100 border-blue-500' : ''}`}>{p.toUpperCase()}</button>
                ))}
             </div>
             <div className="flex flex-wrap gap-2 mb-4">
                {['p','n','b','r','q','k'].map(p => (
                   <button key={'b'+p} onClick={() => setSelectedTool({type: p, color: 'b'})} className={`w-8 h-8 border rounded flex items-center justify-center font-serif font-bold bg-slate-800 text-white ${selectedTool !== 'TRASH' && selectedTool?.type === p && selectedTool.color === 'b' ? 'ring-2 ring-blue-500' : ''}`}>{p.toUpperCase()}</button>
                ))}
             </div>
             <div className="flex gap-2">
                <button onClick={() => setSelectedTool('TRASH')} className={`flex-1 py-2 border border-red-200 text-red-600 rounded flex items-center justify-center gap-2 ${selectedTool === 'TRASH' ? 'bg-red-50 ring-1 ring-red-500' : ''}`}><Trash2 size={16}/> Remove</button>
                <button onClick={() => { game.current.clear(); updateBoard() }} className="flex-1 py-2 border rounded hover:bg-gray-50">Clear</button>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}