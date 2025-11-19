import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // .env.* 로드
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE,
          changeOrigin: true,
          secure: false,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log('[proxyReq]', req.method, req.url, '=>', options.target)
            })
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log('[proxyRes]', proxyRes.statusCode, req.method, req.url)
            })
            proxy.on('error', (err, req) => {
              console.error('[proxyError]', req.method, req.url, err?.message)
            })
          },
        },
      },
    },
  }
})
