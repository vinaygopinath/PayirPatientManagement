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

        StorageService.getSettings().then(function (settings) {
            $scope.settings = settings;
        }, function (err) {
            console.log(err);
        });

        $scope.saveSettings = function (settings) {
            $scope.hasValErrors = false;
            if (VldService.isValidSettings(settings)) {
                StorageService.saveSettings(settings).then(function () {
                    //Do something
                }, function (err) {
                    console.log('Some error happened', err);
                    //TODO Deal with error
                });
            } else {
                $scope.hasValErrors = true;
            }
        };
    });