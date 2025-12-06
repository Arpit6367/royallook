'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { 
  Users, Folder, FileText, ChevronRight, Save, RotateCcw, 
  MousePointer2, Trash2, Plus, Edit, ArrowLeft, Check, 
  Play, Copy, Settings, ArrowUpDown, BookOpen, Video, List, Loader2
} from 'lucide-react'

// --- TYPES & HELPERS ---
type Tool = { type: string, color: 'w' | 'b' } | 'TRASH' | null

// --- MODAL COMPONENT ---
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black font-bold text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'puzzles' | 'analysis'>('users')

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans pt-30">
      <header className="bg-white border-b px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-orange-600 mb-4 md:mb-0">Chess Admin</h1>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'courses', label: 'Courses', icon: BookOpen },
            { id: 'puzzles', label: 'Puzzles', icon: Folder },
            { id: 'analysis', label: 'Analysis', icon: MousePointer2 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded capitalize font-medium transition-colors ${activeTab === tab.id ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>
      <main className="p-6 max-w-7xl mx-auto">
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'courses' && <CourseManager />}
        {activeTab === 'puzzles' && <CurriculumManager />}
        {activeTab === 'analysis' && <AnalysisBoard />}
      </main>
    </div>
  )
}

// ==========================================
// 1. USER MANAGEMENT TAB (Connected to API)
// ==========================================
function UserManager() {
  const [users, setUsers] = useState<any[]>([])
  const [coaches, setCoaches] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<any>({ name: '', email: '', password: '', role: 'STUDENT', stage: 'BEGINNER', coachId: '' })
  const [editingId, setEditingId] = useState<string | null>(null)

  // 1. Fetch Data from API
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (Array.isArray(data)) {
        setUsers(data)
        setCoaches(data.filter((u: any) => u.role === 'COACH' || u.role === 'ADMIN'))
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  // 2. Handle Submit (Create/Update)
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
            alert(editingId ? "User Updated" : "User Created")
            setIsModalOpen(false)
            fetchUsers() // Refresh list
            setFormData({ name: '', email: '', password: '', role: 'STUDENT', stage: 'BEGINNER', coachId: '' })
        } else {
            const err = await res.json()
            alert(err.error || "Failed")
        }
    } catch (e) {
        console.error(e)
    }
  }

  // 3. Handle Delete
  const handleDelete = async (id: string) => {
      if(!confirm("Are you sure?")) return
      await fetch('/api/admin/users', { method: 'DELETE', body: JSON.stringify({ id })})
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
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><Users className="text-orange-600"/> Manage Users</h2>
        <button onClick={() => { setEditingId(null); setIsModalOpen(true); setFormData({ name: '', email: '', password: '', role: 'STUDENT', stage: 'BEGINNER', coachId: '' }) }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"><Plus size={16}/> Add User</button>
      </div>
      
      {loading ? <div className="text-center py-10"><Loader2 className="animate-spin inline"/></div> : (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="p-3 text-sm font-semibold text-gray-600">Name</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">Role</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">Stage</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">Coach</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 text-right">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                        <div className="font-bold text-gray-800">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                    </td>
                    <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : u.role === 'COACH' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                    <td className="p-3 text-sm">{u.role === 'STUDENT' ? u.stage : '-'}</td>
                    <td className="p-3 text-sm text-blue-600">{u.coach?.name || '-'}</td>
                    <td className="p-3 text-right space-x-2">
                        <button onClick={() => openEdit(u)} className="text-blue-500 hover:text-blue-700"><Edit size={16}/></button>
                        <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
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
             <input className="w-full border p-2 rounded" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
             <input className="w-full border p-2 rounded" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <input className="w-full border p-2 rounded" type="password" placeholder={editingId ? "New Password (Optional)" : "Password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <select className="w-full border p-2 rounded" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="STUDENT">Student</option>
            <option value="COACH">Coach</option>
            <option value="ADMIN">Admin</option>
          </select>
          {formData.role === 'STUDENT' && (
            <div className="grid grid-cols-2 gap-4">
              <select className="w-full border p-2 rounded" value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})}>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
              <select className="w-full border p-2 rounded" value={formData.coachId} onChange={e => setFormData({...formData, coachId: e.target.value})}>
                <option value="">-- No Coach --</option>
                {coaches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
          <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded font-bold hover:bg-orange-700">Save User</button>
        </form>
      </Modal>
    </div>
  )
}

// ==========================================
// 2. COURSE MANAGER (Connected to API)
// ==========================================
function CourseManager() {
  const [view, setView] = useState<'LIST' | 'EDIT_COURSE'>('LIST')
  const [courses, setCourses] = useState<any[]>([])
  const [editingCourse, setEditingCourse] = useState<any>(null)
  
  // Chapter Editor State
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(-1)
  const game = useRef(new Chess())
  const [chapterFen, setChapterFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

  // 1. Fetch Courses
  const fetchCourses = async () => {
      const res = await fetch('/api/courses')
      const data = await res.json()
      if(Array.isArray(data)) setCourses(data)
  }

  useEffect(() => { fetchCourses() }, [])

  const handleCreateCourse = () => {
    // New course (no ID yet)
    setEditingCourse({ title: '', description: '', level: 'BEGINNER', chapters: [] })
    setView('EDIT_COURSE')
    setActiveChapterIndex(-1)
  }

  const handleEditCourse = (c: any) => {
    setEditingCourse({ ...c })
    setView('EDIT_COURSE')
    setActiveChapterIndex(-1)
  }

  // 2. Save Course to API
  const saveCourse = async () => {
    try {
        const res = await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingCourse)
        })
        if (res.ok) {
            alert("Course Saved!")
            setView('LIST')
            fetchCourses()
        } else {
            alert("Failed to save")
        }
    } catch(e) { console.error(e) }
  }

  const handleDelete = async (id: string) => {
      if(!confirm("Delete course?")) return
      await fetch('/api/courses', { method: 'DELETE', body: JSON.stringify({ id }) })
      fetchCourses()
  }

  const addChapter = () => {
    const newChapter = { title: 'New Lesson', content: '', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' }
    setEditingCourse({ ...editingCourse, chapters: [...(editingCourse.chapters || []), newChapter] })
    setActiveChapterIndex((editingCourse.chapters || []).length) 
    setChapterFen(newChapter.fen)
  }

  const updateChapter = (field: string, val: string) => {
    const updatedChapters = [...editingCourse.chapters]
    updatedChapters[activeChapterIndex] = { ...updatedChapters[activeChapterIndex], [field]: val }
    setEditingCourse({ ...editingCourse, chapters: updatedChapters })
  }

  const onDrop = (source: string, target: string) => {
    if (activeChapterIndex === -1) return false
    try {
      const move = game.current.move({ from: source, to: target, promotion: 'q' })
      if (!move) {
        // Allow free setup movement
        game.current.remove(source as any)
        game.current.put({ type: 'p', color: 'w' } as any, target as any) 
        return false 
      }
      const newFen = game.current.fen()
      setChapterFen(newFen)
      updateChapter('fen', newFen)
      return true
    } catch { return false }
  }

  // --- COURSE LIST VIEW ---
  if (view === 'LIST') {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800"><BookOpen className="text-orange-600"/> All Courses</h2>
          <button onClick={handleCreateCourse} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md transition-all">
            <Plus size={20}/> Create Course
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => (
            <div key={c.id} className="border rounded-xl p-5 hover:shadow-lg transition-shadow bg-gray-50 flex flex-col justify-between h-48">
              <div>
                <div className="flex justify-between items-start mb-2">
                   <span className={`text-xs font-bold px-2 py-1 rounded ${c.level === 'BEGINNER' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>{c.level}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{c.title}</h3>
                <p className="text-sm text-gray-500">{c.chapters?.length || 0} Lessons</p>
              </div>
              <div className="flex gap-2 border-t pt-4 mt-2">
                 <button onClick={() => handleEditCourse(c)} className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 text-slate-700 py-2 rounded font-medium text-sm flex items-center justify-center gap-2">
                   <Edit size={14}/> Edit
                 </button>
                 <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // --- EDIT COURSE VIEW ---
  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden flex flex-col h-[85vh]">
      {/* Header */}
      <div className="bg-slate-800 text-white p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('LIST')} className="hover:bg-slate-700 p-2 rounded"><ArrowLeft/></button>
          <div>
            <h2 className="text-lg font-bold">{editingCourse.id ? 'Edit Course' : 'New Course'}</h2>
            <p className="text-xs text-slate-400">Coaches will be able to teach this curriculum</p>
          </div>
        </div>
        <button onClick={saveCourse} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-bold flex items-center gap-2">
          <Save size={18}/> Save Course
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Course Structure */}
        <div className="w-1/3 border-r bg-gray-50 overflow-y-auto p-4 flex flex-col gap-4">
          <div className="bg-white p-4 rounded shadow-sm space-y-3">
             <label className="text-xs font-bold text-gray-500 uppercase">Course Details</label>
             <input className="w-full border p-2 rounded" placeholder="Course Title" value={editingCourse.title} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} />
             <select className="w-full border p-2 rounded" value={editingCourse.level} onChange={e => setEditingCourse({...editingCourse, level: e.target.value})}>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
             </select>
          </div>

          <div className="flex justify-between items-center mt-2">
             <h3 className="font-bold text-gray-700">Chapters</h3>
             <button onClick={addChapter} className="text-blue-600 text-sm font-bold hover:underline">+ Add Chapter</button>
          </div>

          <div className="space-y-2">
            {editingCourse.chapters.map((chap: any, idx: number) => (
              <div 
                key={idx} 
                onClick={() => { setActiveChapterIndex(idx); setChapterFen(chap.fen); game.current.load(chap.fen) }}
                className={`p-3 rounded cursor-pointer border flex items-center gap-3 transition-colors ${activeChapterIndex === idx ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500' : 'bg-white hover:bg-gray-100'}`}
              >
                <div className="bg-slate-200 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">{idx + 1}</div>
                <div className="truncate text-sm font-medium">{chap.title || 'Untitled Lesson'}</div>
              </div>
            ))}
            {editingCourse.chapters.length === 0 && (
              <div className="text-center text-gray-400 py-8 text-sm italic">No chapters yet. Add one to start.</div>
            )}
          </div>
        </div>

        {/* RIGHT: Chapter Editor */}
        <div className="w-2/3 p-6 overflow-y-auto bg-white">
          {activeChapterIndex !== -1 ? (
            <div className="h-full flex flex-col gap-6">
              <div className="flex items-center justify-between border-b pb-4">
                 <input 
                   className="text-2xl font-bold text-slate-800 outline-none w-full" 
                   value={editingCourse.chapters[activeChapterIndex].title} 
                   onChange={(e) => updateChapter('title', e.target.value)}
                   placeholder="Lesson Title"
                 />
                 <button 
                    onClick={() => {
                        const newChaps = editingCourse.chapters.filter((_:any, i:number) => i !== activeChapterIndex)
                        setEditingCourse({...editingCourse, chapters: newChaps})
                        setActiveChapterIndex(-1)
                    }}
                    className="text-red-500 hover:bg-red-50 p-2 rounded"
                 >
                    <Trash2 size={20}/>
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-8 h-full">
                 <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-500 flex items-center gap-2"><FileText size={16}/> Lesson Notes / Script</label>
                    <textarea 
                      className="w-full flex-1 border rounded-lg p-4 resize-none focus:ring-2 focus:ring-orange-500 outline-none" 
                      placeholder="Write the lesson explanation here for the coach..."
                      value={editingCourse.chapters[activeChapterIndex].content}
                      onChange={(e) => updateChapter('content', e.target.value)}
                    />
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-500 flex items-center gap-2"><Settings size={16}/> Board Setup (FEN)</label>
                    <div className="border-4 border-slate-300 rounded-lg overflow-hidden shadow-sm aspect-square">
                        <Chessboard 
                          position={chapterFen} 
                          onPieceDrop={onDrop}
                          arePiecesDraggable={true}
                        />
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
               <BookOpen size={64} className="mb-4 text-gray-200"/>
               <p>Select a chapter to edit its content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 3. CURRICULUM TAB (Connected to API)
// ==========================================
function CurriculumManager() {
  const [currentStage, setCurrentStage] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([])
  const [content, setContent] = useState<{folders: any[], puzzles: any[]}>({ folders: [], puzzles: [] })
  const [view, setView] = useState<'BROWSE' | 'CREATE_PUZZLE'>('BROWSE')
  const [newFolderName, setNewFolderName] = useState('')

  // 1. Fetch Content
  useEffect(() => {
    if (!currentStage) return
    const parent = breadcrumbs[breadcrumbs.length - 1]
    const url = parent 
      ? `/api/content?parentId=${parent.id}` 
      : `/api/content?stage=${currentStage}`
    
    fetch(url)
      .then(r => r.json())
      .then(setContent)
      .catch(console.error)
  }, [currentStage, breadcrumbs, view]) 

  const createFolder = async () => {
    const parent = breadcrumbs[breadcrumbs.length - 1]
    const res = await fetch('/api/content', {
        method: 'POST',
        body: JSON.stringify({
            type: 'FOLDER',
            name: newFolderName,
            stage: breadcrumbs.length === 0 ? currentStage : null,
            parentId: parent?.id
        })
    })
    if(res.ok) {
        setNewFolderName('')
        // Trigger refetch
        const url = parent ? `/api/content?parentId=${parent.id}` : `/api/content?stage=${currentStage}`
        fetch(url).then(r => r.json()).then(setContent)
    }
  }

  if (view === 'CREATE_PUZZLE') {
    const parent = breadcrumbs[breadcrumbs.length - 1]
    return <PuzzleCreator folderId={parent?.id || 'root'} onBack={() => setView('BROWSE')} />
  }

  if (!currentStage) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Folder className="text-orange-600"/> Puzzle Database</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(stage => (
            <button key={stage} onClick={() => setCurrentStage(stage)} className="h-40 bg-white border-2 hover:border-orange-500 hover:bg-orange-50 rounded-xl text-xl font-bold text-gray-700 shadow-sm transition-all flex flex-col items-center justify-center gap-2">
                <Folder size={32} className="text-orange-400"/>
                {stage}
            </button>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 min-h-[600px]">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b">
        <button onClick={() => { setCurrentStage(null); setBreadcrumbs([]) }} className="font-bold text-gray-500 hover:text-black">Levels</button>
        <ChevronRight size={16} className="text-gray-400"/>
        <span className="font-bold text-orange-600">{currentStage}</span>
        {breadcrumbs.map((b, i) => (
          <div key={b.id} className="flex items-center gap-2">
            <ChevronRight size={16} className="text-gray-400"/>
            <button onClick={() => setBreadcrumbs(breadcrumbs.slice(0, i+1))} className="hover:underline">{b.name}</button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {content.folders.map(f => (
          <div key={f.id} onClick={() => setBreadcrumbs([...breadcrumbs, f])} className="h-32 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:shadow-md hover:bg-blue-100 transition-all">
            <Folder className="w-10 h-10 text-blue-500 mb-2"/>
            <span className="font-bold text-sm text-blue-900">{f.name}</span>
          </div>
        ))}
        {content.puzzles.map(p => (
          <div key={p.id} className="h-32 bg-white border rounded-xl flex flex-col items-center justify-center relative hover:border-orange-300 transition-all">
            <FileText className="w-8 h-8 text-orange-500 mb-2"/>
            <span className="font-medium text-xs px-2 text-center text-gray-600">{p.title}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <input className="border p-2 rounded w-48" placeholder="New Folder Name" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} />
          <button onClick={createFolder} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded">Create</button>
        </div>
        
        <button onClick={() => setView('CREATE_PUZZLE')} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded flex items-center gap-2 shadow-md">
           <Plus size={16}/> Add Puzzle Here
        </button>
      </div>
    </div>
  )
}

// ==========================================
// 4. PUZZLE CREATOR (Connected to API)
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
    if (selectedTool === 'TRASH') {
      game.current.remove(square as any)
    } else {
      game.current.put({ type: selectedTool.type as any, color: selectedTool.color }, square as any)
    }
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

  // SAVE PUZZLE API CALL
  const savePuzzle = async () => {
    if(!title || !startFen || moves.length === 0) return alert("Complete the puzzle first")
    
    try {
        const res = await fetch('/api/content', {
            method: 'POST',
            body: JSON.stringify({
                type: 'PUZZLE',
                title,
                fen: startFen,
                solution: moves.join(' '),
                folderId
            })
        })
        if(res.ok) {
            alert("Puzzle Saved!")
            onBack()
        } else {
            alert("Failed to save puzzle")
        }
    } catch(e) { console.error(e) }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-xl border">
      <div className="lg:col-span-5">
        <div className={`border-4 rounded-xl shadow-lg overflow-hidden ${mode === 'RECORD' ? 'border-green-500' : 'border-blue-500'}`}>
          <Chessboard position={fen} onPieceDrop={onDrop} onSquareClick={onSquareClick} />
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center gap-2 mb-4 border-b pb-4">
           <button onClick={onBack} className="text-gray-500 hover:text-black flex items-center gap-1"><ArrowLeft size={16}/> Back</button>
           <h2 className="text-2xl font-bold">Puzzle Creator</h2>
        </div>

        {mode === 'SETUP' && (
          <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
             <h3 className="font-bold text-gray-400 text-sm uppercase">Tools</h3>
             <div className="flex gap-2 flex-wrap">
               {['p','n','b','r','q','k'].map(p => (
                 <button key={'w'+p} onClick={() => setSelectedTool({type: p, color: 'w'})} className={`w-10 h-10 text-xl font-bold border rounded bg-white hover:bg-gray-100 ${selectedTool !== 'TRASH' && selectedTool?.type === p && selectedTool.color === 'w' ? 'ring-2 ring-blue-500' : ''}`}>{p.toUpperCase()}</button>
               ))}
               {['p','n','b','r','q','k'].map(p => (
                 <button key={'b'+p} onClick={() => setSelectedTool({type: p, color: 'b'})} className={`w-10 h-10 text-xl font-bold border rounded bg-slate-800 text-white hover:bg-slate-700 ${selectedTool !== 'TRASH' && selectedTool?.type === p && selectedTool.color === 'b' ? 'ring-2 ring-blue-500' : ''}`}>{p.toUpperCase()}</button>
               ))}
                <button onClick={() => setSelectedTool('TRASH')} className={`w-10 h-10 border rounded flex items-center justify-center bg-red-50 text-red-600 ${selectedTool === 'TRASH' ? 'ring-2 ring-red-500' : ''}`}><Trash2 size={18}/></button>
             </div>
             <div className="flex gap-2 pt-2">
                <button onClick={() => { game.current.clear(); updateBoard() }} className="flex-1 py-1 text-sm border rounded bg-white">Clear Board</button>
                <button onClick={() => { game.current.reset(); updateBoard() }} className="flex-1 py-1 text-sm border rounded bg-white">Start Pos</button>
             </div>
          </div>
        )}

        {mode === 'RECORD' && (
           <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <h3 className="font-bold text-green-800 flex items-center gap-2"><Play size={16}/> Recording...</h3>
              <div className="bg-white p-3 rounded mt-2 font-mono text-sm min-h-[40px] shadow-inner">{moves.join(' ') || "Make moves..."}</div>
              <button onClick={() => { game.current.undo(); updateBoard(); setMoves(m => m.slice(0, -1)) }} className="mt-2 text-sm text-green-700 font-bold hover:underline flex items-center gap-1"><RotateCcw size={12}/> Undo Move</button>
           </div>
        )}

        <div className="pt-4 space-y-4">
           <input className="w-full border-2 border-gray-200 rounded p-3 font-bold" placeholder="Puzzle Title" value={title} onChange={e => setTitle(e.target.value)} />
           <div className="flex gap-2">
             <button onClick={toggleMode} className={`flex-1 py-3 rounded font-bold ${mode === 'SETUP' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>{mode === 'SETUP' ? 'Start Recording' : 'Back to Setup'}</button>
             <button onClick={savePuzzle} disabled={moves.length === 0} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded font-bold disabled:opacity-50">Save Puzzle</button>
           </div>
        </div>
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

  const onSquareRightClick = (square: string) => {
    if (!setupMode) {
       setSquares(prev => {
        const s = { ...prev }
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
          <button onClick={() => { setSetupMode(!setupMode); setSelectedTool(null) }} className={`w-full py-3 rounded font-bold flex items-center justify-center gap-2 transition-colors ${setupMode ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'}`}>
             <Settings size={16}/> {setupMode ? 'Exit Setup Mode' : 'Edit Board Position'}
          </button>
        </div>

        {setupMode && (
          <div className="border-t pt-4 animate-in fade-in slide-in-from-top-4">
             <p className="text-sm text-gray-500 mb-2">Select a piece to place:</p>
             <div className="flex flex-wrap gap-2 mb-2">
                {['p','n','b','r','q','k'].map(p => (
                   <button key={'w'+p} onClick={() => setSelectedTool({type: p, color: 'w'})} className={`w-8 h-8 border rounded flex items-center justify-center font-serif font-bold hover:bg-gray-100 ${selectedTool !== 'TRASH' && selectedTool?.type === p && selectedTool.color === 'w' ? 'bg-blue-100 border-blue-500 ring-1 ring-blue-500' : ''}`}>{p.toUpperCase()}</button>
                ))}
             </div>
             <div className="flex flex-wrap gap-2 mb-4">
                {['p','n','b','r','q','k'].map(p => (
                   <button key={'b'+p} onClick={() => setSelectedTool({type: p, color: 'b'})} className={`w-8 h-8 border rounded flex items-center justify-center font-serif font-bold bg-slate-800 text-white hover:bg-slate-700 ${selectedTool !== 'TRASH' && selectedTool?.type === p && selectedTool.color === 'b' ? 'ring-2 ring-blue-500' : ''}`}>{p.toUpperCase()}</button>
                ))}
             </div>
             <div className="flex gap-2">
                <button onClick={() => setSelectedTool('TRASH')} className={`flex-1 py-2 border border-red-200 text-red-600 rounded flex items-center justify-center gap-2 hover:bg-red-50 ${selectedTool === 'TRASH' ? 'bg-red-50 ring-1 ring-red-500' : ''}`}><Trash2 size={16}/> Remove</button>
                <button onClick={() => { game.current.clear(); updateBoard() }} className="flex-1 py-2 border rounded hover:bg-gray-50">Clear Board</button>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}