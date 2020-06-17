import { committees, constituencies, pastSupport } from './data';
var calculateLocalSupport = function (support, pastSupportProjection, constituency) {
    var localPastSupport = constituency.pastSupport;
    var localPastSupportProjection = support.map(function (committeeSupport, index) { return (committees[index].pastSupportEquivalence
        .map(function (pastCommittee) { return localPastSupport[pastCommittee[0]] * pastCommittee[1]; })
        .reduce(function (a, b) { return a + b; }, 0)); });
    var localSupportDeviation = pastSupportProjection
        .map(function (pastCommitteSupportProjection, index) { return (localPastSupportProjection[index] / pastCommitteSupportProjection); });
    var localSupport = support.map(function (committeeSupport, index) { return (committeeSupport * localSupportDeviation[index]); });
    if (constituency.name === 'Opole') {
        localSupport.push(7.9);
    }
    return localSupport;
};
export var calculateMandates = function (support) {
    var pastSupportProjection = support.map(function (committeeSupport, index) { return (committees[index].pastSupportEquivalence
        .map(function (pastCommittee) { return pastSupport[pastCommittee[0]] * pastCommittee[1]; })
        .reduce(function (a, b) { return a + b; }, 0)); });
    var mandates = new Array(support.length + 1).fill(0);
    constituencies.forEach(function (constituency) {
        var localSupport = calculateLocalSupport(support, pastSupportProjection, constituency);
        constituency.support = localSupport;
        constituency.mandates = new Array(localSupport.length).fill(0);
        var filteredLocalSupport = localSupport.map(function (localCommitteeSupport, index) {
            if (support[index] < committees[index].threshold)
                return 0;
            return localCommitteeSupport;
        });
        var quotients = [];
        for (var divisor = 1; divisor <= constituency.size; divisor++) {
            for (var committeeIndex = 0; committeeIndex < localSupport.length; committeeIndex++) {
                quotients.push({
                    quotient: filteredLocalSupport[committeeIndex] / divisor,
                    committeeIndex: committeeIndex,
                });
            }
        }
        quotients.sort(function (a, b) { return b.quotient - a.quotient; });
        quotients.slice(0, constituency.size).forEach(function (quotient) {
            if (quotient.quotient > 0) {
                mandates[quotient.committeeIndex]++;
                constituency.mandates[quotient.committeeIndex]++;
            }
        });
    });
    return mandates;
};
//# sourceMappingURL=mandates.js.map