import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: true,
    port: 5173,
    allowedHosts: ["851d70f52f38.ngrok-free.app"]
  }
})
