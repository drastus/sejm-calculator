import Chartist from 'chartist';
import {committees} from './data';
import {calculateMandates} from './mandates';
import './styles.css';

const handleCalculateButtonClick = (event: Event) => {
	event.preventDefault();

	const support = Array
		.from(document.querySelectorAll<HTMLInputElement>('#support-form input'))
		.map(input => parseFloat(input.value));
	const mandates = calculateMandates(support);

	const barChartData = {
		labels: committees.map(committee => committee.shortName),
		series: [support],
	};
	new Chartist.Bar('#support-bar-chart', barChartData);

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
