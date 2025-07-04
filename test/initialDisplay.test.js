"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("@testing-library/dom");
require("@testing-library/jest-dom");
var display_1 = require("../src/display");
var data_1 = require("../src/data");
var content_pug_1 = __importDefault(require("../src/templates/content.pug"));
beforeEach(function () {
    document.body.innerHTML = (0, content_pug_1.default)();
    (0, display_1.generateTable)();
});
test('display number inputs for electoral data', function () {
    var numberOfCommitees = data_1.committees.length - 1;
    var numberInputs = dom_1.screen.getAllByRole('spinbutton');
    expect(numberInputs).toHaveLength(numberOfCommitees);
});
test('display button', function () {
    var button = dom_1.screen.getByRole('button');
    expect(button).toBeDefined();
});
//# sourceMappingURL=initialDisplay.test.js.map