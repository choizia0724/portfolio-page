import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../assets/api'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Login() {
    const [username, setU] = useState('')
    const [password, setP] = useState('')
    const [err, setErr] = useState('')
    const nav = useNavigate()
    const { login } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault()
        setErr('')
        try {
            console.log('test')
            await api.post('/auth/login', { username, password }).then(x=>{
                console.log(x)
                login(x.data.token)
            })

            nav('/admin', { replace: true })
        } catch (e) {
            setErr('로그인 실패')
            // 디버깅 보조:
            console.error(e?.response?.status, e?.response?.data)
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-16 bg-white border rounded-xl p-6 shadow-sm">
            <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm mb-1">Username</label>
                    <input className="w-full border rounded px-3 py-2"
                           value={username} onChange={e=>setU(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm mb-1">Password</label>
                    <input type="password" className="w-full border rounded px-3 py-2"
                           value={password} onChange={e=>setP(e.target.value)} />
                </div>
                {err && <p className="text-red-500 text-sm">{err}</p>}
                <button className="w-full bg-black text-white rounded py-2">로그인</button>
            </form>
        </div>
    )
}
