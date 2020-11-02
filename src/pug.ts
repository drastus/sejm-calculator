declare module '*.pug' {
	import pug = require('pug');

	const content: pug.compileTemplate;
	export = content;
}
