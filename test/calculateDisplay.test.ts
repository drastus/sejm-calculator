import {
	configure, fireEvent, screen, waitFor,
} from '@testing-library/dom';
import '@testing-library/jest-dom';
import './matchMedia.mock';
import {generateTable} from '../src/display';
import {bindActions} from '../src/index';
import html from '../src/templates/content.pug';

configure({
	testIdAttribute: 'id',
});

beforeEach(() => {
	document.body.innerHTML = html();
	generateTable();
	bindActions();
});

test('validate total support higher than 0', async () => {
	const button = screen.getByRole('button');
	fireEvent.click(button);
	const firstNumberInput = screen.getAllByRole('spinbutton')[0];

	await waitFor(() => expect(firstNumberInput).toBeInvalid());
	await waitFor(() => expect(screen.getByTestId('support-bar-chart')).toBeEmptyDOMElement());
	await waitFor(() => expect(screen.getByTestId('division-pie-chart')).toBeEmptyDOMElement());
});

test('validate total support not higher than 100', async () => {
	const numberInputs = screen.getAllByRole('spinbutton');
	const firstNumberInput = numberInputs[0];
	const secondNumberInput = numberInputs[1];
	(firstNumberInput as HTMLInputElement).value = '60';
	(secondNumberInput as HTMLInputElement).value = '45';
	fireEvent.click(screen.getByRole('button'));

	await waitFor(() => expect(firstNumberInput).toBeInvalid());
	await waitFor(() => expect(screen.getByTestId('support-bar-chart')).toBeEmptyDOMElement());
	await waitFor(() => expect(screen.getByTestId('division-pie-chart')).toBeEmptyDOMElement());
});

test('validate support not less than 0', async () => {
	const numberInputs = screen.getAllByRole('spinbutton');
	const firstNumberInput = numberInputs[0];
	const secondNumberInput = numberInputs[1];
	(firstNumberInput as HTMLInputElement).value = '30';
	(secondNumberInput as HTMLInputElement).value = '-25';
	fireEvent.click(screen.getByRole('button'));

	await waitFor(() => expect(firstNumberInput).toBeValid());
	await waitFor(() => expect(secondNumberInput).toBeInvalid());
	await waitFor(() => expect(screen.getByTestId('support-bar-chart')).toBeEmptyDOMElement());
	await waitFor(() => expect(screen.getByTestId('division-pie-chart')).toBeEmptyDOMElement());
});

test('displays results', async () => {
	const numberInputs = screen.getAllByRole('spinbutton');
	const firstNumberInput = numberInputs[0];
	const secondNumberInput = numberInputs[1];
	(firstNumberInput as HTMLInputElement).value = '30';
	(secondNumberInput as HTMLInputElement).value = '25';
	const button = screen.getByRole('button');
	fireEvent.click(button);

	await waitFor(() => expect(firstNumberInput).toBeValid());
	await waitFor(() => expect(secondNumberInput).toBeValid());
	await waitFor(() => expect(screen.getByTestId('support-bar-chart')).not.toBeEmptyDOMElement());
	await waitFor(() => expect(screen.getByTestId('division-pie-chart')).not.toBeEmptyDOMElement());
});
