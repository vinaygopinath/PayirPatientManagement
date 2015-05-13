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

        StorageService.getVillages().then(function (villages) {
            $scope.villages = villages.map(function (village) {
                return {
                    value: village.toLowerCase(),
                    display: village
                };
            });
        }, function () {
            $scope.hasError = true;
        });

        if ($routeParams.patientId) {
            $scope.isEditing = true;

            StorageService.getPatient($routeParams.patientId).then(function (patient) {
                $scope.patient = patient;
                $scope.villageStr = patient.village;
                //TODO Deal with selectedVillage;
            }, function () {
                $scope.hasError = true;
            });
        }

        $scope.savePatient = function (patient) {
            console.log('savePatient Called');
            $scope.patient.village = $scope.villageStr;
            $scope.hasValErrors = false;
            if (VldService.isValidPatient(patient)) {
                StorageService.savePatient(patient).then(function () {
                    $scope.showSimpleToast('Patient saved');
                    $scope.clearPatient();
                }, function () {
                    $scope.showSimpleToast('Save failed! Please try again');
                });
            } else {
                console.log('hasValErrors');
                $scope.hasValErrors = true;
            }
        };

        $scope.clearPatient = function () {
            $scope.patient = {};
            $scope.hasValErrors = false;
            $scope.villageStr = '';
            $scope.selectedVillage = {};
        };

        $scope.queryVillages = function (query) {
            var results = query ? $scope.villages.filter($scope.createFilterFor(query)) : [];
            return results;
        };

        $scope.createFilterFor = function (query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(village) {
                return (village.value.indexOf(lowercaseQuery) !== -1);
            };
        };
    });