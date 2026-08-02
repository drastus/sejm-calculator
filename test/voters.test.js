"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mandates_1 = __importDefault(require("../src/mandates"));
var data_1 = require("../src/data");
var relativeTolerance = 0.001;
expect.extend({
    toBeWithinRelativeTolerance: function (received, expected, tolerance) {
        var relativeError = Math.abs(received - expected) / expected;
        var pass = relativeError < tolerance;
        return {
            pass: pass,
            message: function () {
                return "expected ".concat(received.toFixed(0), " to be within ").concat((tolerance * 100).toFixed(2), "% of ").concat(expected.toFixed(0), " (relative error: ").concat((relativeError * 100).toFixed(4), "%)");
            },
        };
    },
});
var totalVoters = data_1.constituencies.reduce(function (sum, c) { return sum + c.voters; }, 0);
var checkVoterDistribution = function (support) {
    (0, mandates_1.default)(support);
    var _loop_1 = function (i) {
        var simulatedTotal = data_1.constituencies.reduce(function (sum, c) { var _a, _b; return sum + (((_b = (_a = c.support) === null || _a === void 0 ? void 0 : _a[i]) !== null && _b !== void 0 ? _b : 0) / 100 * c.voters); }, 0);
        var expectedTotal = (support[i] / 100) * totalVoters;
        if (expectedTotal === 0) {
            expect(simulatedTotal).toBe(0);
        }
        else {
            expect(simulatedTotal).toBeWithinRelativeTolerance(expectedTotal, relativeTolerance);
        }
    };
    for (var i = 0; i < support.length; i++) {
        _loop_1(i);
    }
};
test('simulated voter support matches national support (last election)', function () {
    checkVoterDistribution([35.38, 30.7, 14.4, 0, 8.61, 0, 7.16, 0]);
});
test('simulated voter support matches national support (simulation 1)', function () {
    checkVoterDistribution([25, 30, 5.5, 5.2, 6, 5.8, 10, 6]);
});
test('simulated voter support matches national support (simulation 2)', function () {
    checkVoterDistribution([39.7, 42.4, 0, 0, 0, 7.2, 0]);
});
//# sourceMappingURL=voters.test.js.map