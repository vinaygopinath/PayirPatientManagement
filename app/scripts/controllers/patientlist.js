'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:PatientlistCtrl
 * @description
 * # PatientlistCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('PatientListCtrl', function ($scope, StorageService, $rootScope) {

        $scope.patients = [];
        $scope.searchStr = '';


        $scope.getPatients = function () {
            StorageService.getPatients().then(function (patientArr) {
                $scope.patients = patientArr;
            }, function () {
                $scope.hasError = true;
            });
        };

        $scope.getPatients();

        $rootScope.$on('$routeChangeStart', function () {
            $scope.getPatients();
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