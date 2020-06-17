import Chartist from 'chartist';
import { committees, constituencies } from './data';
import { calculateMandates } from './mandates';
import constituencyTemplate from './templates/constituency.pug';
import tableTemplate from './templates/table.pug';
import './styles/styles.css';
var clearResults = function (bar, pie) {
    document.querySelectorAll("tr td:last-child").forEach(function (td) {
        td.innerHTML = '';
    });
    bar.detach();
    pie.detach();
    document.getElementById('support-bar-chart').innerHTML = '';
    document.getElementById('division-pie-chart').innerHTML = '';
    document.getElementById('constituency-results').innerHTML = '';
};
var displayConstituencyResults = function () {
    var container = document.getElementById('constituency-results');
    constituencies.forEach(function (constituency, index) {
        var data = (constituency.mandates && constituency.support)
            ? constituency.mandates.map(function (mandates, index) { return ({
                committee: committees[index].name,
                support: constituency.support[index],
                mandates: mandates,
            }); })
            : [];
        data.sort(function (a, b) { return b.support - a.support; });
        container.insertAdjacentHTML('beforeend', constituencyTemplate({
            number: index + 1,
            name: constituency.name,
            size: constituency.size,
            data: data,
        }));
    });
};
var handleCalculateButtonClick = function (event) {
    event.preventDefault();
    var inputs = document.querySelectorAll('#support-form input');
    var support = Array
        .from(inputs)
        .map(function (input) { return parseFloat(input.value); })
        .map(function (value) { return Number.isNaN(value) ? 0 : value; });
    if (support.reduce(function (a, b) { return a + b; }, 0) > 100) {
        inputs.forEach(function (input) { return input.setCustomValidity('Suma poparcia nie może przekraczać 100%'); });
        return;
    }
    else {
        inputs.forEach(function (input) { return input.setCustomValidity(''); });
    }
    if (!document.querySelector('#support-form').checkValidity())
        return;
    var mandates = calculateMandates(support);
    mandates.forEach(function (value, index) {
        var committeeId = committees[index].id;
        var td = document.querySelector("tr." + committeeId + " td:last-child");
        if (td)
            td.textContent = value.toString();
    });
    var barChartData = {
        labels: committees.map(function (committee) { return committee.shortName; }).slice(0, -1),
        series: support,
    };
    var barChartOptions = {
        distributeSeries: true,
    };
    var bar = new Chartist.Bar('#support-bar-chart', barChartData, barChartOptions);
    bar.on('draw', function (data) {
        if (data.type === 'bar') {
            data.element.attr({
                style: 'stroke-width: 30px',
            });
        }
    });
    var pieChartData = {
        series: mandates,
    };
    var pieChartOptions = {
        donut: true,
        donutWidth: 60,
        startAngle: 270,
        total: 460 * 2,
        labelInterpolationFnc: function (value) {
            return value < 15 ? '' : String(value);
        },
    };
    var pie = new Chartist.Pie('#division-pie-chart', pieChartData, pieChartOptions);
    displayConstituencyResults();
    inputs.forEach(function (input) { return input.addEventListener('input', function () {
        clearResults(bar, pie);
    }); });
};
var generateTable = function () {
    var form = document.getElementById('support-form');
    form.insertAdjacentHTML('afterbegin', tableTemplate({
        committees: committees,
    }));
};
var bindActions = function () {
    document
        .querySelector('#calculate-button')
        .addEventListener('click', handleCalculateButtonClick);
};
document.addEventListener('DOMContentLoaded', function () {
    generateTable();
    bindActions();
});
//# sourceMappingURL=index.js.map