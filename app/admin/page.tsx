'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { 
  Users, Folder, FileText, ChevronRight, Save, RotateCcw, 
  MousePointer2, Trash2, Plus, Edit, ArrowLeft, Check, 
  Play, Copy, Settings, ArrowUpDown
} from 'lucide-react'

// --- TYPES & HELPERS ---
type Tool = { type: string, color: 'w' | 'b' } | 'TRASH' | null
const PIECES = ['p', 'n', 'b', 'r', 'q', 'k'] as const

// --- MODAL COMPONENT ---
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'curriculum' | 'analysis'>('users')

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans pt-30">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-orange-600">Chess Admin</h1>
        <div className="flex gap-2">
          {['users', 'curriculum', 'analysis'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded capitalize font-medium ${activeTab === tab ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>
      <main className="p-6 max-w-7xl mx-auto">
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'curriculum' && <CurriculumManager />}
        {activeTab === 'analysis' && <AnalysisBoard />}
      </main>
    </div>
  )
}

// ==========================================
// 1. USER MANAGEMENT TAB
// ==========================================
function UserManager() {
  const [users, setUsers] = useState<any[]>([])
  const [coaches, setCoaches] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<any>({ name: '', email: '', password: '', role: 'STUDENT', stage: 'BEGINNER', coachId: '' })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if(res.ok) {
        const data = await res.json()
        setUsers(data)
        setCoaches(data.filter((u: any) => u.role === 'COACH' || u.role === 'ADMIN'))
      }
    } catch(e) { console.error(e) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const method = editingId ? 'PUT' : 'POST'
    const body = editingId ? { ...formData, id: editingId } : formData
    
    try {
      const res = await fetch('/api/admin/users', { 
        method, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body) 
      })

      const data = await res.json()

      if (!res.ok) {
        // Show the error message from backend
        alert(data.error || "Operation failed")
        return 
      }
      
      // Only close and refresh if successful
      setIsModalOpen(false)
      setEditingId(null)
      setFormData({ name: '', email: '', password: '', role: 'STUDENT', stage: 'BEGINNER', coachId: '' })
      fetchUsers()
      alert("User saved successfully!")

    } catch (error) {
      console.error(error)
      alert("Network error occurred.")
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Delete user?")) return
    await fetch('/api/admin/users', { method: 'DELETE', body: JSON.stringify({ id }) })
    fetchUsers()
  }

  const openEdit = (user: any) => {
    setFormData({ 
      name: user.name, email: user.email, role: user.role, 
      stage: user.stage, coachId: user.coachId || '', password: '' 
    })
    setEditingId(user.id)
    setIsModalOpen(true)
  }

  return (
    <div className="bg-white rounded shadow p-6 py-30">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Manage Users</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"><Plus size={16}/> Add User</button>
      </div>
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Role</th>
            <th className="p-3">Stage</th>
            <th className="p-3">Assigned Coach</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <div className="font-bold">{u.name}</div>
                <div className="text-xs text-gray-500">{u.email}</div>
              </td>
              <td className="p-3"><span className="px-2 py-1 rounded bg-gray-200 text-xs font-bold">{u.role}</span></td>
              <td className="p-3">{u.role === 'STUDENT' ? u.stage : '-'}</td>
              <td className="p-3 text-blue-600">{u.coach?.name || '-'}</td>
              <td className="p-3 text-right space-x-2">
                <button onClick={() => openEdit(u)} className="text-blue-500 hover:text-blue-700"><Edit size={16}/></button>
                <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD/EDIT MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit User" : "Add User"}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input className="w-full border p-2 rounded" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input className="w-full border p-2 rounded" type="password" placeholder={editingId ? "New Password (Optional)" : "Password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <select className="w-full border p-2 rounded" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="STUDENT">Student</option>
            <option value="COACH">Coach</option>
            <option value="ADMIN">Admin</option>
          </select>
          {formData.role === 'STUDENT' && (
            <>
              <select className="w-full border p-2 rounded" value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})}>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
              <select className="w-full border p-2 rounded" value={formData.coachId} onChange={e => setFormData({...formData, coachId: e.target.value})}>
                <option value="">-- No Coach --</option>
                {coaches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </>
          )}
          <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded font-bold">Save</button>
        </form>
      </Modal>
    </div>
  )
}

