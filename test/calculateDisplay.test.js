"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("@testing-library/dom");
require("@testing-library/jest-dom");
require("./matchMedia.mock");
var display_1 = require("../src/display");
var index_1 = require("../src/index");
var content_pug_1 = __importDefault(require("../src/templates/content.pug"));
(0, dom_1.configure)({
    testIdAttribute: 'id',
});
beforeEach(function () {
    document.body.innerHTML = (0, content_pug_1.default)();
    (0, display_1.generateTable)();
    (0, index_1.bindActions)();
});
test('validate total support higher than 0', function () { return __awaiter(void 0, void 0, void 0, function () {
    var button, firstNumberInput;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                button = dom_1.screen.getByRole('button');
                dom_1.fireEvent.click(button);
                firstNumberInput = dom_1.screen.getAllByRole('spinbutton')[0];
                return [4, (0, dom_1.waitFor)(function () { return expect(firstNumberInput).toBeInvalid(); })];
            case 1:
                _a.sent();
                return [4, (0, dom_1.waitFor)(function () { return expect(dom_1.screen.getByTestId('support-bar-chart')).toBeEmptyDOMElement(); })];
            case 2:
                _a.sent();
                return [4, (0, dom_1.waitFor)(function () { return expect(dom_1.screen.getByTestId('division-pie-chart')).toBeEmptyDOMElement(); })];
            case 3:
                _a.sent();
                return [2];
        }
    });
}); });
test('validate total support not higher than 100', function () { return __awaiter(void 0, void 0, void 0, function () {
    var numberInputs, firstNumberInput, secondNumberInput;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                numberInputs = dom_1.screen.getAllByRole('spinbutton');
                firstNumberInput = numberInputs[0];
                secondNumberInput = numberInputs[1];
                firstNumberInput.value = '60';
                secondNumberInput.value = '45';
                dom_1.fireEvent.click(dom_1.screen.getByRole('button'));
                return [4, (0, dom_1.waitFor)(function () { return expect(firstNumberInput).toBeInvalid(); })];
            case 1:
                _a.sent();
                return [4, (0, dom_1.waitFor)(function () { return expect(dom_1.screen.getByTestId('support-bar-chart')).toBeEmptyDOMElement(); })];
            case 2:
                _a.sent();
                return [4, (0, dom_1.waitFor)(function () { return expect(dom_1.screen.getByTestId('division-pie-chart')).toBeEmptyDOMElement(); })];
            case 3:
                _a.sent();
                return [2];
        }
    });
}); });
test('validate support not less than 0', function () { return __awaiter(void 0, void 0, void 0, function () {
    var numberInputs, firstNumberInput, secondNumberInput;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                numberInputs = dom_1.screen.getAllByRole('spinbutton');
                firstNumberInput = numberInputs[0];
                secondNumberInput = numberInputs[1];
                firstNumberInput.value = '30';
                secondNumberInput.value = '-25';
                dom_1.fireEvent.click(dom_1.screen.getByRole('button'));
                return [4, (0, dom_1.waitFor)(function () { return expect(firstNumberInput).toBeValid(); })];
            case 1:
                _a.sent();
                return [4, (0, dom_1.waitFor)(function () { return expect(secondNumberInput).toBeInvalid(); })];
            case 2:
                _a.sent();
                return [4, (0, dom_1.waitFor)(function () { return expect(dom_1.screen.getByTestId('support-bar-chart')).toBeEmptyDOMElement(); })];
            case 3:
                _a.sent();
                return [4, (0, dom_1.waitFor)(function () { return expect(dom_1.screen.getByTestId('division-pie-chart')).toBeEmptyDOMElement(); })];
            case 4:
                _a.sent();
                return [2];
        }
    });
}); });
test('displays results', function () { return __awaiter(void 0, void 0, void 0, function () {
    var numberInputs, firstNumberInput, secondNumberInput, button;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                numberInputs = dom_1.screen.getAllByRole('spinbutton');
                firstNumberInput = numberInputs[0];
                secondNumberInput = numberInputs[1];
                firstNumberInput.value = '30';
                secondNumberInput.value = '25';
                button = dom_1.screen.getByRole('button');
                dom_1.fireEvent.click(button);
                return [4, (0, dom_1.waitFor)(function () { return expect(firstNumberInput).toBeValid(); })];
            case 1:
                _a.sent();
                return [4, (0, dom_1.waitFor)(function () { return expect(secondNumberInput).toBeValid(); })];
            case 2:
                _a.sent();
                return [4, (0, dom_1.waitFor)(function () { return expect(dom_1.screen.getByTestId('support-bar-chart')).not.toBeEmptyDOMElement(); })];
            case 3:
                _a.sent();
                return [4, (0, dom_1.waitFor)(function () { return expect(dom_1.screen.getByTestId('division-pie-chart')).not.toBeEmptyDOMElement(); })];
            case 4:
                _a.sent();
                return [2];
        }
    });
}); });
//# sourceMappingURL=calculateDisplay.test.js.map