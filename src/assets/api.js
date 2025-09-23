import axios from 'axios'
const baseURL = '/api'
export const api = axios.create({ baseURL })

const shouldSkipAuth = (url='') => url.includes('/auth/login')

api.interceptors.request.use(cfg => {
    if (!shouldSkipAuth(cfg.url)) {
        const t = localStorage.getItem('token')
        if (t) cfg.headers.Authorization = `Bearer ${t}`
    }
    console.log(cfg)
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
