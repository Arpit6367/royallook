'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { 
  Users, Folder, FileText, ChevronRight, Save, RotateCcw, 
  MousePointer2, Trash2, Plus, Edit, ArrowLeft, Check, 
  Play, Copy, Settings, ArrowUpDown, BookOpen, Video, List, Loader2,
  MoreVertical, FolderInput, X, Search
} from 'lucide-react'

// --- TYPES ---
type Tool = { type: string, color: 'w' | 'b' } | 'TRASH' | null

// --- REUSABLE COMPONENTS ---

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b shrink-0">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
            {children}
        </div>
      </div>
    </div>
  )
}

const BoardSetupPalette = ({ selectedTool, setSelectedTool, onClear, onReset }: any) => {
    const pieces = ['p', 'n', 'b', 'r', 'q', 'k']
    
    return (
        <div className="bg-white border rounded-xl p-3 shadow-sm select-none">
            <div className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-wider flex justify-between">
                <span>White</span>
                <span>Black</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
                 <div className="flex gap-1 flex-wrap justify-center">
                    {pieces.map(p => (
                        <div 
                            key={'w'+p}
                            onClick={() => setSelectedTool({ type: p, color: 'w' })}
                            className={`w-8 h-8 flex items-center justify-center text-2xl cursor-pointer hover:bg-gray-100 rounded transition-all border border-transparent
                            ${selectedTool?.type === p && selectedTool?.color === 'w' ? 'bg-orange-100 border-orange-500 scale-110' : ''}`}
                        >
                           <span className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] pb-1">
                             {p === 'p' ? '♟' : p === 'n' ? '♞' : p === 'b' ? '♝' : p === 'r' ? '♜' : p === 'q' ? '♛' : '♚'}
                           </span>
                        </div>
                    ))}
                 </div>
                 
                 <div className="flex gap-1 flex-wrap justify-center border-l pl-4">
                    {pieces.map(p => (
                        <div 
                            key={'b'+p}
                            onClick={() => setSelectedTool({ type: p, color: 'b' })}
                            className={`w-8 h-8 flex items-center justify-center text-2xl cursor-pointer hover:bg-gray-100 rounded transition-all border border-transparent
                            ${selectedTool?.type === p && selectedTool?.color === 'b' ? 'bg-slate-200 border-slate-500 scale-110' : ''}`}
                        >
                           <span className="text-black pb-1">
                             {p === 'p' ? '♟' : p === 'n' ? '♞' : p === 'b' ? '♝' : p === 'r' ? '♜' : p === 'q' ? '♛' : '♚'}
                           </span>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="border-t pt-3 flex gap-2">
                <button 
                    onClick={() => setSelectedTool('TRASH')}
                    className={`flex-1 flex flex-col items-center gap-1 p-2 rounded hover:bg-red-50 transition-colors ${selectedTool === 'TRASH' ? 'bg-red-100 text-red-600 ring-1 ring-red-500' : 'text-gray-500'}`}
                >
                    <Trash2 size={16} />
                    <span className="text-[10px] font-bold">TRASH</span>
                </button>
                <button onClick={onClear} className="flex-1 flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-100 text-gray-500">
                    <Trash2 size={16} className="text-gray-400"/> 
                    <span className="text-[10px] font-bold">CLEAR</span>
                </button>
                <button onClick={onReset} className="flex-1 flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-100 text-gray-500">
                    <RotateCcw size={16} className="text-gray-400"/>
                    <span className="text-[10px] font-bold">RESET</span>
                </button>
            </div>
        </div>
    )
}

// --- MAIN DASHBOARD ---

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'puzzles' | 'analysis'>('users')

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      <header className="bg-white border-b px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
             <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold shadow-orange-200 shadow-lg">C</div>
             <h1 className="text-xl font-bold text-slate-800 tracking-tight">Chess Admin</h1>
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'courses', label: 'Courses', icon: BookOpen },
            { id: 'puzzles', label: 'Puzzles', icon: Folder },
            { id: 'analysis', label: 'Analysis', icon: MousePointer2 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
              ${activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>
      
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'courses' && <CourseManager />}
        {activeTab === 'puzzles' && <CurriculumManager />}
        {activeTab === 'analysis' && <AnalysisBoard />}
      </main>
    </div>
  )
}

