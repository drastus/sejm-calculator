"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadResultsFromUrl = exports.generateTable = exports.calculate = exports.clearResults = exports.clearInputs = void 0;
var chartist_1 = require("chartist");
var data_1 = require("./data");
var mandates_1 = __importDefault(require("./mandates"));
var cresults_pug_1 = __importDefault(require("./templates/cresults.pug"));
var constituency_pug_1 = __importDefault(require("./templates/constituency.pug"));
var table_pug_1 = __importDefault(require("./templates/table.pug"));
var c41_svg_1 = __importDefault(require("./images/c41.svg"));
require("./styles/styles.css");
var location = window.location;
var barChart = null;
var pieChart = null;
var displayPercent = function (value) { return "".concat(value.toLocaleString('pl', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
}), "%"); };
var clearInputs = function () {
    var inputs = document.querySelectorAll('tr td:nth-child(2) input');
    inputs.forEach(function (input) {
        input.value = '';
    });
};
exports.clearInputs = clearInputs;
var clearResults = function () {
    document.querySelectorAll('tr td:last-child').forEach(function (td) {
        td.innerHTML = '';
    });
    if (barChart)
        barChart.detach();
    if (pieChart)
        pieChart.detach();
    var urlContainer = document.getElementById('url');
    if (urlContainer)
        urlContainer.innerHTML = '';
    document.getElementById('support-bar-chart').innerHTML = '';
    document.getElementById('division-pie-chart').innerHTML = '';
    var constituencyResultContainer = document.getElementById('constituency-results');
    if (constituencyResultContainer)
        constituencyResultContainer.innerHTML = (0, cresults_pug_1.default)();
    if (location.search) {
        var urlWithoutSearchString = location.href.split('?')[0];
        window.history.pushState('', '', urlWithoutSearchString);
    }
};
exports.clearResults = clearResults;
var displayResults = function (mandates) {
    mandates.forEach(function (value, index) {
        var committeeId = data_1.committees[index].id;
        var td = document.querySelector("tr.".concat(committeeId, " td:last-child"));
        if (td)
            td.textContent = value.toString();
        if (index === 5 && value > 0 && (td === null || td === void 0 ? void 0 : td.parentElement)) {
            td.parentElement.style.display = 'table-row';
        }
    });
};
var displayUrl = function (support) {
    var container = document.getElementById('url');
    if (container) {
        var searchParams_1 = new URLSearchParams();
        support.forEach(function (s, i) {
            if (s > 0)
                searchParams_1.append(data_1.committees[i].id, s.toString());
        });
        var urlWithoutSearchString = location.href.split('?')[0];
        var url = "".concat(urlWithoutSearchString, "?").concat(searchParams_1.toString());
        document.getElementById('url').innerHTML = "Link do wynik\u00F3w: ".concat(url.link(url));
    }
};
var displayBarChart = function (support) {
    var sortedSupport = data_1.committees
        .map(function (c, i) { return ({
        label: c.shortName,
        support: { value: support[i], className: c.id },
    }); })
        .filter(function (s) { return s.support.value && s.support.value > 0; })
        .sort(function (a, b) { return b.support.value - a.support.value; });
    var chartData = {
        labels: sortedSupport.map(function (ss) { return ss.label; }),
        series: sortedSupport.map(function (ss) { return ss.support; }),
    };
    var chartOptions = {
        distributeSeries: true,
        axisY: {
            labelInterpolationFnc: displayPercent,
        },
    };
    document.getElementById('support-bar-chart').classList.add('ct-perfect-fourth');
    var chart = new chartist_1.BarChart('#support-bar-chart', chartData, chartOptions);
    chart.on('draw', function (data) {
        if (data.type === 'bar') {
            data.element.attr({
                style: 'stroke-width: 30px',
            });
            data.group.append(new chartist_1.Svg('text', { x: data.x2 + 15, y: data.y2 - 5, 'text-anchor': 'end' }, 'bar-value').text(displayPercent(data.value.y)));
        }
    });
    return chart;
};
var displayPieChart = function (mandates) {
    var commiteesWithMandates = data_1.committees
        .map(function (c, i) { return ({
        id: c.id,
        label: c.shortName,
        mandates: { value: mandates[i], className: c.id },
    }); })
        .filter(function (m) { return m.mandates.value && m.mandates.value > 0; });
    commiteesWithMandates.sort(function (a, b) { return (data_1.benchSort.indexOf(a.id) > data_1.benchSort.indexOf(b.id) ? 1 : -1); });
    var chartData = {
        series: commiteesWithMandates.map(function (sm) { return sm.mandates; }),
    };
    var chartOptions = {
        donut: true,
        donutWidth: 60,
        startAngle: 270,
        total: 460 * 2,
        labelInterpolationFnc: function (value, index) { return (value < 15 ? '' : "".concat(commiteesWithMandates[index].label, " ").concat(value)); },
    };
    document.getElementById('division-pie-chart').classList.add('ct-perfect-fourth');
    return new chartist_1.PieChart('#division-pie-chart', chartData, chartOptions);
};
var displayConstituencyResults = function () {
    var container = document.getElementById('constituency-results');
    if (container) {
        container.innerHTML = (0, cresults_pug_1.default)();
        var constituencyResult_1 = document.getElementById('constituency-result');
        var mapObject_1 = document.getElementById('constituencies-map');
        mapObject_1.setAttribute('data', c41_svg_1.default);
        mapObject_1.addEventListener('load', function () {
            var svgDocument = mapObject_1.contentDocument;
            var constituencyNumber = svgDocument.getElementById('constituency-number');
            var constituencyName = svgDocument.getElementById('constituency-name');
            var paths = svgDocument.querySelectorAll('svg path');
            paths.forEach(function (path) {
                var cid = parseInt(path.dataset.cid, 10);
                var constituency = data_1.constituencies[cid - 1];
                var data = (constituency.mandates && constituency.support)
                    ? constituency.mandates.map(function (mandates, committeeIndex) { return ({
                        committee: data_1.committees[committeeIndex],
                        support: (constituency.support)[committeeIndex],
                        mandates: mandates,
                    }); })
                    : [];
                data.sort(function (a, b) { return b.support - a.support; });
                if (data[0].support === data[1].support) {
                    path.style.fill = 'lightgray';
                }
                else {
                    path.classList.add(data[0].committee.id);
                    if (data[0].support >= 50)
                        path.classList.add('bright50');
                    else if (data[0].support < 40)
                        path.classList.add('bright30');
                }
                path.addEventListener('mouseover', function (event) {
                    var pathElement = event.target;
                    pathElement.style.stroke = '#444';
                    constituencyNumber.innerHTML = "Okr\u0119g nr ".concat(pathElement.dataset.cid);
                    constituencyName.innerHTML = pathElement.dataset.cname;
                });
                path.addEventListener('mouseout', function (event) {
                    var pathElement = event.target;
                    pathElement.style.stroke = '#fff';
                    constituencyNumber.innerHTML = '';
                    constituencyName.innerHTML = '';
                });
                path.addEventListener('click', function (event) {
                    event.target.style.stroke = '#ccc';
                    constituencyResult_1.innerHTML = (0, constituency_pug_1.default)({
                        number: cid,
                        name: constituency.name,
                        size: constituency.size,
                        data: data,
                    });
                });
            });
        });
    }
};
var validate = function (form, inputs, support) {
    inputs.forEach(function (input) {
        input.setCustomValidity('');
    });
    support.some(function (inputValue, index) {
        if (inputValue < 0) {
            inputs[index].setCustomValidity('Poparcie nie może byc mniejsze od 0%');
            return true;
        }
        return false;
    });
    var supportSum = support.reduce(function (a, b) { return a + b; }, 0);
    if (supportSum > 100) {
        inputs[0].setCustomValidity('Suma poparcia nie może przekraczać 100%');
    }
    else if (supportSum <= 0) {
        inputs[0].setCustomValidity('Suma poparcia musi być wyższa niż 0%');
    }
    return form.reportValidity();
};
var calculate = function () {
    var form = document.querySelector('#support-form');
    var inputs = document.querySelectorAll('#support-form input');
    var support = Array
        .from(inputs)
        .map(function (input) { return parseFloat(input.value); })
        .map(function (value) { return (Number.isNaN(value) ? 0 : value); });
    if (!validate(form, inputs, support))
        return;
    var mandates = (0, mandates_1.default)(support);
    displayResults(mandates);
    displayUrl(support);
    barChart = displayBarChart(support);
    pieChart = displayPieChart(mandates);
    displayConstituencyResults();
    inputs.forEach(function (input) {
        input.addEventListener('input', function () {
            (0, exports.clearResults)();
        });
    });
};
exports.calculate = calculate;
var generateTable = function () {
    var form = document.getElementById('support-form');
    form.insertAdjacentHTML('afterbegin', (0, table_pug_1.default)({
        committees: data_1.committees,
    }));
};
exports.generateTable = generateTable;
var loadResultsFromUrl = function () {
    if (location.search) {
        var searchParams = new URLSearchParams(location.search);
        searchParams.forEach(function (value, key) {
            var input = document.querySelector("tr.".concat(key, " td:nth-child(2) input"));
            if (input)
                input.value = value;
        });
        (0, exports.calculate)();
    }
};
exports.loadResultsFromUrl = loadResultsFromUrl;
//# sourceMappingURL=display.js.map