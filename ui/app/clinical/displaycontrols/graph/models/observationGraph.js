'use strict';

(function () {
    Bahmni = Bahmni || {};
    Bahmni.Clinical = Bahmni.Clinical || {};
    Bahmni.Clinical.ObservationGraph = function (model) {
        angular.extend(this, model);
    };

    var createObservationPoint = function (config, obs, xAxisValues) {
        var observation = {};
        observation[config.xAxisConcept] = xAxisValues;
        observation[obs.concept.name] = obs.value;
        return observation;
    };

    var filterConcept = function (graphModel, obs) {
        return _(graphModel).find(function (item) {
            return item.name === obs.concept.name;
        });
    };

    Bahmni.Clinical.ObservationGraph.create = function (observations, person, config, growthChartReference) {
        var yAxisObservations = _.filter(observations, function (obs) {
            return obs.concept.name !== config.xAxisConcept;
        });
        var xAxisObservations = _.filter(observations, function (obs) {
            return obs.concept.name === config.xAxisConcept;
        });
        var observationGraphModel = _(observations).uniq(function (item) {
            return item.concept.name + item.concept.units;
        }).map(function (item) {
            return {name: item.concept.name, units: item.concept.units, values: []}
        }).value();

        var sortedObsGraphModel = [];
        _.each(config.yAxisConcepts, function (concept) {
            _.each(observationGraphModel, function (item) {
                if (concept === item.name) {
                    sortedObsGraphModel.push(item);
                }
            })
        });

        _.forEach(yAxisObservations, function (yAxisObs) {
            var xValue;
            if (config.displayForObservationDateTime()) {
                config.type = "timeseries";
                xValue = Bahmni.Common.Util.DateUtil.parseDatetime(yAxisObs.observationDateTime).toDate();
            } else if (config.displayForAge()) {
                config.unit = " (years)";
                var age = Bahmni.Common.Util.AgeUtil.fromBirthDateTillReferenceDate(person.birthdate, yAxisObs.observationDateTime);
                xValue = age.years + "." + age.months;
            } else {
                config.type = "indexed";
                xValue = _.find(xAxisObservations, function (xObs) {
                    return yAxisObs.observationDateTime === xObs.observationDateTime;
                }).value;
            }
            var concept = filterConcept(sortedObsGraphModel, yAxisObs);
            var observationPoint = createObservationPoint(config, yAxisObs, xValue);
            concept.values.push(observationPoint);
        });

        if (growthChartReference != undefined) {
            sortedObsGraphModel = sortedObsGraphModel.concat(growthChartReference.getAsObsGraphModel());
            config.yAxisConcepts = config.yAxisConcepts.concat(growthChartReference.getReferenceKeys());
        }

        return new Bahmni.Clinical.ObservationGraph(sortedObsGraphModel);
    };
})();

