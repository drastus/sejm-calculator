import calculateMandates from '../src/mandates';

test('calculates correct results (1)', () => {
	const support = [43.59, 27.4, 12.56, 8.55, 6.81, 0];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([235, 134, 49, 30, 11, 0, 1]);
});

test('calculates correct results (2)', () => {
	const support = [30, 25, 10, 8, 6, 12];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([182, 133, 40, 34, 12, 58, 1]);
});
