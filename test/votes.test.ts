import calculateMandates from '../src/mandates';
import {constituencies} from '../src/data';

const relativeTolerance = 0.001; // 0.1%

expect.extend({
	toBeWithinRelativeTolerance(received: number, expected: number, tolerance: number) {
		const relativeError = Math.abs(received - expected) / expected;
		const pass = relativeError < tolerance;
		return {
			pass,
			message: () =>
				`expected ${received.toFixed(0)} to be within ${(tolerance * 100).toFixed(2)}% of ${expected.toFixed(0)} (relative error: ${(relativeError * 100).toFixed(4)}%)`,
		};
	},
});

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace jest {
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface Matchers<R> {
			toBeWithinRelativeTolerance(expected: number, tolerance: number): R,
		}
	}
}

const totalVotes = constituencies.reduce((sum, c) => sum + c.votes, 0);

const checkVoteDistribution = (support: number[]) => {
	calculateMandates(support);

	for (let i = 0; i < support.length; i++) {
		const simulatedTotal = constituencies.reduce(
			(sum, c) => sum + ((c.support?.[i] ?? 0) / 100 * c.votes),
			0,
		);
		const expectedTotal = (support[i] / 100) * totalVotes;

		if (expectedTotal === 0) {
			expect(simulatedTotal).toBe(0);
		} else {
			expect(simulatedTotal).toBeWithinRelativeTolerance(expectedTotal, relativeTolerance);
		}
	}
};

test('simulated vote distribution matches national support (last election)', () => {
	checkVoteDistribution([35.38, 30.7, 14.4, 0, 8.61, 0, 7.16, 0]);
});

test('simulated vote distribution matches national support (simulation 1)', () => {
	checkVoteDistribution([25, 30, 5.5, 5.2, 6, 5.8, 10, 6]);
});

test('simulated vote distribution matches national support (simulation 2)', () => {
	checkVoteDistribution([39.7, 42.4, 0, 0, 0, 7.2, 0]);
});
