import calculateMandates from '../src/mandates';

test('calculates correct results (1)', () => {
	const support = [35.38, 30.7, 14.4, 8.61, 7.16];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([194, 157, 65, 26, 18, 0]);
});

test('calculates correct results (2)', () => {
	const support = [30, 25, 20, 10, 6];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([176, 130, 103, 39, 12, 0]);
});

test('calculates correct results (3)', () => {
	const support = [39.7, 42.4, 0, 0, 7.2];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([223, 219, 0, 0, 18, 0]);
});
