'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:ViewpatientCtrl
 * @description
 * # ViewpatientCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('ViewPatientCtrl', function ($scope, StorageService, $routeParams) {
        $scope.patient = {};
        $scope.isMissingId = false;

        if (!$routeParams.patientId) {
            $scope.isMissingId = true;
            return;
        }

        StorageService.getPatient($routeParams.patientId).then(function (patient) {
            console.log('Received patient ', patient);
            $scope.patient = patient;
        }, function () {
            $scope.hasPatientError = true;
        });
        StorageService.getVisits($routeParams.patientId).then(function (visits) {
            $scope.visits = visits;
        }, function () {
            $scope.hasVisitError = true;
        });

        $scope.deletePatient = function (clickEvent) {
            $scope.showConfirm(clickEvent, {
                title: 'Delete Patient',
                content: 'Are you sure you want to delete this patient record? This will also delete visit history',
                ok: 'Delete',
                cancel: 'Cancel'
            }).then(function () {
                StorageService.deletePatient($routeParams.patientId).then(function (succ) {
                    console.log('Successfully deleted patient ', succ);
                    $scope.showSimpleToast('Patient deleted');
                    $scope.goTo('dashboard');
                }, function () {
                    //console.log(err);
                });
            });
        };
    });