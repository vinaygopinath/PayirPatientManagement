'use strict';

/**
 * @ngdoc service
 * @name PayirPatientManagement.VldService
 * @description
 * # VldService
 * Service in the PayirPatientManagement.
 */
angular.module('PayirPatientManagement')
    .service('VldService', function VldService() {

        function isValidPatient(patient) {
            if (patient) {
                var valId = patient.id && patient.id.trim().length >= 1;
                var valGender = patient.gender && patient.gender > 0 && patient.gender < 3;
                var valName = patient.name && patient.name.trim().length >= 3;
                var valAge = patient.age && patient.age >= 0 && patient.age <= 110;
                var valContactNum = patient.contactNum && patient.contactNum.trim().length >= 5;
                var valVillage = patient.village && patient.village.trim().length >= 3;

                //                console.log('ID', valId);
                //                console.log('gender', valGender);
                //                console.log('name', valName);
                //                console.log('age', valAge);
                //                console.log('contact num', valContactNum);
                //                console.log('village', valVillage);
                return (valId && valGender && valName && valAge && valContactNum && valVillage);
            }
            return false;
        }

        function isValidVisit(visit) {
            if (visit) {
                var valPatientId = visit.patientId && visit.patientId.trim().length > 0;
                var valDate = visit.date && visit.date instanceof Date;
                var valIssue = visit.issue && visit.issue.trim().length >= 3;
                var valAttended = visit.attendedBy && visit.attendedBy.trim().length >= 3;

                var valFolDate = true,
                    valMessage = true,
                    valTeam = true;

                if (visit.smsAlert.date || visit.smsAlert.message || visit.smsAlert.team) {
                    valFolDate = (visit.smsAlert.date) ? new Date(visit.smsAlert.date) > new Date() : false;
                    valMessage = (visit.smsAlert.message) ? (visit.smsAlert.message.trim().length >= 5) : false;
                    valTeam = (visit.smsAlert.team) ? (visit.smsAlert.team.length >= 1) : false;
                }
                console.log('Date exists? ', visit.date);
                console.log('Date is a date? ', visit.date instanceof Date);
                console.log('valPatientId', valPatientId);
                console.log('valDate', valDate);
                console.log('valIssue', valIssue);
                console.log('valAttended', valAttended);

                console.log('valFolDate', valFolDate);
                console.log('valMessage', valMessage);
                console.log('valTeam', valTeam);

                return valPatientId && valDate && valIssue && valAttended && valFolDate && valMessage && valTeam;
            }
            return false;
        }

        function isValidSettings(settings) {
            if (settings) {
                var valTeam = false;
                if (settings.team) {
                    valTeam = true;
                    angular.forEach(settings.team, function (person) {
                        valTeam = valTeam && isValidPerson(person);
                    });
                }
                return valTeam;
            }
            return false;
        }

        function isValidPerson(person) {
            if (person) {
                return person.name && person.name.trim().length >= 3;
            }
            return false;
        }

        return {
            'isValidPatient': isValidPatient,
            'isValidVisit': isValidVisit,
            'isValidSettings': isValidSettings,
            'isValidPerson': isValidPerson
        };
    });