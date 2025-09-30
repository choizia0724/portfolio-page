/**
 * @fileoverview
 * @path /src/routes/RequireAuth.jsx
 * @author zia
 * @version 1.0.0 - 2025. 10. 1.
 * @copyright 2025,
 */

// src/routes/RequireAuth.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RequireAuth({ children }) {
    const { isAuth, loading } = useAuth()
    if (loading) return <p>인증 확인 중…</p>
    return isAuth ? children : <Navigate to="/login" replace />
}
