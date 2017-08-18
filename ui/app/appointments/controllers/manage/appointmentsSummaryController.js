'use strict';

angular.module('bahmni.appointments')
    .controller('AppointmentsSummaryController', ['$scope', 'spinner', 'appointmentsService', 'appService',
        function ($scope, spinner, appointmentsService, appService) {
            var init = function () {
                $scope.viewDate = moment().startOf('day').toDate();
                $scope.weekStartDate = moment().startOf('week').toDate();
                $scope.weekEndDate = moment().endOf('week').toDate();
                $scope.weekStart = appService.getAppDescriptor().getConfigValue('weekStart');
                $scope.getAppointmentsSummaryForAWeek($scope.weekStartDate, $scope.weekEndDate);
            };

            $scope.getAppointmentsSummaryForAWeek = function (startDate, endDate) {
                $scope.weekStartDate = startDate;
                $scope.weekEndDate = endDate;
                var params = {
                    startDate: startDate,
                    endDate: endDate
                };
                spinner.forPromise(appointmentsService.getAppointmentsSummary(params).then(function (response) {
                    $scope.appointments = response.data;
                    setWeekDatesInfo();
                }));
            };

            var setWeekDatesInfo = function () {
                $scope.weekDatesInfo = [];
                for (var i = $scope.weekStartDate;
                     Bahmni.Common.Util.DateUtil.isBeforeDate(i, $scope.weekEndDate);
                     i = Bahmni.Common.Util.DateUtil.addDays(i, 1)) {
                    var weekDate = {date: moment(i).format("YYYY-MM-DD")};
                    weekDate.total = _.reduce($scope.appointments, function (total, appointment) {
                        var appointmentCount = appointment.appointmentCountMap[weekDate.date];
                        if (!appointmentCount) {
                            return total;
                        }
                        return {
                            all: appointmentCount.allAppointmentsCount + total.all,
                            missed: appointmentCount.missedAppointmentsCount + total.missed
                        };
                    }, {all: 0, missed: 0});
                    $scope.weekDatesInfo.push(weekDate);
                }
            };

            return init();
        }]);
