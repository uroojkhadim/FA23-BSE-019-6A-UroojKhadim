/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
