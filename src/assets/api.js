// src/assets/api.js
import axios from 'axios'
export const api = axios.create({ baseURL: '/api', headers: { 'Content-Type':'application/json' } })

api.interceptors.request.use(cfg => {
    if (!cfg.url?.includes('/auth/login')) {
        const t = localStorage.getItem('token')
        console.log(t)
        if (t) cfg.headers.Authorization = `Bearer ${t}`
        console.log(cfg)
    }
    return cfg
})

api.interceptors.response.use(
    r => r,
    e => {
        if (e?.response?.status === 401) {
            localStorage.removeItem('token')
            if (location.pathname !== '/login') alert('세션이 만료되었습니다. 다시 로그인해주세요.')
            if (location.pathname !== '/login') location.href = '/login'
        }
        return Promise.reject(e)
    }
)
