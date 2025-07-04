"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mandates_1 = __importDefault(require("../src/mandates"));
test('calculates correct results (1)', function () {
    var support = [35.38, 30.7, 14.4, 8.61, 7.16];
    var mandates = (0, mandates_1.default)(support);
    expect(mandates).toEqual([194, 157, 65, 26, 18, 0]);
});
test('calculates correct results (2)', function () {
    var support = [30, 25, 20, 10, 6];
    var mandates = (0, mandates_1.default)(support);
    expect(mandates).toEqual([176, 130, 103, 39, 12, 0]);
});
test('calculates correct results (3)', function () {
    var support = [39.7, 42.4, 0, 0, 7.2];
    var mandates = (0, mandates_1.default)(support);
    expect(mandates).toEqual([223, 219, 0, 0, 18, 0]);
});
//# sourceMappingURL=calculate.test.js.map