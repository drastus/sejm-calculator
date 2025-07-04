"use strict";
window.matchMedia = jest.fn().mockImplementation(function (query) { return ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
}); });
//# sourceMappingURL=matchMedia.mock.js.map