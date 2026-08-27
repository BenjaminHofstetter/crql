import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    globals: true,
  },
  resolve: {
    alias: {
      '@rdf-query/crql-compiler': path.resolve(__dirname, './projects/crql-compiler/src/index.ts'),
      '@rdf-query/ngx-crql': path.resolve(__dirname, './projects/ngx-crql/src/index.ts')
    }
  }
});
