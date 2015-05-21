'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:AddvisitCtrl
 * @description
 * # AddvisitCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('AddVisitCtrl', function ($scope, VldService, StorageService, $mdDialog, patientId) {

        //Preset the patientId property
        $scope.visit = {
            'patientId': patientId
        };
        $scope.smsAlert = {
            'pending': true
        };
        $scope.hasValErrors = false;
        $scope.selectedPeople = [];

        StorageService.getSettings().then(function (settings) {
            $scope.team = settings.team.map(function (person) {
                return {
                    value: person.name.toLowerCase(),
                    display: person.name,
                    email: person.email,
                    isAuth: person.isAuth
                };
            });
        });

        $scope.saveVisit = function (visit, smsAlert) {
            $scope.hasValErrors = false;

            // Implementation detail - Copy "attended by" string into visit object
            visit.attendedBy = $scope.personStr;

            // Implementation detail - Piece together date+time info and copy into smsAlert object
            if ($scope.tempDate && $scope.tempTime) {
                var dt = $scope.tempDate;
                var tm = $scope.tempTime;
                var finalDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), tm.getHours(), tm.getMinutes(), 0, 0);
                smsAlert.date = finalDate;
            }

            //Implementation detail - Copy emails of chip names to visit team array
            if ($scope.selectedPeople) {
                var emailArr = [];
                $scope.selectedPeople.forEach(function (person) {
                    emailArr.push(person.email);
                });
                smsAlert.team = emailArr;
            }
            visit.smsAlert = smsAlert;

            if (visit.smsAlert.date) {
                visit.smsAlert.pending = visit.smsAlert.team;
            }

            if (VldService.isValidVisit(visit)) {
                StorageService.saveVisit(visit).then(function (savedVisit) {
                    $mdDialog.hide(savedVisit);
                }, function () {
                    $mdDialog.hide();
                });
            } else {
                $scope.hasValErrors = true;
            }
        };

        $scope.close = function () {
            $mdDialog.cancel();
        };

        $scope.queryTeam = function (query) {
            var results = query ? $scope.team.filter($scope.createFilter(query)) : [];
            return results;
        };

        $scope.createFilter = function (query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(person) {
                return (person.value.indexOf(lowercaseQuery) !== -1);
            };
        };
    });