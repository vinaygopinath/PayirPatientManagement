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
                var valRegNum = visit.id && visit.id.trim().length > 0;
                var valDate = visit.date && visit.date instanceof Date;
                var valIssue = visit.issue && visit.issue.trim().length >= 3;
                return valRegNum && valDate && valIssue;
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