import {BarChart, PieChart} from 'chartist';
import {benchSort, committees, constituencies} from './data';
import calculateMandates from './mandates';
import constituencyTemplate from './templates/constituency.pug';
import tableTemplate from './templates/table.pug';
import './styles/styles.css';

const {location} = window;

let barChart: BarChart | null = null;
let pieChart: PieChart | null = null;

export const clearInputs = (): void => {
	const inputs = document.querySelectorAll<HTMLInputElement>('tr td:nth-child(2) input');
	inputs.forEach((input) => {
		input.value = '';
	});
};

export const clearResults = (): void => {
	document.querySelectorAll<HTMLTableCellElement>('tr td:last-child').forEach((td) => {
		td.innerHTML = '';
	});
	if (barChart) barChart.detach();
	if (pieChart) pieChart.detach();
	const urlContainer = document.getElementById('url');
	if (urlContainer) urlContainer.innerHTML = '';
	document.getElementById('support-bar-chart')!.innerHTML = '';
	document.getElementById('division-pie-chart')!.innerHTML = '';
	const constituencyResultContainer = document.getElementById('constituency-results');
	if (constituencyResultContainer) constituencyResultContainer.innerHTML = '';
	if (location.search) {
		const urlWithoutSearchString = location.href.split('?')[0];
		window.history.pushState('', '', urlWithoutSearchString);
	}
};

const displayResults = (mandates: number[]) => {
	mandates.forEach((value, index) => {
		const committeeId = committees[index].id;
		const td = document.querySelector<HTMLTableCellElement>(`tr.${committeeId} td:last-child`);
		if (td) td.textContent = value.toString();
	});
};

const displayUrl = (support: number[]) => {
	const container = document.getElementById('url');
	if (container) {
		const searchParams = new URLSearchParams();
		support.forEach((s, i) => {
			if (s > 0) searchParams.append(committees[i].id, s.toString());
		});
		const urlWithoutSearchString = location.href.split('?')[0];
		const url = `${urlWithoutSearchString}?${searchParams}`;
		document.getElementById('url')!.innerHTML = `Link do wyników: ${url.link(url)}`;
	}
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
		axisY: {
			labelInterpolationFnc: (value: number) => `${value.toLocaleString('pl', {
				minimumFractionDigits: 0,
				maximumFractionDigits: 1,
			})}%`,
		},
	};
	document.getElementById('support-bar-chart')!.classList.add('ct-perfect-fourth');
	const chart = new BarChart('#support-bar-chart', chartData, chartOptions);
	chart.on<'draw'>('draw', (data) => {
		if (data.type === 'bar') {
			data.element.attr({
				style: 'stroke-width: 30px',
			});
		}
	});
	return chart;
};

const displayPieChart = (mandates: number[]) => {
	const commiteesWithMandates = committees
		.map((c, i) => ({
			id: c.id,
			label: c.shortName,
			mandates: {value: mandates[i], className: c.id},
		}))
		.filter((m) => m.mandates.value && m.mandates.value > 0);
	commiteesWithMandates.sort((a, b) => (benchSort.indexOf(a.id) > benchSort.indexOf(b.id) ? 1 : -1));
	const chartData = {
		series: commiteesWithMandates.map((sm) => sm.mandates),
	};
	const chartOptions = {
		donut: true,
		donutWidth: 60,
		startAngle: 270,
		total: 460 * 2,
		labelInterpolationFnc: (value: number, index: number) => (
			value < 15 ? '' : `${commiteesWithMandates[index].label} ${value}`
		),
	};
	document.getElementById('division-pie-chart')!.classList.add('ct-perfect-fourth');
	return new PieChart('#division-pie-chart', chartData, chartOptions);
};

const displayConstituencyResults = () => {
	const container = document.getElementById('constituency-results');
	if (container) {
		constituencies.forEach((constituency, constituenyIndex) => {
			const data = (constituency.mandates && constituency.support)
				? constituency.mandates.map((mandates, committeeIndex) => ({
					committee: committees[committeeIndex].name,
					support: (constituency.support as number[])[committeeIndex],
					mandates,
				}))
				: [];
			data.sort((a, b) => b.support - a.support);
			container.insertAdjacentHTML('beforeend', constituencyTemplate({
				number: constituenyIndex + 1,
				name: constituency.name,
				size: constituency.size,
				data,
			}));
		});
	}
};

const validate = (form: HTMLFormElement, inputs: NodeListOf<HTMLInputElement>, support: number[]) => {
	inputs.forEach((input) => input.setCustomValidity(''));

	support.some((inputValue, index) => {
		if (inputValue < 0) {
			inputs[index].setCustomValidity('Poparcie nie może byc mniejsze od 0%');
			return true;
		}
		return false;
	});

	const supportSum = support.reduce((a, b) => a + b, 0);
	if (supportSum > 100) {
		inputs[0].setCustomValidity('Suma poparcia nie może przekraczać 100%');
	} else if (supportSum <= 0) {
		inputs[0].setCustomValidity('Suma poparcia musi być wyższa niż 0%');
	}

	return form.reportValidity();
};

export const calculate = (): void => {
	const form = document.querySelector<HTMLFormElement>('#support-form')!;
	const inputs = document.querySelectorAll<HTMLInputElement>('#support-form input');
	const support = Array
		.from(inputs)
		.map((input) => parseFloat(input.value))
		.map((value) => (Number.isNaN(value) ? 0 : value));

	if (!validate(form, inputs, support)) return;

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
