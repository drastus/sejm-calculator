import Chartist, {ChartistStatic, IChartistSvg} from 'chartist';
import {committees, constituencies} from './data';
import calculateMandates from './mandates';
import constituencyTemplate from './templates/constituency.pug';
import tableTemplate from './templates/table.pug';
import './styles/styles.css';

const {location} = window;

let barChart: ChartistStatic['Bar'];
let pieChart: ChartistStatic['Pie'];

export const clearInputs = (): void => {
	const inputs = document.querySelectorAll<HTMLInputElement>('tr td:nth-child(2) input');
	inputs.forEach((input) => {
		input.value = '';
	});
};

export const clearResults = (): void => {
	document.querySelectorAll<HTMLTableDataCellElement>('tr td:last-child').forEach((td) => {
		td.innerHTML = '';
	});
	barChart.detach();
	pieChart.detach();
	document.getElementById('url')!.innerHTML = '';
	document.getElementById('support-bar-chart')!.innerHTML = '';
	document.getElementById('division-pie-chart')!.innerHTML = '';
	document.getElementById('constituency-results')!.innerHTML = '';
	if (location.search) {
		const urlWithoutSearchString = location.href.split('?')[0];
		window.history.pushState('', '', urlWithoutSearchString);
	}
};

const displayResults = (mandates: number[]) => {
	mandates.forEach((value, index) => {
		const committeeId = committees[index].id;
		const td = document.querySelector<HTMLTableDataCellElement>(`tr.${committeeId} td:last-child`);
		if (td) td.textContent = value.toString();
	});
};

const displayUrl = (support: number[]) => {
	const searchParams = new URLSearchParams();
	support.forEach((s, i) => {
		if (s > 0) searchParams.append(committees[i].id, s.toString());
	});
	const urlWithoutSearchString = location.href.split('?')[0];
	const url = `${urlWithoutSearchString}?${searchParams}`;
	document.getElementById('url')!.innerHTML = `Link do wyników: ${url.link(url)}`;
};

const displayBarChart = (support: number[]) => {
	const sortedSupport = committees
		.map((c, i) => ({
			label: c.shortName,
			support: {value: support[i], className: c.id},
		}))
		.filter((s) => s.support.value && s.support.value > 0)
		.sort((a, b) => b.support.value - a.support.value);
	const chartData = {
		labels: sortedSupport.map((ss) => ss.label),
		series: sortedSupport.map((ss) => ss.support),
	};
	const chartOptions = {
		distributeSeries: true,
	};
	const chart = new Chartist.Bar('#support-bar-chart', chartData, chartOptions);
	chart.on('draw', (data: {type: string; element: IChartistSvg}) => {
		if (data.type === 'bar') {
			data.element.attr({
				style: 'stroke-width: 30px',
			});
		}
	});
	return chart;
};

const displayPieChart = (mandates: number[]) => {
	const sortedMandates = committees
		.map((c, i) => ({
			label: c.shortName,
			mandates: {value: mandates[i], className: c.id},
		}))
		.filter((m) => m.mandates.value && m.mandates.value > 0)
		.sort((a, b) => b.mandates.value - a.mandates.value);
	const chartData = {
		series: sortedMandates.map((sm) => sm.mandates),
	};
	const chartOptions = {
		donut: true,
		donutWidth: 60,
		startAngle: 270,
		total: 460 * 2,
		labelInterpolationFnc: (value: number, index: number) => (
			value < 15 ? '' : `${sortedMandates[index].label} ${value}`
		),
	};
	return new Chartist.Pie('#division-pie-chart', chartData, chartOptions);
};

const displayConstituencyResults = () => {
	const container = document.getElementById('constituency-results');
	constituencies.forEach((constituency, constituenyIndex) => {
		const data = (constituency.mandates && constituency.support)
			? constituency.mandates.map((mandates, committeeIndex) => ({
				committee: committees[committeeIndex].name,
				support: (constituency.support as number[])[committeeIndex],
				mandates,
			}))
			: [];
		data.sort((a, b) => b.support - a.support);
		container!.insertAdjacentHTML('beforeend', constituencyTemplate({
			number: constituenyIndex + 1,
			name: constituency.name,
			size: constituency.size,
			data,
		}));
	});
};

const validate = (inputs: NodeListOf<HTMLInputElement>, support: number[]) => {
	const supportSum = support.reduce((a, b) => a + b, 0);
	if (supportSum > 100) {
		inputs.forEach((input) => input.setCustomValidity('Suma poparcia nie może przekraczać 100%'));
		return false;
	}
	if (supportSum <= 0) {
		inputs.forEach((input) => input.setCustomValidity('Suma poparcia musi być wyższa niż 0%'));
		return false;
	}
	inputs.forEach((input) => input.setCustomValidity(''));

	return document.querySelector<HTMLFormElement>('#support-form')!.checkValidity();
};

export const calculate = (): void => {
	const inputs = document.querySelectorAll<HTMLInputElement>('#support-form input');
	const support = Array
		.from(inputs)
		.map((input) => parseFloat(input.value))
		.map((value) => (Number.isNaN(value) ? 0 : value));

	if (!validate(inputs, support)) return;

	const mandates = calculateMandates(support);

	displayResults(mandates);

	displayUrl(support);

	barChart = displayBarChart(support);

	pieChart = displayPieChart(mandates);

	displayConstituencyResults();

	inputs.forEach((input) => input.addEventListener('input', () => {
		clearResults();
	}));
};

export const generateTable = (): void => {
	const form: HTMLElement = document.getElementById('support-form')!;
	form.insertAdjacentHTML('afterbegin', tableTemplate({
		committees,
	}));
};

export const loadResultsFromUrl = (): void => {
	if (location.search) {
		const searchParams = new URLSearchParams(location.search);
		searchParams.forEach((value, key) => {
			const input = document.querySelector<HTMLInputElement>(`tr.${key} td:nth-child(2) input`);
			if (input) input.value = value;
		});
		calculate();
	}
};
