/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GAME_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
