'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('SettingsCtrl', function ($scope, StorageService, VldService, GoogleService, Err) {

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
                }, function () {
                    $scope.showSimpleToast('Save failed. Please try again');
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

        $scope.connectAccount = function (person, index) {
            if (!person.email) {
                $scope.showSimpleToast('Invalid email address!');
            }
            if (VldService.isValidSettings($scope.settings)) {
                $scope.showConfirm({
                    title: 'Connect ' + person.email,
                    content: 'Please login as ' + person.email + ' and authorize Payir Patient Management',
                    ok: 'Go',
                    cancel: 'Cancel'
                }).then(function () {
                    GoogleService.authorize(person.email).then(function () {
                        $scope.showSimpleToast('Connected successfully');
                        $scope.settings.team[index].isAuth = true;
                        $scope.showSimpleToast('Updating settings');
                        $scope.saveSettings($scope.settings);
                    }, function (err) {
                        if (err === Err.G_USER_CANCEL) {
                            $scope.showSimpleToast('You cancelled the authorization');
                        } else if (err === Err.G_TOKEN_PARSE) {
                            $scope.showSimpleToast('Unknown error in processing authorization. Please file an issue on GitHub');
                        }
                    });
                });

            } else {
                $scope.showSimpleToast('Errors in input. Please fix them and click Connect again');
            }
        };
    });