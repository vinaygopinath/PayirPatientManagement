'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:AddvisitCtrl
 * @description
 * # AddvisitCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('AddVisitCtrl', function ($scope, VldService, StorageService, $mdDialog) {

        $scope.visit = {};
        $scope.followup = {};
        $scope.hasValErrors = false;
        $scope.selectedPeople = [];

        StorageService.getSettings().then(function (settings) {
            console.log('settings', settings);
            $scope.team = settings.team.map(function (person) {
                return {
                    value: person.name.toLowerCase(),
                    display: person.name,
                    email: person.email
                };
            });
            console.log('team', $scope.team);
        });

        $scope.saveVisit = function (visit) {
            $scope.hasValErrors = false;
            if ($scope.tempDate && $scope.tempTime) {
                var dt = $scope.tempDate;
                var tm = $scope.tempTime;
                var finalDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), tm.getHours(), tm.getMinutes(), 0, 0);
                $scope.visit.date = finalDate;
            }
            visit.attendedBy = $scope.personStr;
            if (VldService.isValidVisit(visit)) {
                StorageService.saveVisit(visit).then(function () {
                    $mdDialog.hide(visit);
                    $scope.showSimpleToast('Visit saved');
                }, function () {
                    $scope.showSimpleToast('Saving failed. Please try again');
                });
            } else {
                $scope.hasValErrors = true;
            }
        };

        $scope.close = function () {
            //            $mdDialog.cancel();
            var dt = $scope.tempDate;
            var tm = $scope.tempTime;
            var finalDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), tm.getHours(), tm.getMinutes(), 0, 0);
            $scope.visit.date = finalDate;
            $scope.dateStr = finalDate.getDate() + ":" + finalDate.getMonth() + " at " + finalDate.getHours() + ":" + finalDate.getMinutes();
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