// ==========================================
// 1. USER MANAGER (Real API)
// ==========================================
function UserManager() {
    const [users, setUsers] = useState<any[]>([])
    const [coaches, setCoaches] = useState<any[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState<any>({ name: '', email: '', password: '', role: 'STUDENT', stage: 'BEGINNER', coachId: '' })
    const [editingId, setEditingId] = useState<string | null>(null)
  
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/admin/users')
        const data = await res.json()
        if (res.ok && Array.isArray(data)) {
          setUsers(data)
          setCoaches(data.filter((u: any) => u.role === 'COACH' || u.role === 'ADMIN'))
        }
      } catch (error) {
        console.error("Failed to fetch users", error)
      } finally {
        setLoading(false)
      }
    }
  
    useEffect(() => { fetchUsers() }, [])
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const method = editingId ? 'PUT' : 'POST'
      const payload = editingId ? { ...formData, id: editingId } : formData
  
      try {
          const res = await fetch('/api/admin/users', {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          })
          if (res.ok) {
              setIsModalOpen(false)
              fetchUsers()
              setFormData({ name: '', email: '', password: '', role: 'STUDENT', stage: 'BEGINNER', coachId: '' })
          } else {
              const err = await res.json()
              alert(err.error || "Failed to save user")
          }
      } catch (e) { console.error(e) }
    }
  
    const handleDelete = async (id: string) => {
        if(!confirm("Are you sure?")) return
        try {
            const res = await fetch('/api/admin/users', { 
                method: 'DELETE', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id })
            })
            if(res.ok) fetchUsers()
        } catch(e) { console.error(e) }
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
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Users className="text-orange-600"/> Manage Users</h2>
          <button onClick={() => { setEditingId(null); setIsModalOpen(true); setFormData({ name: '', email: '', password: '', role: 'STUDENT', stage: 'BEGINNER', coachId: '' }) }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow"><Plus size={16}/> Add User</button>
        </div>
        
        {loading ? <div className="text-center py-20"><Loader2 className="animate-spin inline text-orange-600" size={32}/></div> : (
          <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b">
                  <tr>
                      <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">Role</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">Stage</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">Coach</th>
                      <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y">
                  {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                          <div className="font-bold text-gray-800">{u.name}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                      </td>
                      <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : u.role === 'COACH' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                      <td className="p-4 text-sm">{u.role === 'STUDENT' ? u.stage : '-'}</td>
                      <td className="p-4 text-sm text-blue-600">{u.coach?.name || '-'}</td>
                      <td className="p-4 text-right space-x-2">
                          <button onClick={() => openEdit(u)} className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors"><Edit size={16}/></button>
                          <button onClick={() => handleDelete(u.id)} className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={16}/></button>
                      </td>
                      </tr>
                  ))}
                  </tbody>
              </table>
          </div>
        )}
  
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit User" : "Add User"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500">Full Name</label>
                   <input className="w-full border p-2 rounded focus:ring-2 ring-orange-200 outline-none" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
               </div>
               <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500">Email Address</label>
                   <input className="w-full border p-2 rounded focus:ring-2 ring-orange-200 outline-none" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
               </div>
            </div>
            
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Password</label>
                <input className="w-full border p-2 rounded focus:ring-2 ring-orange-200 outline-none" type="password" placeholder={editingId ? "Leave blank to keep current" : "Secure Password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">System Role</label>
                <select className="w-full border p-2 rounded bg-white" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="STUDENT">Student</option>
                <option value="COACH">Coach</option>
                <option value="ADMIN">Admin</option>
                </select>
            </div>

            {formData.role === 'STUDENT' && (
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border">
                <div>
                    <label className="text-xs font-bold text-gray-500">Chess Level</label>
                    <select className="w-full border p-2 rounded mt-1" value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})}>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500">Assign Coach</label>
                    <select className="w-full border p-2 rounded mt-1" value={formData.coachId} onChange={e => setFormData({...formData, coachId: e.target.value})}>
                    <option value="">-- No Coach --</option>
                    {coaches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
              </div>
            )}
            <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 shadow-lg mt-4 transition-all">
                {editingId ? 'Update User' : 'Create User'}
            </button>
          </form>
        </Modal>
      </div>
    )
}

