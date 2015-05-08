'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:AddpatientCtrl
 * @description
 * # AddpatientCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('AddPatientCtrl', function ($scope, VldService, StorageService, $routeParams) {

        $scope.patient = {};
        $scope.hasValErrors = false;
        $scope.isEditing = false;

        if ($routeParams.patientId) {
            $scope.isEditing = true;
        }

        $scope.savePatient = function (patient) {
            $scope.hasValErrors = false;
            if (VldService.isValidPatient(patient)) {
                StorageService.savePatient(patient);
            } else {
                $scope.hasValErrors = true;
            }
        };

        $scope.clearPatient = function () {
            $scope.patient = {};
            $scope.hasValErrors = false;
        };
    });