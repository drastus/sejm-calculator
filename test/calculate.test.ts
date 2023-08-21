import calculateMandates from '../src/mandates';

test('calculates correct results (1)', () => {
	const support = [43.59, 27.4, 12.56, 8.55, 6.81];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([237, 133, 48, 31, 10, 1]);
});

test('calculates correct results (2)', () => {
	const support = [30, 25, 10, 20, 6];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([176, 131, 39, 104, 9, 1]);
});

test('calculates correct results (3)', () => {
	const support = [39.7, 42.4, 0, 0, 7.2];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([225, 216, 0, 0, 18, 1]);
});
