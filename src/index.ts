import {
	calculate,
	generateTable,
	loadResultsFromUrl,
	clearInputs,
	clearResults,
} from './display';
import contentTemplate from './templates/content.pug';

const loadContent = () => {
	document.body.innerHTML = contentTemplate({
		embed: window.location.hash === '#embed',
	});
};

const handleCalculateButtonClick = (event: Event) => {
	event.preventDefault();
	calculate();
};

export const bindActions = (): void => {
	document
		.querySelector('#calculate-button')!
		.addEventListener('click', handleCalculateButtonClick);
};

document.addEventListener('DOMContentLoaded', () => {
	loadContent();
	generateTable();
	loadResultsFromUrl();
	bindActions();
});

window.addEventListener('popstate', () => {
	if (window.location.search) {
		loadResultsFromUrl();
	} else {
		clearInputs();
		clearResults();
	}
});

window.addEventListener('hashchange', () => {
	loadContent();
	generateTable();
	loadResultsFromUrl();
});
