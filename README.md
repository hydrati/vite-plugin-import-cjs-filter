# Import Cjs Filter

```ts
import importFilter from 'vite-plugin-import-cjs-filter';
import { defineConfig } from 'vite';
export default defineConfig({
    plugins: [importFilter({
        include: [
            "electron",
            "dev" /* Link `devDependencies` */],
        exclude: [],
        force: true /* Resolve All `Browser External` */
    })]
    // .....
});
```