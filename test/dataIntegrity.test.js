"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../src/data");
test('sum of voters across all constituencies equals 21596674', function () {
    var total = data_1.constituencies.reduce(function (sum, c) { return sum + c.votes; }, 0);
    expect(total).toBe(21596674);
});
//# sourceMappingURL=dataIntegrity.test.js.map