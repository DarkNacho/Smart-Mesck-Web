/// <reference types="vite/client" />


interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
// declarations.d.ts

// Añade esta declaración para permitir que TypeScript reconozca LForms como una propiedad en window
    interface Window {
      LForms: any; // O el tipo específico que debería tener LForms
    }
  
  