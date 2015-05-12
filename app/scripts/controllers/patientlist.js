'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:PatientlistCtrl
 * @description
 * # PatientlistCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('PatientListCtrl', function ($scope, StorageService) {

        $scope.patients = [];
        $scope.searchStr = '';


        StorageService.getPatients(true).then(null, function () {
            $scope.hasError = true;
        }, function (addedPatient) {
            $scope.patients = $scope.patients.concat(addedPatient);
        });

        $scope.search = function (item) {
            var jsonStr = angular.lowercase(JSON.stringify(item));
            if ($scope.searchStr && $scope.searchStr.trim()) {
                var query = $scope.searchStr.trim().split(' ');
                var result = true;
                for (var partIndex in query) {
                    if (jsonStr.indexOf(angular.lowercase(query[partIndex])) > -1) {
                        result = result && true;
                    } else {
                        result = false;
                    }
                }
                return result;
            } else {
                return true;
            }
        };

        $scope.clearSearch = function () {
            $scope.searchStr = '';
        };
    });