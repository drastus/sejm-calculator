"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindActions = void 0;
var display_1 = require("./display");
var content_pug_1 = __importDefault(require("./templates/content.pug"));
var loadContent = function () {
    document.body.innerHTML = (0, content_pug_1.default)({
        embed: window.location.hash === '#embed',
    });
};
var handleCalculateButtonClick = function (event) {
    event.preventDefault();
    (0, display_1.calculate)();
};
var bindActions = function () {
    document
        .querySelector('#calculate-button')
        .addEventListener('click', handleCalculateButtonClick);
};
exports.bindActions = bindActions;
document.addEventListener('DOMContentLoaded', function () {
    loadContent();
    (0, display_1.generateTable)();
    (0, display_1.loadResultsFromUrl)();
    (0, exports.bindActions)();
});
window.addEventListener('popstate', function () {
    if (window.location.search) {
        (0, display_1.loadResultsFromUrl)();
    }
    else {
        (0, display_1.clearInputs)();
        (0, display_1.clearResults)();
    }
});
window.addEventListener('hashchange', function () {
    loadContent();
    (0, display_1.generateTable)();
    (0, display_1.loadResultsFromUrl)();
});
//# sourceMappingURL=index.js.map