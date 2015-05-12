'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('DashboardCtrl', function ($scope, StorageService) {
        $scope.info = {};
        $scope.hasError = false;

        StorageService.getDashboardInfo().then(function (dashboardInfo) {
            $scope.info = dashboardInfo;
        }, function (err) {
            console.log(err);
            $scope.hasError = true;
        });
    });