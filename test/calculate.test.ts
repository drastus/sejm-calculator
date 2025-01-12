import calculateMandates from '../src/mandates';

test('calculates correct results (1)', () => {
	const support = [35.38, 30.7, 14.4, 8.61, 7.16];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([194, 157, 65, 26, 18, 0]);
});

test('calculates correct results (2)', () => {
	const support = [43.59, 27,4, 6.28, 6.28, 15.36];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([235, 134, 18, 18, 55, 0]);
});

test('calculates correct results (3)', () => {
	const support = [36.16, 37.06, 6.91, 6.3, 12.08];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([171, 176, 30, 20, 63, 0]);
});
