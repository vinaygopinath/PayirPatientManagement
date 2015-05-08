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

        $scope.patients = {};
        $scope.searchStr = '';

        StorageService.getPatients(true).then(function (patients) {
            $scope.patients = patients;
        }, function () {
            $scope.hasError = true;
        });

        $scope.search = function (item) {
            var jsonStr = angular.lowercase(JSON.stringify(item));
            if ($scope.searchStr && $scope.searchStr.trim()) {
                var query = $scope.searchStr.trim().split(' ');
                var result = true;
                for (var partIndex in query) {
                    if (jsonStr.indexOf(angular.lowercase(query[partIndex])) > -1) {
                        //console.log("Returning true for query " + query[partIndex] + ". Item = ", jsonStr);
                        result = result && true;
                    } else {
                        result = false;
                    }
                }
                return result;
            } else {
                //console.log("Empty queryStr, so true for everything!");
                return true;
            }
        };

        $scope.clearSearch = function () {
            $scope.searchStr = '';
        };
    });