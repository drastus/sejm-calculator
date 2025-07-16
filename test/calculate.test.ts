import calculateMandates from '../src/mandates';

test('calculates correct results (last election)', () => {
	const support = [35.38, 30.7, 14.4, 0, 8.61, 0, 7.16, 0];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([194, 157, 65, 0, 26, 0, 18, 0, 0]);
});

test('calculates correct results (simulation 1)', () => {
	const support = [25, 30, 5.5, 5.2, 6, 5.8, 10, 6];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([158, 180, 16, 5, 19, 15, 48, 19, 0]);
});

test('calculates correct results (simulation 2)', () => {
	const support = [39.7, 42.4, 0, 0, 0, 7.2, 0];
	const mandates = calculateMandates(support);

	expect(mandates).toEqual([223, 216, 0, 0, 0, 21, 0, 0]);
});
