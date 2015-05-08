'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:ViewVisitCtrl
 * @description
 * # ViewVisitCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('ViewVisitCtrl', function ($scope, $routeParams, StorageService) {


        $scope.visit = {};

        if (!$routeParams.visitId) {
            $scope.isMissingId = true;
            return;
        }

        StorageService.getVisit($routeParams.visitId).then(function (visit) {
            $scope.visit = visit;
        }, function () {
            $scope.hasError = true;
        });
    });