'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:AddvisitCtrl
 * @description
 * # AddvisitCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('AddVisitCtrl', function ($scope, VldService, StorageService) {

        $scope.visit = {};
        $scope.hasValErrors = false;

        $scope.saveVisit = function (visit) {
            $scope.hasValErrors = false;
            if (VldService.isValidVisit(visit)) {
                StorageService.saveVisit(visit);
            } else {
                $scope.hasValErrors = true;
            }
        };

        $scope.clearVisit = function () {
            $scope.visit = {};
            $scope.hasValErrors = false;
        };
    });