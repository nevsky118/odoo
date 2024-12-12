/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}