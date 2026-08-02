import calculateMandates from '../src/mandates';

test('calculates correct results (last election)', () => {
	const support = [30.7, 7.16, 0, 8.61, 0, 14.4, 0, 35.38, 0];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([157, 18, 0, 26, 0, 65, 0, 194, 0, 0]);
});

test('calculates correct results (simulation 1)', () => {
	const support = [30, 10, 6, 6, 5.8, 5.5, 5.2, 25, 0];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([180, 48, 19, 19, 15, 16, 5, 158, 0, 0]);
});

test('calculates correct results (simulation 2)', () => {
	const support = [42.4, 0, 0, 0, 7.2, 0, 0, 39.7, 0];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([216, 0, 0, 0, 21, 0, 0, 223, 0, 0]);
});
