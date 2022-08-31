import {
	calculate,
	generateTable,
	loadResultsFromUrl,
	clearInputs,
	clearResults,
} from './display';

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