// ==========================================
// 2. CURRICULUM TAB (Folders & Puzzle Creator)
// ==========================================
function CurriculumManager() {
  const [currentStage, setCurrentStage] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([])
  const [content, setContent] = useState<{folders: any[], puzzles: any[]}>({ folders: [], puzzles: [] })
  
  // Creation State
  const [view, setView] = useState<'BROWSE' | 'CREATE_PUZZLE'>('BROWSE')
  const [newFolderName, setNewFolderName] = useState('')

  useEffect(() => {
    if (!currentStage) return
    const parent = breadcrumbs[breadcrumbs.length - 1]
    const url = parent 
      ? `/api/content?parentId=${parent.id}` 
      : `/api/content?stage=${currentStage}`
    
    fetch(url).then(r => r.json()).then(setContent)
  }, [currentStage, breadcrumbs, view]) 

  const createFolder = async () => {
    if(!newFolderName) return
    const parent = breadcrumbs[breadcrumbs.length - 1]
    await fetch('/api/content', {
      method: 'POST',
      body: JSON.stringify({
        type: 'FOLDER',
        name: newFolderName,
        stage: breadcrumbs.length === 0 ? currentStage : null,
        parentId: parent?.id
      })
    })
    setNewFolderName('')
    const parentId = parent ? `parentId=${parent.id}` : `stage=${currentStage}`
    fetch(`/api/content?${parentId}`).then(r => r.json()).then(setContent)
  }

  if (view === 'CREATE_PUZZLE') {
    const parent = breadcrumbs[breadcrumbs.length - 1]
    return <PuzzleCreator folderId={parent.id} onBack={() => setView('BROWSE')} />
  }

  if (!currentStage) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(stage => (
          <button key={stage} onClick={() => setCurrentStage(stage)} className="h-40 bg-white border-2 hover:border-orange-500 rounded-xl text-xl font-bold text-gray-700 shadow">{stage}</button>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded shadow p-6 min-h-[600px]">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b">
        <button onClick={() => { setCurrentStage(null); setBreadcrumbs([]) }} className="font-bold text-gray-500">Stages</button>
        <ChevronRight size={16}/>
        <span className="font-bold text-orange-600">{currentStage}</span>
        {breadcrumbs.map((b, i) => (
          <div key={b.id} className="flex items-center gap-2">
            <ChevronRight size={16}/>
            <button onClick={() => setBreadcrumbs(breadcrumbs.slice(0, i+1))} className="hover:underline">{b.name}</button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {content.folders.map(f => (
          <div key={f.id} onClick={() => setBreadcrumbs([...breadcrumbs, f])} className="h-32 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:shadow-md">
            <Folder className="w-10 h-10 text-blue-500 mb-2"/>
            <span className="font-bold text-sm">{f.name}</span>
          </div>
        ))}
        {content.puzzles.map(p => (
          <div key={p.id} className="h-32 bg-white border rounded-xl flex flex-col items-center justify-center relative">
            <FileText className="w-10 h-10 text-orange-500 mb-2"/>
            <span className="font-medium text-xs px-2 text-center">{p.title}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t flex gap-4">
        <div className="flex gap-2">
          <input className="border p-2 rounded" placeholder="New Folder Name" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} />
          <button onClick={createFolder} className="bg-blue-600 text-white px-4 py-2 rounded">Create Folder</button>
        </div>
        {breadcrumbs.length > 0 && (
          <button onClick={() => setView('CREATE_PUZZLE')} className="bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <Plus size={16}/> Add Puzzle Here
          </button>
        )}
      </div>
    </div>
  )
}

// ==========================================
// 3. PUZZLE CREATOR (ADVANCED)
// ==========================================
function PuzzleCreator({ folderId, onBack }: { folderId: string, onBack: () => void }) {
  const game = useRef(new Chess())
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  const [moves, setMoves] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [mode, setMode] = useState<'SETUP'|'RECORD'>('SETUP')
  const [selectedTool, setSelectedTool] = useState<Tool>(null)
  const [startFen, setStartFen] = useState<string | null>(null)

  // -- LOGIC --

  const updateBoard = () => {
    setFen(game.current.fen())
  }

  const toggleMode = () => {
    if (mode === 'SETUP') {
      // Validate Board
      const f = game.current.fen()
      if (!f.includes('w') || !f.includes('b')) return alert("Invalid board. Needs Kings.")
      setStartFen(f)
      setMoves([])
      setMode('RECORD')
      setSelectedTool(null)
    } else {
      setMode('SETUP')
      setStartFen(null)
    }
  }

  const onSquareClick = (square: string) => {
    if (mode !== 'SETUP' || !selectedTool) return

    if (selectedTool === 'TRASH') {
      game.current.remove(square as any)
      updateBoard()
      return
    }

    const { type, color } = selectedTool
    // Remove existing king if placing a new one
    if (type === 'k') {
      const board = game.current.board()
      board.forEach((row, r) => row.forEach((p, c) => {
        if(p?.type === 'k' && p.color === color) {
          game.current.remove(String.fromCharCode(97+c) + (8-r) as any)
        }
      }))
    }
    
    game.current.put({ type: type as any, color }, square as any)
    updateBoard()
  }

  const onDrop = (source: string, target: string) => {
    // In SETUP mode, allow moving existing pieces freely
    if (mode === 'SETUP') {
      const piece = game.current.get(source as any)
      if(!piece) return false
      game.current.remove(source as any)
      game.current.put(piece, target as any)
      updateBoard()
      return true
    }
    // In RECORD mode, valid moves only
    if (mode === 'RECORD') {
      try {
        const move = game.current.move({ from: source, to: target, promotion: 'q' })
        if (!move) return false
        setMoves([...moves, move.san])
        updateBoard()
        return true
      } catch { return false }
    }
    return false
  }

  const savePuzzle = async () => {
    if(!title || !startFen || moves.length === 0) return alert("Complete the puzzle first")
    
    await fetch('/api/content', {
      method: 'POST',
      body: JSON.stringify({
        type: 'PUZZLE',
        title,
        fen: startFen,
        solution: moves.join(' '),
        folderId
      })
    })
    alert("Puzzle Saved!")
    onBack()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5">
        <div className={`border-4 rounded-xl shadow-lg overflow-hidden ${mode === 'RECORD' ? 'border-green-500' : 'border-blue-500'}`}>
          <Chessboard 
            position={fen} 
            onPieceDrop={onDrop} 
            onSquareClick={onSquareClick}
            arePiecesDraggable={true}
          />
        </div>
        <div className="mt-2 text-center text-sm font-bold text-gray-500">
           Current Mode: {mode}
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center gap-2 mb-4">
           <button onClick={onBack} className="text-gray-500 hover:text-black flex items-center gap-1"><ArrowLeft size={16}/> Back</button>
           <h2 className="text-2xl font-bold">Puzzle Creator</h2>
        </div>

        {mode === 'SETUP' && (
          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
             <h3 className="font-bold text-gray-400 text-sm uppercase">Piece Palette</h3>
             <div className="flex gap-2 flex-wrap">
               {['p','n','b','r','q','k'].map(p => (
                 <button key={'w'+p} onClick={() => setSelectedTool({type: p, color: 'w'})} className={`w-10 h-10 text-2xl border rounded hover:bg-gray-100 ${selectedTool !== 'TRASH' && selectedTool?.type === p && selectedTool.color === 'w' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                    {/* Simple representation - replace with Icons or Images if preferred */}
                    <span className="text-black">{p.toUpperCase()}</span> 
                 </button>
               ))}
             </div>
             <div className="flex gap-2 flex-wrap">
               {['p','n','b','r','q','k'].map(p => (
                 <button key={'b'+p} onClick={() => setSelectedTool({type: p, color: 'b'})} className={`w-10 h-10 text-2xl border rounded bg-slate-800 text-white hover:bg-slate-700 ${selectedTool !== 'TRASH' && selectedTool?.type === p && selectedTool.color === 'b' ? 'ring-2 ring-blue-500' : ''}`}>
                    {p.toUpperCase()}
                 </button>
               ))}
             </div>
             
             <div className="flex gap-2 pt-2 border-t mt-2">
                <button onClick={() => setSelectedTool('TRASH')} className={`flex-1 py-2 border rounded flex items-center justify-center gap-2 hover:bg-red-50 text-red-600 ${selectedTool === 'TRASH' ? 'ring-2 ring-red-500' : ''}`}>
                   <Trash2 size={16}/> Trash
                </button>
                <button onClick={() => { game.current.clear(); updateBoard() }} className="flex-1 py-2 border rounded hover:bg-gray-50">Clear</button>
                <button onClick={() => { game.current.reset(); updateBoard() }} className="flex-1 py-2 border rounded hover:bg-gray-50">Start Pos</button>
             </div>
             
             <div className="pt-2">
               <label className="text-xs font-bold text-gray-400">FEN Import</label>
               <div className="flex gap-2">
                 <input className="w-full border p-2 rounded text-xs font-mono" value={fen} onChange={(e) => {
                    try { game.current.load(e.target.value); updateBoard(); } catch {}
                 }} />
                 <button className="p-2 border rounded" onClick={() => navigator.clipboard.writeText(fen)}><Copy size={16}/></button>
               </div>
             </div>
          </div>
        )}

        {mode === 'RECORD' && (
           <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <h3 className="font-bold text-green-800 flex items-center gap-2"><Play size={16}/> Recording Moves...</h3>
              <div className="bg-white p-3 rounded mt-2 font-mono text-sm min-h-[40px]">
                 {moves.join(' ') || "Make moves on the board..."}
              </div>
              <button onClick={() => { game.current.undo(); updateBoard(); setMoves(m => m.slice(0, -1)) }} className="mt-2 text-sm text-green-700 font-bold hover:underline flex items-center gap-1">
                 <RotateCcw size={12}/> Undo Last Move
              </button>
           </div>
        )}

        <div className="pt-4 border-t space-y-4">
           <input className="w-full border-2 border-gray-200 rounded p-3 font-bold" placeholder="Puzzle Title (e.g. Mate in 3)" value={title} onChange={e => setTitle(e.target.value)} />
           <div className="flex gap-2">
             <button onClick={toggleMode} className={`flex-1 py-3 rounded font-bold ${mode === 'SETUP' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
               {mode === 'SETUP' ? 'Start Recording' : 'Back to Setup'}
             </button>
             <button onClick={savePuzzle} disabled={moves.length === 0} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded font-bold disabled:opacity-50">
               Save Puzzle
             </button>
           </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 4. ANALYSIS BOARD (FIXED - Auto Clear Highlight)
// ==========================================
function AnalysisBoard() {
  const game = useRef(new Chess())
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  const [squares, setSquares] = useState<Record<string, any>>({})
  const [orientation, setOrientation] = useState<'white'|'black'>('white')
  const [setupMode, setSetupMode] = useState(false)
  const [selectedTool, setSelectedTool] = useState<Tool>(null)

  const updateBoard = () => setFen(game.current.fen())

  // --- HELPER: REMOVE HIGHLIGHT FROM A SQUARE ---
  const clearHighlight = (square: string) => {
    setSquares((prev) => {
      // Only trigger update if the square actually has a highlight
      if (prev[square]) {
        const newSquares = { ...prev }
        delete newSquares[square]
        return newSquares
      }
      return prev
    })
  }

  const onDrop = (source: string, target: string) => {
    // SETUP MODE: Allow moving any piece anywhere
    if (setupMode) {
      const piece = game.current.get(source as any)
      if(!piece) return false
      
      game.current.remove(source as any)
      game.current.put(piece, target as any)
      
      updateBoard()
      clearHighlight(target) // <--- Remove highlight on drop
      return true
    }

    // ANALYSIS MODE: Standard Chess Rules
    try {
      const move = game.current.move({ from: source, to: target, promotion: 'q' })
      if (!move) return false
      
      setFen(game.current.fen())
      clearHighlight(target) // <--- Remove highlight on drop
      return true
    } catch { return false }
  }

  // --- LEFT CLICK HANDLER (For Setup Mode) ---
  const onSquareClick = (square: string) => {
    if (setupMode && selectedTool) {
       if (selectedTool === 'TRASH') {
         game.current.remove(square as any)
       } else {
         game.current.put({ type: selectedTool.type as any, color: selectedTool.color }, square as any)
       }
       updateBoard()
       // Optional: Clear highlight if placing a piece directly on it
       clearHighlight(square) 
    }
  }

  // --- RIGHT CLICK HANDLER (For Highlights) ---
  const onSquareRightClick = (square: string) => {
    if (!setupMode) {
       setSquares(prev => {
        const s = { ...prev }
        // 1. Green Highlight
        if (!s[square]) {
            s[square] = { backgroundColor: 'rgba(0, 255, 0, 0.4)' } 
        } 
        // 2. Gold Star (if already Green)
        else if (s[square].backgroundColor === 'rgba(0, 255, 0, 0.4)') {
            s[square] = { 
                background: 'radial-gradient(circle, gold 20%, transparent 30%)',
                backgroundColor: 'rgba(0, 0, 0, 0)' 
            } 
        } 
        // 3. Clear (if already Star)
        else {
            delete s[square]
        }
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
          
          {/* FEN Control */}
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
                      {p.toUpperCase()}
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