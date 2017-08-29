'use strict';

var Bahmni = Bahmni || {};
Bahmni.Appointments = Bahmni.Appointments || {};

Bahmni.Appointments.Constants = (function () {
    var hostURL = Bahmni.Common.Constants.hostURL + Bahmni.Common.Constants.RESTWS_V1;
    return {
        createServiceUrl: hostURL + '/appointmentService',
        getServiceLoad: hostURL + '/appointmentService/load',
        getAllSpecialitiesUrl: hostURL + '/speciality/all',
        createAppointmentUrl: hostURL + '/appointment',
        getAllAppointmentsUrl: hostURL + '/appointment/all',
        searchAppointmentUrl: hostURL + '/appointment/search',
        getAppointmentsSummaryUrl: hostURL + '/appointment/appointmentSummary',
        defaultServiceTypeDuration: 15,
        defaultCalendarSlotLabelInterval: "01:00:00",
        defaultCalendarSlotDuration: "00:30:00",
        defaultCalendarStartTime: "08:00",
        defaultCalendarEndTime: "19:00",
        minDurationForAppointment: 30,
        defaultAppointmentStatus: 'Scheduled',
        regexForTime: /^(?:(?:1[0-2]|0?[1-9]):[0-5]\d\s*[AaPp][Mm])?$/
    };
})();

