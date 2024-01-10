declare module '*.pug' {
	import type pug from 'pug';

	const content: pug.compileTemplate;
	export = content;
}
