'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:ViewpatientCtrl
 * @description
 * # ViewpatientCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('ViewPatientCtrl', function ($scope, StorageService, $routeParams, ngDialog) {
        $scope.patient = {};
        $scope.isMissingId = false;

        if (!$routeParams.patientId) {
            $scope.isMissingId = true;
            return;
        }

        StorageService.getPatient($routeParams.patientId).then(function (patient) {
            $scope.patient = patient;
        }, function () {
            $scope.hasPatientError = true;
        });
        StorageService.getVisits($routeParams.patientId).then(function (visits) {
            $scope.visits = visits;
        }, function () {
            $scope.hasVisitError = true;
        });

        $scope.deletePatient = function () {
            ngDialog.openConfirm({
                scope: $scope,
                template: 'views/confirm-delete.html'
            }).then(function () {
                StorageService.deletePatient($routeParams.patientId).then(function () {
                    //console.log('Successfully deleted patient ', succ);
                }, function () {
                    //console.log(err);
                });
            }, function () {
                //console.log('Received NO');
            });
        };
    });