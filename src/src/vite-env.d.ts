/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_DEEPSEEK_API_KEY: string;
	readonly VITE_YANDEX_GPT_API_KEY: string;
	readonly VITE_YANDEX_GPT_FOLDER_ID: string;
	readonly VITE_OPENAI_API_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}