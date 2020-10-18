import Chartist, {ChartistStatic, IChartistSvg} from 'chartist';
import {committees, constituencies} from './data';
import {calculateMandates} from './mandates';
import constituencyTemplate from './templates/constituency.pug';
import tableTemplate from './templates/table.pug';
import './styles/styles.css';

const clearResults = (bar: ChartistStatic['Bar'], pie: ChartistStatic['Pie']) => {
	document.querySelectorAll<HTMLTableDataCellElement>('tr td:last-child').forEach((td) => {
		td.innerHTML = '';
	});
	bar.detach();
	pie.detach();
	document.getElementById('support-bar-chart')!.innerHTML = '';
	document.getElementById('division-pie-chart')!.innerHTML = '';
	document.getElementById('constituency-results')!.innerHTML = '';
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

const handleCalculateButtonClick = (event: Event) => {
	event.preventDefault();

	const inputs = document.querySelectorAll<HTMLInputElement>('#support-form input');
	const support = Array
		.from(inputs)
		.map((input) => parseFloat(input.value))
		.map((value) => (Number.isNaN(value) ? 0 : value));
	if (support.reduce((a, b) => a + b, 0) > 100) {
		inputs.forEach((input) => input.setCustomValidity('Suma poparcia nie może przekraczać 100%'));
		return;
	} else {
		inputs.forEach((input) => input.setCustomValidity(''));
	}
	if (!document.querySelector<HTMLFormElement>('#support-form')!.checkValidity()) return;
	const mandates = calculateMandates(support);

	mandates.forEach((value, index) => {
		const committeeId = committees[index].id;
		const td = document.querySelector<HTMLTableDataCellElement>(`tr.${committeeId} td:last-child`);
		if (td) td.textContent = value.toString();
	});

	const barChartData = {
		labels: committees.map((committee) => committee.shortName).slice(0, -1),
		series: support,
	};
	const barChartOptions = {
		distributeSeries: true,
	};
	const bar = new Chartist.Bar('#support-bar-chart', barChartData, barChartOptions);
	bar.on('draw', (data: {type: string; element: IChartistSvg}) => {
		if (data.type === 'bar') {
			data.element.attr({
				style: 'stroke-width: 30px',
			});
		}
	});

	const pieChartData = {
		series: mandates,
	};
	const pieChartOptions = {
		donut: true,
		donutWidth: 60,
		startAngle: 270,
		total: 460 * 2,
		labelInterpolationFnc: (value: number) => {
			return value < 15 ? '' : String(value);
		},
	};
	const pie = new Chartist.Pie('#division-pie-chart', pieChartData, pieChartOptions);

	displayConstituencyResults();

	inputs.forEach((input) => input.addEventListener('input', () => {
		clearResults(bar, pie);
	}));
};

const generateTable = () => {
	const form = document.getElementById('support-form');
	form!.insertAdjacentHTML('afterbegin', tableTemplate({
		committees,
	}));
};

const bindActions = () => {
	document
		.querySelector('#calculate-button')!
		.addEventListener('click', handleCalculateButtonClick);
};

document.addEventListener('DOMContentLoaded', () => {
	generateTable();
	bindActions();
});
