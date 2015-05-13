'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:ViewpatientCtrl
 * @description
 * # ViewpatientCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('ViewPatientCtrl', function ($scope, StorageService, $routeParams, $mdDialog) {
        $scope.patient = {};
        $scope.isMissingId = false;

        var fakeVisits = [{
            issue: 'Some fake reason to be sick on this particular day',
            date: new Date(2015, 4, 20)
                }, {
            issue: 'Another reason to stay home on this particular day',
            date: new Date(2015, 4, 30)
                }];

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
            $scope.visits = fakeVisits;
        }, function () {
            $scope.hasVisitError = true;
        });

        $scope.deletePatient = function () {
            $scope.showConfirm({
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
                    $scope.showSimpleToast('Failed to delete patient. Try again');
                });
            });
        };

        $scope.viewVisit = function (visit) {
            $mdDialog.show({
                controller: 'ViewVisitCtrl',
                templateUrl: 'views/viewvisit.html',
                locals: {
                    visit: visit
                }
            }).then(function (visitId, index) {
                $scope.showConfirm({
                    title: 'Delete Visit',
                    content: 'Are you sure you want to delete this visit?',
                    ok: 'Delete',
                    cancel: 'Cancel'
                }).then(function () {
                    StorageService.deleteVisit(visitId).then(function (succ) {
                        console.log('Successfully deleted visit ', succ);
                        $scope.showSimpleToast('Visit deleted');
                        $mdDialog.hide();
                        $scope.visits.splice(index, 1);
                    }, function () {
                        $scope.showSimpleToast('Failed to delete patient. Try again');
                    });
                });
            });
        };

        $scope.addVisit = function () {
            $mdDialog.show({
                controller: 'AddVisitCtrl',
                templateUrl: 'views/addvisit.html'
            }).then(function (visit) {
                $scope.visits.push(visit);
            });
        };
    });