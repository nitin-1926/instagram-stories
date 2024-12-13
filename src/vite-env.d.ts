/// <reference types="vite/client" />

declare module '*.css' {
	const classes: { [key: string]: string };
	export default classes;
}

// Update: 2024-12-13 20:00
