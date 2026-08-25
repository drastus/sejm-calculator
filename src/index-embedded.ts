import {
	calculate,
	generateTable,
	loadResultsFromUrl,
	clearInputs,
	clearResults,
} from './display';
import contentTemplate from './templates/content.pug';
import './styles/styles-embedded.css';

const applyCompact = (compact: boolean) => {
	const root = document.getElementById('root')!;
	root.innerHTML = contentTemplate({compact, embedded: true});
	const topBar = document.getElementById('topBar');
	if (topBar) topBar.style.display = compact ? 'none' : '';
	generateTable();
	loadResultsFromUrl();
	document
		.querySelector('#calculate-button')!
		.addEventListener('click', (event) => {
			event.preventDefault();
			calculate();
		});
};

document.addEventListener('DOMContentLoaded', () => {
	applyCompact(window.location.hash === '#embed');
});

window.addEventListener('hashchange', () => {
	applyCompact(window.location.hash === '#embed');
});

window.addEventListener('popstate', () => {
	if (window.location.search) {
		loadResultsFromUrl();
	} else {
		clearInputs();
		clearResults();
	}
});
