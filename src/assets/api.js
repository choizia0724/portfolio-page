import axios from 'axios'
const baseURL = '/proxy'
export const api = axios.create({ baseURL })

api.interceptors.request.use(cfg => {
    const t = localStorage.getItem('token')
    if (t) cfg.headers.Authorization = `Bearer ${t}`
    return cfg
})

api.interceptors.response.use(
    r => r,
    e => {
        if (e?.response?.status === 401) {
            localStorage.removeItem('token')
            if (location.pathname !== '/login') location.href = '/login'
        }
        return Promise.reject(e)
    }
)
