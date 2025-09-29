/**
 * @fileoverview
 * @path src/routes/guards.jsx
 * @author zia
 * @version 1.0.0 - 2025. 9. 30.
 * @copyright 2025,
 */

import { Navigate } from 'react-router-dom'
import { useAuth} from "../assets/AuthContext.jsx";

export function RequireAuth({ children }) {
    const { isAuth, loading } = useAuth()
    if (loading) return <p>인증 확인 중…</p>
    return isAuth ? children : <Navigate to="/login" replace />
}