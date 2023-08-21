import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {generateTable} from '../src/display';
import {committees} from '../src/data';
import html from '../src/templates/content.pug';

beforeEach(() => {
	document.body.innerHTML = html();
	generateTable();
});

test('display number inputs for electoral data', () => {
	const numberOfCommitees = committees.length - 1;

	const numberInputs = screen.getAllByRole('spinbutton');
	expect(numberInputs).toHaveLength(numberOfCommitees);
});

test('display button', () => {
	const button = screen.getByRole('button');
	expect(button).toBeDefined();
});
