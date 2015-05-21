'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:ViewpatientCtrl
 * @description
 * # ViewpatientCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('ViewPatientCtrl', function ($scope, StorageService, $routeParams, $mdDialog, GoogleService, Err) {
        $scope.patient = {};
        $scope.isMissingId = false;

        if (!$routeParams.patientId) {
            $scope.isMissingId = true;
            return;
        }

        StorageService.getPatient($routeParams.patientId).then(function (patient) {
            $scope.patient = patient;
        }, function (err) {
            if (err === Err.DB_MISSING_OBJ) {
                $scope.hasPatientError = true;
            } else {
                $scope.showSimpleToast('Unknown database error. Please reload the app');
            }
        });
        StorageService.getVisits($routeParams.patientId).then(function (visits) {
            $scope.visits = visits;
        }, function () {
            $scope.showSimpleToast('Failed to load visit history. Please reload the app');
        });

        $scope.deletePatient = function () {
            $scope.showConfirm({
                title: 'Delete Patient',
                content: 'Are you sure you want to delete this patient record? This will also delete the visit history of the patient',
                ok: 'Delete',
                cancel: 'Cancel'
            }).then(function () {
                StorageService.deletePatient($routeParams.patientId).then(function () {
                    $scope.showSimpleToast('Patient deleted');
                    $scope.goTo('dashboard');
                }, function () {
                    $scope.showSimpleToast('Failed to delete patient. Try again');
                });
            });
        };

        $scope.viewVisit = function (visit, index) {
            $mdDialog.show({
                controller: 'ViewVisitCtrl',
                templateUrl: 'views/viewvisit.html',
                locals: {
                    visit: visit
                }
            }).then(function () {
                $scope.showConfirm({
                    title: 'Delete Visit',
                    content: 'Are you sure you want to delete this visit?',
                    ok: 'Delete',
                    cancel: 'Cancel'
                }).then(function () {
                    StorageService.deleteVisit(visit._id).then(function () {
                        $scope.showSimpleToast('Visit deleted');
                        $mdDialog.hide();
                        $scope.visits.splice(index, 1);
                    }, function () {
                        $scope.showSimpleToast('Failed to delete patient. Try again');
                    });
                });
            });
        };

        $scope.showAuthDialog = function () {
            $scope.showConfirm({
                title: 'Google Authorization required',
                content: 'Payir Patient Management was unable to create SMS alerts for one or more accounts. Do you want to grant permission for the account(s) now?',
                ok: 'Open Settings',
                cancel: 'Cancel'
            }).then(function () {
                $scope.goTo('settings');
            });
        };

        $scope.addVisit = function () {

            $mdDialog.show({
                controller: 'AddVisitCtrl',
                templateUrl: 'views/addvisit.html',
                locals: {
                    patientId: $scope.patient.id
                }
            }).then(function (visit) {
                //TODO Handle partial submission of events (failure with some accounts)
                if (visit) {
                    $scope.showSimpleToast('Visit saved');
                    $scope.visits.push(visit);
                    if (visit.smsAlert.date) {

                        GoogleService.createEvent($scope.patient, visit).then(function (full, addlInfo) {
                                if (full) {
                                    $scope.showSimpleToast('SMS alerts scheduled for this visit');
                                } else if (addlInfo && addlInfo.connFailure >= addlInfo.authFailure) {
                                    $scope.showSimpleToast('Creation of some SMS alerts failed because of Internet connectivity problems. Will automatically retry at next launch', 8000);
                                } else {
                                    $scope.showAuthDialog();
                                }
                            },
                            function (errInfo) {
                                if (errInfo.failed.length === errInfo.connFailure) {
                                    $scope.showSimpleToast('Creation of all SMS alerts failed due to Internet issues. Auto-retry scheduled for app relaunch', 8000);
                                } else {
                                    $scope.showAuthDialog();
                                }
                            });
                    }
                } else {
                    $scope.showSimpleToast('Save failed. Please try again');
                }
            });
        };
    });