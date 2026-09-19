import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { realpathSync } from 'node:fs';

const secteiComponents = fileURLToPath(new URL('../sectei-components', import.meta.url));
let secteiResolved = secteiComponents;
try {
  secteiResolved = realpathSync(secteiComponents);
} catch {
  /* symlink may be missing in some setups */
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 4200,
    strictPort: true,
    fs: {
      allow: ['.', secteiComponents, secteiResolved],
    },
  },
});
