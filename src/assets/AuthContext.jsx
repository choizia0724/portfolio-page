// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setJwt]   = useState(null)
    const [user, setUser]   = useState(null)
    const [isAuth, setAuth] = useState(false)
    const [loading, setLoad]= useState(true)

    const logout = useCallback(() => {
        localStorage.removeItem('token')
        setJwt(null); setUser(null); setAuth(false)
    }, [])

    const verify = useCallback(async () => {
        try {
            const res = await api.get('/auth/verify')
            setUser(res.data)
            setAuth(true)
            return true
        } catch {
            logout()
            return false
        }
    }, [logout])

    const login = useCallback(async (jwt) => {
        localStorage.setItem('token', jwt)
        setJwt(jwt)
        await verify()
    }, [verify])

    useEffect(() => {
        const t = localStorage.getItem('token')
        if (t) setJwt(t);
        (async () => { if (t) await verify(); setLoad(false) })()

        const onStorage = async (e) => {
            if (e.key === 'token') {
                const token = localStorage.getItem('token')
                setJwt(token)
                if (token) await verify(); else logout()
            }
        }
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [verify, logout])

    return (
        <AuthContext.Provider value={{ isAuth, user, token, login, logout, verify, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
