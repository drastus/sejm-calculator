import Chartist from 'chartist';
import {Constituency, committees, constituencies, pastSupport} from './data';
import './styles.css';

const calculateLocalSupport = (
	support: number[],
	pastSupportProjection: number[],
	constituency: Constituency,
): number[] => {
	const localPastSupport = constituency.pastSupport;
	const localPastSupportProjection = support.map((committeeSupport, index) => (
		committees[index].pastSupportEquivalence
			.map(pastCommitteeId => localPastSupport[pastCommitteeId])
			.reduce((a, b) => a + b, 0)
	));
	const localSupportDeviation = pastSupportProjection
		.map((pastCommitteSupportProjection, index) => (
			localPastSupportProjection[index] / pastCommitteSupportProjection
		)
	);
	const localSupport = support.map((committeeSupport, index) => (
		committeeSupport * localSupportDeviation[index]
	));
	return localSupport;
}

const calculateMandates = (support: number[]): number[] => {
	const pastSupportProjection = support.map((committeeSupport, index) => (
		committees[index].pastSupportEquivalence
			.map(pastCommitteeId => pastSupport[pastCommitteeId])
			.reduce((a, b) => a + b, 0)
	));
	const mandates: number[] = new Array(support.length).fill(0);
	constituencies.forEach(constituency => {
		const localSupport = calculateLocalSupport(support, pastSupportProjection, constituency);
		constituency.support = localSupport;
		constituency.mandates = new Array(support.length).fill(0);
		const filteredLocalSupport = localSupport.map((localCommitteeSupport, index) => {
			if (support[index] < committees[index].threshold) return 0;
			return localCommitteeSupport;
		});
		const quotients: {quotient: number; committeeIndex: number}[] = [];
		for (let divisor = 1; divisor <= constituency.size; divisor++) {
			for (let committeeIndex = 0; committeeIndex < localSupport.length; committeeIndex++) {
				quotients.push({
					quotient: filteredLocalSupport[committeeIndex] / divisor,
					committeeIndex,
				});
			}
		}
		quotients.sort((a, b) => b.quotient - a.quotient);
		quotients.slice(0, constituency.size).forEach(quotient => {
			mandates[quotient.committeeIndex]++;
			constituency.mandates![quotient.committeeIndex]++;
		});
	});
	return mandates;
}

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
