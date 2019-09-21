import Chartist from 'chartist';
import {committees} from './data';
import {calculateMandates} from './mandates';
import './styles.css';

const handleCalculateButtonClick = (event: Event) => {
	event.preventDefault();
	// clear charts

	const support = Array
		.from(document.querySelectorAll<HTMLInputElement>('#support-form input'))
		.map(input => parseFloat(input.value));
	if (!document.querySelector<HTMLFormElement>('#support-form')!.checkValidity()) return;
	const mandates = calculateMandates(support);

	const barChartData = {
		labels: committees.map(committee => committee.shortName).slice(0, -1),
		series: support,
	};
	const barChartOptions = {
		distributeSeries: true,
	};
	new Chartist.Bar('#support-bar-chart', barChartData, barChartOptions);

	const pieChartData = {
		series: mandates,
	};
	const pieChartOptions = {
		donut: true,
		donutWidth: 60,
		startAngle: 270,
		total: 460 * 2,
	};
	new Chartist.Pie('#division-pie-chart', pieChartData, pieChartOptions);
}

const bindActions = () => {
	document
		.querySelector('#calculate-button')!
		.addEventListener('click', handleCalculateButtonClick);
}

document.addEventListener('DOMContentLoaded', () => {
	bindActions();
});
