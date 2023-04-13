import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	root: 'src/',
	build: {
		outDir: '../dist/',
	},
	plugins: [react()],
	server: {
		port: 1234,
		watch: { usePolling: true },
	}
})
