import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	envPrefix: ['VITE_'],
	build: {
		outDir: 'build',
	},
	test: {
		environment: 'jsdom',
		setupFiles: './src/setupTests.js',
		css: true,
	},
});
