"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mandates_1 = __importDefault(require("../src/mandates"));
test('calculates correct results (last election)', function () {
    var support = [35.38, 0, 30.7, 14.4, 0, 8.61, 0, 7.16, 0];
    var mandates = (0, mandates_1.default)(support);
    expect(mandates).toEqual([194, 0, 157, 65, 0, 26, 0, 18, 0, 0]);
});
test('calculates correct results (simulation 1)', function () {
    var support = [25, 0, 30, 5.5, 5.2, 6, 5.8, 10, 6];
    var mandates = (0, mandates_1.default)(support);
    expect(mandates).toEqual([158, 0, 180, 16, 5, 19, 15, 48, 19, 0]);
});
test('calculates correct results (simulation 2)', function () {
    var support = [39.7, 0, 42.4, 0, 0, 0, 7.2, 0];
    var mandates = (0, mandates_1.default)(support);
    expect(mandates).toEqual([223, 0, 216, 0, 0, 0, 21, 0, 0]);
});
//# sourceMappingURL=calculate.test.js.map