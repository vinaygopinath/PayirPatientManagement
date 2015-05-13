'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:ViewVisitCtrl
 * @description
 * # ViewVisitCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('ViewVisitCtrl', function ($scope, visit, $mdDialog) {
        if (visit) {
            $scope.visit = visit;
        }

        $scope.close = function () {
            $mdDialog.cancel();
        };

        $scope.delete = function () {
            $mdDialog.hide($scope.visit.id);
        };
    });