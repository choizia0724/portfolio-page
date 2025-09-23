import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import Login from './pages/Login'
import Admin from './pages/Admin'
import AdminEdit from './pages/AdminEdit'

const isAuthed = () => !!localStorage.getItem('token')
const Protected = ({ children }) => (isAuthed() ? children : <Navigate to="/login" replace />)

export default function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b bg-white">
                <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
                    <Link to="/" className="font-semibold">Portfolio</Link>
                    <div className="ml-auto flex items-center gap-3 text-sm">
                        {isAuthed() ? (
                            <>
                                <Link to="/admin" className="text-blue-600">Admin</Link>
                                <button className="px-2 py-1 border rounded"
                                        onClick={() => { localStorage.removeItem('token'); location.href='/' }}>
                                    Logout
                                </button>
                            </>
                        ) : <Link to="/login" className="px-2 py-1 border rounded">Login</Link>}
                    </div>
                </nav>
            </header>

            <main className="max-w-5xl mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<Protected><Admin /></Protected>} />
                    <Route path="/admin/edit/:id" element={<Protected><AdminEdit /></Protected>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    )
}
