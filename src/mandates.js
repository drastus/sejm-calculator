"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
var calculateLocalSupport = function (support, pastSupportProjection, constituency) {
    var localPastSupport = constituency.pastSupport;
    var localPastSupportProjection = data_1.committees.map(function (committee) { return (committee.pastSupportEquivalence
        .map(function (pastCommittee) { return localPastSupport[pastCommittee[0]] * pastCommittee[1]; })
        .reduce(function (a, b) { return a + b; }, 0)); });
    var localSupportDeviation = pastSupportProjection
        .map(function (pastCommitteSupportProjection, index) { return (localPastSupportProjection[index] / pastCommitteSupportProjection); });
    var localSupport = support.map(function (committeeSupport, index) { return (committeeSupport * localSupportDeviation[index]); });
    if (constituency.name === 'Opole') {
        localSupport.push(5.37);
    }
    return localSupport;
};
exports.default = (function (support) {
    var pastSupportProjection = data_1.committees.map(function (committee) { return (committee.pastSupportEquivalence
        .map(function (pastCommittee) { return data_1.pastSupport[pastCommittee[0]] * pastCommittee[1]; })
        .reduce(function (a, b) { return a + b; }, 0)); });
    var mandates = new Array(support.length + 1).fill(0);
    data_1.constituencies.forEach(function (constituency) {
        var localSupport = calculateLocalSupport(support, pastSupportProjection, constituency);
        constituency.support = localSupport;
        constituency.mandates = new Array(localSupport.length).fill(0);
        var filteredLocalSupport = localSupport.map(function (localCommitteeSupport, index) {
            if (support[index] < data_1.committees[index].threshold)
                return 0;
            return localCommitteeSupport;
        });
        var quotients = [];
        for (var divisor = 1; divisor <= constituency.size; divisor += 1) {
            for (var committeeIndex = 0; committeeIndex < localSupport.length; committeeIndex += 1) {
                quotients.push({
                    quotient: filteredLocalSupport[committeeIndex] / divisor,
                    committeeIndex: committeeIndex,
                });
            }
        }
        quotients.sort(function (a, b) { return b.quotient - a.quotient; });
        quotients.slice(0, constituency.size).forEach(function (quotient) {
            if (quotient.quotient > 0) {
                mandates[quotient.committeeIndex] += 1;
                constituency.mandates[quotient.committeeIndex] += 1;
            }
        });
    });
    return mandates;
});
//# sourceMappingURL=mandates.js.map