import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // .env.* 로드
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/proxy': {
          target: 'http://129.154.194.75:30010/api',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
