import Chartist, {ChartistStatic} from 'chartist';
import {committees} from './data';
import {calculateMandates} from './mandates';
import './styles.css';

const clearResults = (bar: ChartistStatic['Bar'], pie: ChartistStatic['Pie']) => {
	bar.detach();
	document.getElementById('support-bar-chart')!.innerHTML = '';
	pie.detach();
	document.getElementById('division-pie-chart')!.innerHTML = '';
	document.querySelectorAll<HTMLTableDataCellElement>(`tr td:last-child`).forEach(td => {
		td.innerHTML = '';
	});
}

const handleCalculateButtonClick = (event: Event) => {
	event.preventDefault();

	const inputs = document.querySelectorAll<HTMLInputElement>('#support-form input');
	const support = Array
		.from(inputs)
		.map(input => parseFloat(input.value));
	if (!document.querySelector<HTMLFormElement>('#support-form')!.checkValidity()) return;
	const mandates = calculateMandates(support);

	mandates.forEach((value, index) => {
		const committeeId = committees[index].id;
		const td = document.querySelector<HTMLTableDataCellElement>(`tr.${committeeId} td:last-child`);
		if (td) td.textContent = value.toString();
	});

	const barChartData = {
		labels: committees.map(committee => committee.shortName).slice(0, -1),
		series: support,
	};
	const barChartOptions = {
		distributeSeries: true,
	};
	const bar = new Chartist.Bar('#support-bar-chart', barChartData, barChartOptions);

	const pieChartData = {
		series: mandates,
	};
	const pieChartOptions = {
		donut: true,
		donutWidth: 60,
		startAngle: 270,
		total: 460 * 2,
	};
	const pie = new Chartist.Pie('#division-pie-chart', pieChartData, pieChartOptions);

	inputs.forEach(input => input.addEventListener('input', () => {
		clearResults(bar, pie);
	}))
}

const bindActions = () => {
	document
		.querySelector('#calculate-button')!
		.addEventListener('click', handleCalculateButtonClick);
}

document.addEventListener('DOMContentLoaded', () => {
	bindActions();
});
