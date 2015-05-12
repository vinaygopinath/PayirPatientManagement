'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('SettingsCtrl', function ($scope, StorageService, VldService) {

        $scope.settings = {};

        $scope.newPerson = {};
        $scope.hasError = false;

        StorageService.getSettings().then(function (settings) {
            $scope.settings = settings || {};
        }, function () {
            $scope.hasError = true;
        });

        $scope.saveSettings = function (settings) {
            $scope.hasValErrors = false;
            if (VldService.isValidSettings(settings)) {
                StorageService.saveSettings(settings).then(function () {
                    $scope.showSimpleToast('Settings updated');
                    $scope.goTo('dashboard');
                    //Do something
                }, function (err) {
                    console.log('Some error happened', err);
                    $scope.showSimpleToast('Error while saving. Please try again');
                });
            } else {
                $scope.hasValErrors = true;
            }
        };

        $scope.isUniquePerson = function (obj, arr) {
            var res = true;
            angular.forEach(arr, function (ind) {
                if (ind.name === obj.name && ind.email === obj.email) {
                    res = false;
                    return;
                }
            });
            return res;
        };

        $scope.addPersonToTeam = function (person) {
            var isValidPerson = VldService.isValidPerson(person);
            var isUniquePerson = $scope.isUniquePerson(person, $scope.settings.team);
            if (isValidPerson && isUniquePerson) {
                $scope.settings.team.push(person);
                $scope.newPerson = {};
            }
        };
    });