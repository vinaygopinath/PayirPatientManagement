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
                var valRegNum = patient.regNum && patient.regNum.trim().length > 0;
                var valGender = patient.gender && patient.gender > 0 && patient.gender < 3;
                var valName = patient.name && patient.name.trim().length > 2;
                var valAge = patient.age && patient.age >= 0 && patient.age < 120;
                var valContactNum1 = patient.contactNum1 && patient.contactNum1.trim().length > 5;
                var valVillage = patient.village && patient.village.trim().length > 2;
                return (valRegNum && valGender && valName && valAge && valContactNum1 && valVillage);
            }
            return false;
        }

        function isValidVisit(visit) {
            if (visit) {
                var valRegNum = visit.regNum && visit.regNum.trim().length > 0;
                var valDate = visit.date && visit.date instanceof Date;
                var valIssue = visit.issue && visit.issue.trim().length > 2;
                return valRegNum && valDate && valIssue;
            }
            return false;
        }

        function isValidSettings(settings) {
            if (settings) {
                var valTeam = false;
                if (settings.team) {
                    valTeam = true;
                    angular.forEach(settings.team, function (personDetails) {
                        valTeam = valTeam && (personDetails.name && personDetails.name.trim().length > 2);
                    });
                }
                var valLastSync = settings.lastSync && settings.lastSync instanceof Date;
                return valTeam && valLastSync;
            }
            return false;
        }

        return {
            'isValidPatient': isValidPatient,
            'isValidVisit': isValidVisit,
            'isValidSettings': isValidSettings
        };
    });