// ==========================================
// 2. COURSE MANAGER (Real API)
// ==========================================
function CourseManager() {
  const [view, setView] = useState<'LIST' | 'EDIT_COURSE'>('LIST')
  const [courses, setCourses] = useState<any[]>([])
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(-1)
  const game = useRef(new Chess())
  const [chapterFen, setChapterFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  const [selectedTool, setSelectedTool] = useState<Tool>(null)

  // 1. Fetch Courses
  const fetchCourses = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/courses')
        if(res.ok) {
            const data = await res.json()
            setCourses(data)
        }
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
  }

  useEffect(() => { fetchCourses() }, [])

  const handleCreateCourse = () => {
    setEditingCourse({ title: '', description: '', level: 'BEGINNER', chapters: [] })
    setView('EDIT_COURSE')
    setActiveChapterIndex(-1)
  }

  // 2. Save Course
  const saveCourse = async () => {
    try {
        const res = await fetch('/api/courses', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(editingCourse)
        })
        if(res.ok) {
            alert('Course saved successfully!')
            fetchCourses()
            setView('LIST')
        } else {
            alert('Failed to save course')
        }
    } catch(e) { console.error(e); alert('Error saving course') }
  }

  const updateBoard = () => {
    const fen = game.current.fen()
    setChapterFen(fen)
    if(activeChapterIndex > -1) {
        const updatedChapters = [...editingCourse.chapters]
        updatedChapters[activeChapterIndex] = { ...updatedChapters[activeChapterIndex], fen: fen }
        setEditingCourse({ ...editingCourse, chapters: updatedChapters })
    }
  }

  const onSquareClick = (square: string) => {
    if (activeChapterIndex === -1 || !selectedTool) return
    if (selectedTool === 'TRASH') game.current.remove(square as any)
    else game.current.put({ type: selectedTool.type as any, color: selectedTool.color }, square as any)
    updateBoard()
  }

  const onPieceDrop = (source: string, target: string) => {
    if (activeChapterIndex === -1) return false
    const piece = game.current.get(source as any)
    if (!piece) return false
    game.current.remove(source as any)
    game.current.put(piece, target as any)
    updateBoard()
    return true
  }

  const onSquareRightClick = (square: string) => {
    game.current.remove(square as any)
    updateBoard()
  }

  if (view === 'LIST') {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800"><BookOpen className="text-orange-600"/> Courses</h2>
          <button onClick={handleCreateCourse} className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5">
            <Plus size={18}/> Create Course
          </button>
        </div>
        
        {loading ? <div className="text-center py-10"><Loader2 className="animate-spin inline"/></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 && <div className="col-span-3 text-center text-gray-400 py-10">No courses found.</div>}
            {courses.map(c => (
                <div key={c.id} className="border rounded-xl p-5 hover:shadow-lg transition-shadow bg-gray-50 flex flex-col justify-between h-48">
                    <div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${c.level === 'BEGINNER' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{c.level}</span>
                        <h3 className="text-xl font-bold text-slate-800 mt-2 mb-1">{c.title}</h3>
                        <p className="text-sm text-gray-500">{c.chapters?.length || 0} Lessons</p>
                    </div>
                    <button onClick={() => { setEditingCourse(c); setView('EDIT_COURSE'); setActiveChapterIndex(-1); }} className="w-full mt-4 bg-white border border-gray-300 hover:bg-gray-100 text-slate-700 py-2 rounded font-bold text-sm flex items-center justify-center gap-2">
                        <Edit size={14}/> Edit Course
                    </button>
                </div>
            ))}
        </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden flex flex-col h-[85vh]">
      <div className="bg-white border-b p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('LIST')} className="hover:bg-gray-100 p-2 rounded-full transition-colors text-gray-500"><ArrowLeft/></button>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{editingCourse.title || 'New Course'}</h2>
            <p className="text-xs text-slate-500">Course Editor</p>
          </div>
        </div>
        <button onClick={saveCourse} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors">
          <Save size={18}/> Save Changes
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r bg-gray-50 flex flex-col shrink-0">
            <div className="p-4 space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase">Settings</label>
                <input 
                    className="w-full border p-2 rounded bg-white focus:ring-2 ring-orange-200 outline-none" 
                    placeholder="Course Title" 
                    value={editingCourse.title} 
                    onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} 
                />
                 <select className="w-full border p-2 rounded bg-white" value={editingCourse.level} onChange={e => setEditingCourse({...editingCourse, level: e.target.value})}>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                 </select>
                 
                 <div className="flex justify-between items-center mt-6 mb-2">
                     <span className="text-xs font-bold text-gray-400 uppercase">Chapters</span>
                 </div>
                 <button 
                    onClick={() => {
                        const newChap = { title: 'New Lesson', content: '', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' }
                        const newChaps = [...editingCourse.chapters, newChap]
                        setEditingCourse({ ...editingCourse, chapters: newChaps })
                        setActiveChapterIndex(newChaps.length - 1)
                        game.current.load(newChap.fen)
                        setChapterFen(newChap.fen)
                    }}
                    className="w-full bg-white border-2 border-dashed border-gray-300 text-gray-500 font-bold py-2 rounded hover:border-orange-400 hover:text-orange-500 transition-colors"
                >
                    + Add Lesson
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                {editingCourse.chapters.map((chap: any, idx: number) => (
                    <div 
                        key={idx}
                        onClick={() => { setActiveChapterIndex(idx); game.current.load(chap.fen); setChapterFen(chap.fen) }}
                        className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-all border
                        ${activeChapterIndex === idx ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                    >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeChapterIndex === idx ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{idx+1}</span>
                        <div className="truncate text-sm font-medium text-slate-700">{chap.title || 'Untitled'}</div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                const newChaps = editingCourse.chapters.filter((_:any, i:number) => i !== idx);
                                setEditingCourse({...editingCourse, chapters: newChaps});
                                if(activeChapterIndex === idx) setActiveChapterIndex(-1);
                            }}
                            className="ml-auto text-gray-300 hover:text-red-500"
                        ><Trash2 size={14}/></button>
                    </div>
                ))}
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
           {activeChapterIndex !== -1 ? (
               <div className="max-w-6xl mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-8">
                   <div className="lg:col-span-5 flex flex-col gap-4 h-full">
                        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col h-full">
                            <input 
                                className="text-2xl font-bold bg-transparent border-b border-gray-100 focus:border-orange-500 outline-none pb-2 w-full mb-4 text-slate-800"
                                value={editingCourse.chapters[activeChapterIndex].title}
                                onChange={(e) => {
                                    const newChaps = [...editingCourse.chapters]
                                    newChaps[activeChapterIndex].title = e.target.value
                                    setEditingCourse({...editingCourse, chapters: newChaps})
                                }}
                                placeholder="Lesson Title"
                            />
                            <div className="flex-1 flex flex-col">
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2">Coach Notes / Script</label>
                                <textarea 
                                    className="flex-1 w-full border rounded-lg p-4 resize-none focus:ring-2 focus:ring-orange-500 outline-none text-sm leading-relaxed text-slate-600 bg-gray-50"
                                    placeholder="Write instructions for the coach here..."
                                    value={editingCourse.chapters[activeChapterIndex].content}
                                    onChange={(e) => {
                                        const newChaps = [...editingCourse.chapters]
                                        newChaps[activeChapterIndex].content = e.target.value
                                        setEditingCourse({...editingCourse, chapters: newChaps})
                                    }}
                                />
                            </div>
                        </div>
                   </div>
                   
                   <div className="lg:col-span-7 flex flex-col gap-4">
                        <div className="bg-white p-1 rounded-xl shadow-lg border border-slate-200">
                            <Chessboard 
                                position={chapterFen} 
                                onPieceDrop={onPieceDrop}
                                onSquareClick={onSquareClick}
                                onSquareRightClick={onSquareRightClick}
                            />
                        </div>
                        <BoardSetupPalette 
                            selectedTool={selectedTool} 
                            setSelectedTool={setSelectedTool}
                            onClear={() => { game.current.clear(); updateBoard() }}
                            onReset={() => { game.current.reset(); updateBoard() }}
                        />
                   </div>
               </div>
           ) : (
               <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-60">
                   <Settings size={80} className="mb-4 text-gray-200"/>
                   <p className="text-xl font-bold text-gray-400">Select a lesson from the sidebar to edit</p>
               </div>
           )}
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 3. CURRICULUM MANAGER (Real API)
// ==========================================
function CurriculumManager() {
    const [currentStage, setCurrentStage] = useState<string | null>(null)
    const [breadcrumbs, setBreadcrumbs] = useState<any[]>([])
    const [content, setContent] = useState<{folders: any[], puzzles: any[]}>({ folders: [], puzzles: [] })
    const [view, setView] = useState<'BROWSE' | 'CREATE_PUZZLE'>('BROWSE')
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const [moveModalOpen, setMoveModalOpen] = useState(false)
    const [movingItem, setMovingItem] = useState<{id: string, type: 'FOLDER' | 'PUZZLE'} | null>(null)
    const [availableFolders, setAvailableFolders] = useState<any[]>([]) 
    const [newFolderName, setNewFolderName] = useState('')

    // 1. Fetch Content
    useEffect(() => {
        if (!currentStage) return
        
        const parentId = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].id : null
        const params = new URLSearchParams()
        if (parentId) params.append('parentId', parentId)
        else params.append('stage', currentStage)

        fetch(`/api/content?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                if(data) setContent({ folders: data.folders || [], puzzles: data.puzzles || [] })
            })
            .catch(console.error)
    }, [currentStage, breadcrumbs, refreshTrigger])

    // 2. Actions
    const handleDelete = async (id: string, type: string) => {
        if(!confirm(`Delete this ${type.toLowerCase()}? This cannot be undone.`)) return
        try {
            const res = await fetch(`/api/content`, { 
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, type })
            })
            if(res.ok) setRefreshTrigger(p => p+1)
        } catch(e) { console.error(e) }
    }

    const prepareMove = async (item: any, type: 'FOLDER' | 'PUZZLE') => {
        setMovingItem({ id: item.id, type })
        // Fetch valid destination folders (e.g., all folders except current one and its children)
        try {
            const res = await fetch('/api/content/folders') // Endpoint to get list of potential parent folders
            if(res.ok) {
                const folders = await res.json()
                setAvailableFolders([{id: 'root', name: 'Root Level'}, ...folders])
            }
        } catch(e) { console.error(e) }
        setMoveModalOpen(true)
    }

    const handleMoveSubmit = async (targetFolderId: string) => {
        if(!movingItem) return
        try {
            const res = await fetch('/api/content/move', { // Assuming a move endpoint exists
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ itemId: movingItem.id, targetFolderId })
            })
            if(res.ok) {
                setMoveModalOpen(false)
                setMovingItem(null)
                setRefreshTrigger(p => p+1)
            } else {
                alert("Move failed")
            }
        } catch(e) { console.error(e) }
    }

    const createFolder = async () => {
        if(!newFolderName) return
        const parentId = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].id : null
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    type: 'FOLDER',
                    name: newFolderName,
                    stage: !parentId ? currentStage : null,
                    parentId: parentId
                })
            })
            if(res.ok) {
                setNewFolderName('')
                setRefreshTrigger(p => p+1)
            }
        } catch(e) { console.error(e) }
    }

    // --- CARD COMPONENT ---
    const ItemCard = ({ item, type }: { item: any, type: 'FOLDER' | 'PUZZLE' }) => {
        const [showMenu, setShowMenu] = useState(false)
        
        return (
            <div 
                className={`relative group h-36 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg
                ${type === 'FOLDER' ? 'bg-blue-50 border-blue-100 hover:border-blue-300' : 'bg-white border-gray-100 hover:border-orange-300'}`}
                onClick={() => type === 'FOLDER' ? setBreadcrumbs([...breadcrumbs, item]) : null}
            >
                <div className="absolute top-2 right-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
                        className="p-1 rounded-full hover:bg-black/10 text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <MoreVertical size={16}/>
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 top-6 bg-white shadow-xl border rounded-lg w-32 z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
                            <button onClick={() => prepareMove(item, type)} className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-100 flex items-center gap-2 text-slate-700">
                                <FolderInput size={12}/> Move
                            </button>
                            <button onClick={() => handleDelete(item.id, type)} className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-red-50 text-red-600 flex items-center gap-2">
                                <Trash2 size={12}/> Delete
                            </button>
                        </div>
                    )}
                    {showMenu && <div className="fixed inset-0 z-10 cursor-default" onClick={(e) => { e.stopPropagation(); setShowMenu(false)}} />}
                </div>

                {type === 'FOLDER' ? <Folder className="w-10 h-10 text-blue-500 mb-2"/> : <FileText className="w-8 h-8 text-orange-500 mb-2"/>}
                <span className={`font-bold text-sm px-4 text-center truncate w-full ${type === 'FOLDER' ? 'text-blue-900' : 'text-slate-700'}`}>
                    {type === 'FOLDER' ? item.name : item.title}
                </span>
            </div>
        )
    }

    if (view === 'CREATE_PUZZLE') {
        const parent = breadcrumbs[breadcrumbs.length - 1]
        return <PuzzleCreator folderId={parent?.id || 'root'} onBack={() => { setView('BROWSE'); setRefreshTrigger(p=>p+1) }} />
    }

    if (!currentStage) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-8 min-h-[500px]">
                <h2 className="text-2xl font-bold mb-8 text-slate-800">Select Difficulty Level</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(stage => (
                        <button key={stage} onClick={() => setCurrentStage(stage)} className="h-48 group relative overflow-hidden bg-white border-2 hover:border-orange-500 rounded-2xl shadow-sm hover:shadow-xl transition-all flex flex-col items-center justify-center gap-4">
                            <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity"/>
                            <div className="relative z-10 p-4 bg-orange-100 rounded-full text-orange-600 group-hover:scale-110 transition-transform"><Folder size={32}/></div>
                            <span className="relative z-10 text-xl font-bold text-slate-700">{stage}</span>
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 min-h-[600px] flex flex-col">
            <div className="flex items-center gap-2 mb-8 pb-4 border-b">
                <button onClick={() => { setCurrentStage(null); setBreadcrumbs([]) }} className="font-bold text-gray-400 hover:text-black transition-colors">Levels</button>
                <ChevronRight size={16} className="text-gray-300"/>
                <span className="font-bold text-orange-600 px-2 py-1 bg-orange-50 rounded">{currentStage}</span>
                {breadcrumbs.map((b, i) => (
                    <div key={b.id} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                        <ChevronRight size={16} className="text-gray-300"/>
                        <button onClick={() => setBreadcrumbs(breadcrumbs.slice(0, i+1))} className="hover:bg-gray-100 px-2 py-1 rounded font-medium text-slate-700">{b.name}</button>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-auto">
                {/* Folder Creation Input */}
                <div className="h-36 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-4 gap-2">
                    <input 
                        className="w-full text-center border-b focus:border-orange-500 outline-none pb-1 text-sm bg-transparent" 
                        placeholder="New Folder Name"
                        value={newFolderName}
                        onChange={e => setNewFolderName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && createFolder()}
                    />
                    <button onClick={createFolder} disabled={!newFolderName} className="bg-slate-800 text-white text-xs px-3 py-1 rounded disabled:opacity-50">Create</button>
                </div>
                
                {content.folders.map(f => <ItemCard key={f.id} item={f} type="FOLDER" />)}
                {content.puzzles.map(p => <ItemCard key={p.id} item={p} type="PUZZLE" />)}
            </div>

            <div className="border-t pt-6 mt-6 flex justify-end">
                 <button onClick={() => setView('CREATE_PUZZLE')} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-transform hover:scale-105 font-bold">
                     <Plus size={20}/> New Puzzle
                 </button>
            </div>

            <Modal isOpen={moveModalOpen} onClose={() => setMoveModalOpen(false)} title="Move to Folder">
                <div className="space-y-2">
                    <p className="text-sm text-gray-500 mb-2">Select destination:</p>
                    <div className="max-h-60 overflow-y-auto border rounded-lg divide-y bg-gray-50">
                        {availableFolders.map(folder => (
                            <button 
                                key={folder.id}
                                onClick={() => handleMoveSubmit(folder.id)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 text-sm font-medium text-slate-700 transition-colors"
                            >
                                <Folder size={16} className="text-blue-400"/>
                                {folder.name}
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    )
}

// ==========================================
// 4. PUZZLE CREATOR (Real API)
// ==========================================
function PuzzleCreator({ folderId, onBack }: { folderId: string, onBack: () => void }) {
    const game = useRef(new Chess())
    const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    const [moves, setMoves] = useState<string[]>([])
    const [title, setTitle] = useState('')
    const [mode, setMode] = useState<'SETUP'|'RECORD'>('SETUP')
    const [selectedTool, setSelectedTool] = useState<Tool>(null)
    const [startFen, setStartFen] = useState<string | null>(null)
    
    const updateBoard = () => setFen(game.current.fen())
  
    const toggleMode = () => {
      if (mode === 'SETUP') {
        const boardOnly = game.current.fen().split(" ")[0];
        if (!boardOnly.includes("K") || !boardOnly.includes("k")) return alert("Invalid board. Kings missing.");
        setStartFen(game.current.fen())
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
      if (selectedTool === 'TRASH') game.current.remove(square as any)
      else game.current.put({ type: selectedTool.type as any, color: selectedTool.color }, square as any)
      updateBoard()
    }
  
    const onDrop = (source: string, target: string) => {
      if (mode === 'SETUP') {
        const piece = game.current.get(source as any)
        if(!piece) return false
        game.current.remove(source as any)
        game.current.put(piece, target as any)
        updateBoard()
        return true
      }
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
        if(!title || !startFen) return
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    type: 'PUZZLE',
                    title: title,
                    fen: startFen,
                    solution: moves.join(' '),
                    parentId: folderId === 'root' ? null : folderId
                })
            })
            if(res.ok) {
                alert("Puzzle Saved Successfully!")
                onBack()
            } else {
                alert("Failed to save puzzle")
            }
        } catch(e) { console.error(e) }
    }
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-xl border h-full min-h-[600px]">
        {/* Left: Board */}
        <div className="lg:col-span-5 flex justify-center">
          <div className={`w-full max-w-[500px] border-4 rounded-xl shadow-lg overflow-hidden transition-colors ${mode === 'RECORD' ? 'border-green-500' : 'border-blue-500'}`}>
            <Chessboard position={fen} onPieceDrop={onDrop} onSquareClick={onSquareClick} />
          </div>
        </div>
  
        {/* Right: Tools */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b pb-4">
             <button onClick={onBack} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"><ArrowLeft size={20}/></button>
             <div>
                <h2 className="text-2xl font-bold text-slate-800">New Puzzle</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className={`w-2 h-2 rounded-full ${mode === 'SETUP' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                    Step {mode === 'SETUP' ? '1: Setup Board' : '2: Play Solution'}
                </div>
             </div>
          </div>
  
          {mode === 'SETUP' && (
            <div className="animate-in fade-in slide-in-from-right-4">
               <BoardSetupPalette 
                  selectedTool={selectedTool} 
                  setSelectedTool={setSelectedTool}
                  onClear={() => { game.current.clear(); updateBoard() }}
                  onReset={() => { game.current.reset(); updateBoard() }}
               />
               <div className="mt-8 flex justify-end">
                   <button onClick={toggleMode} className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-black transition-all flex items-center gap-2">
                       Next: Record Solution <ChevronRight size={18}/>
                   </button>
               </div>
            </div>
          )}
  
          {mode === 'RECORD' && (
             <div className="animate-in fade-in slide-in-from-right-4 space-y-4">
                <div className="bg-green-50 border border-green-200 p-5 rounded-xl">
                    <h3 className="font-bold text-green-800 flex items-center gap-2 mb-2"><Play size={18}/> Recording Moves...</h3>
                    <p className="text-sm text-green-700 mb-3">Play the solution on the board. The computer opponent moves will be auto-calculated later.</p>
                    <div className="bg-white p-4 rounded-lg font-mono text-lg min-h-[60px] shadow-inner border border-green-100">
                        {moves.length > 0 ? moves.join('  ') : <span className="text-gray-300">Make a move...</span>}
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button onClick={() => { game.current.undo(); updateBoard(); setMoves(m => m.slice(0, -1)) }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded font-bold text-gray-700 flex items-center gap-2">
                        <RotateCcw size={16}/> Undo
                    </button>
                </div>

                <div className="pt-6 border-t mt-6 space-y-4">
                    <input className="w-full text-lg border-2 border-gray-200 rounded-lg p-3 font-bold focus:border-orange-500 outline-none" placeholder="Puzzle Title (e.g. Back Rank Mate)" value={title} onChange={e => setTitle(e.target.value)} />
                    <div className="flex gap-4">
                        <button onClick={toggleMode} className="px-6 py-3 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">Back to Setup</button>
                        <button onClick={savePuzzle} disabled={moves.length === 0} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:shadow-none transition-all">
                            Save Puzzle
                        </button>
                    </div>
                </div>
             </div>
          )}
        </div>
      </div>
    )
}

// ==========================================
// 5. ANALYSIS BOARD
// ==========================================
function AnalysisBoard() {
    const game = useRef(new Chess())
    const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    const [squares, setSquares] = useState<Record<string, any>>({})
    const [orientation, setOrientation] = useState<'white'|'black'>('white')
    const [setupMode, setSetupMode] = useState(false)
    const [selectedTool, setSelectedTool] = useState<Tool>(null)
  
    const updateBoard = () => setFen(game.current.fen())
    
    // Clear highlights when a piece moves or is placed
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
         if (selectedTool === 'TRASH') game.current.remove(square as any)
         else game.current.put({ type: selectedTool.type as any, color: selectedTool.color }, square as any)
         updateBoard()
         clearHighlight(square) 
      }
    }
  
    // Right click for colored highlights (Analysis specific feature)
    const onSquareRightClick = (square: string) => {
      if (!setupMode) {
         setSquares(prev => {
          const s = { ...prev }
          // Toggle Green -> Yellow -> Off
          if (!s[square]) s[square] = { backgroundColor: 'rgba(0, 255, 0, 0.4)' } 
          else if (s[square].backgroundColor === 'rgba(0, 255, 0, 0.4)') s[square] = { background: 'radial-gradient(circle, gold 20%, transparent 30%)', backgroundColor: 'rgba(0, 0, 0, 0)' } 
          else delete s[square]
          return s
        })
      }
    }
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-xl shadow-sm border">
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
        
        <div className="lg:col-span-4 space-y-6">
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800"><MousePointer2 className="text-orange-500"/> Analysis Tools</h3>
            <div className="flex gap-2 mb-4">
               <button onClick={() => { game.current.reset(); updateBoard(); setSquares({}) }} className="flex-1 py-2 border rounded hover:bg-gray-50 flex items-center justify-center gap-2 font-medium"><RotateCcw size={16}/> Reset</button>
               <button onClick={() => setOrientation(o => o === 'white' ? 'black' : 'white')} className="flex-1 py-2 border rounded hover:bg-gray-50 flex items-center justify-center gap-2 font-medium"><ArrowUpDown size={16}/> Flip</button>
            </div>
            <button onClick={() => { setSetupMode(!setupMode); setSelectedTool(null) }} className={`w-full py-3 rounded font-bold flex items-center justify-center gap-2 transition-colors ${setupMode ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-800 text-white hover:bg-slate-900'}`}>
               <Settings size={16}/> {setupMode ? 'Exit Setup Mode' : 'Edit Board Position'}
            </button>
          </div>
  
          {setupMode && (
            <div className="border-t pt-4 animate-in fade-in slide-in-from-top-4">
               <BoardSetupPalette 
                  selectedTool={selectedTool} 
                  setSelectedTool={setSelectedTool}
                  onClear={() => { game.current.clear(); updateBoard() }}
                  onReset={() => { game.current.reset(); updateBoard() }}
               />
            </div>
          )}
        </div>
      </div>
    )
}