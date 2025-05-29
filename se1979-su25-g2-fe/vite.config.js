import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇 Nếu thiếu plugin react hoặc vite dùng cấu hình sai, Tailwind sẽ không build đúng
export default defineConfig({
  plugins: [react()],
})
