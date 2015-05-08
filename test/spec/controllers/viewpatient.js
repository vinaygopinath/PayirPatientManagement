'use strict';

describe('Controller: ViewPatientCtrl', function () {

    // load the controller's module
    beforeEach(angular.mock.module('PayirPatientManagement'));

    var ViewPatientCtrl, scope;

    var someExistingPatientId = '12345';

    var routeParams = {
        patientId: someExistingPatientId
    };

    var someValidPatientObj = {
        regNum: someExistingPatientId,
        gender: 1,
        name: 'Some Name',
        age: 30,
        contactNum1: '1234567890',
        village: 'Thenur'
    };

    var someValidVisits = [{
        regNum: someExistingPatientId,
        date: new Date(),
        issue: 'Headache'
                }, {
        regNum: someExistingPatientId,
        date: new Date(0),
        issue: 'Fever'
                }, {
        regNum: someExistingPatientId,
        date: new Date(),
        issue: 'Snake bite'
                }];

    var StorageService = {
        getPatient: function (id) {
            if (id === someExistingPatientId) {
                return {
                    then: function (callback) {
                        callback(someValidPatientObj);
                    }
                };
            }
            return {
                then: function (callback, errback) {
                    errback('Invalid ID');
                }
            };
        },
        getVisits: function (patientId) {

            if (patientId === someExistingPatientId) {
                return {
                    then: function (callback) {
                        callback(someValidVisits);
                    }
                };
            }
            return {
                then: function (callback, errback) {
                    errback('Invalid ID');
                }
            };
        },
        deletePatient: function () {
            return {
                then: function (callback) {
                    callback();
                }
            };
        }
    };

    beforeEach(angular.mock.module(function ($provide) {
        $provide.value('StorageService', StorageService);
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($rootScope, $controller, _StorageService_) {
        scope = $rootScope.$new();
        StorageService = _StorageService_;
        ViewPatientCtrl = $controller('ViewPatientCtrl', {
            $scope: scope,
            $routeParams: {},
            StorageService: _StorageService_,
        });
    }));

    describe('Delete', function () {
        var ngDialog;

        beforeEach(inject(function ($controller, $rootScope, _ngDialog_) {
            scope = $rootScope.$new();
            ngDialog = _ngDialog_;
            ViewPatientCtrl = $controller('ViewPatientCtrl', {
                $scope: scope,
                StorageService: StorageService,
                $routeParams: routeParams,
                ngDialog: _ngDialog_
            });
        }));

        it('should provide a delete option', function () {
            expect(!!scope.deletePatient).toBe(true);
        });

        it('should show a confirmation dialog', function () {
            spyOn(StorageService, 'deletePatient').and.callThrough();
            spyOn(ngDialog, 'openConfirm').and.returnValue({
                then: function (callback) {
                    callback();
                }
            });
            scope.deletePatient();
            expect(ngDialog.openConfirm).toHaveBeenCalled();
        });

        it('should delete the patient record when delete is confirmed', function () {
            spyOn(StorageService, 'deletePatient').and.callThrough();
            spyOn(ngDialog, 'openConfirm').and.returnValue({
                then: function (callback) {
                    callback();
                }
            });
            scope.deletePatient();
            expect(StorageService.deletePatient).toHaveBeenCalled();
        });

        it('should do nothing when delete is cancelled', function () {
            spyOn(StorageService, 'deletePatient').and.callThrough();
            spyOn(ngDialog, 'openConfirm').and.returnValue({
                then: function (callback, errback) {
                    errback();
                }
            });
            scope.deletePatient();
            expect(StorageService.deletePatient).not.toHaveBeenCalled();
        });

    });


    describe('Initialization', function () {

        it('should initally have an empty patient object', function () {
            expect(scope.patient).toEqual({});
        });

        it('should show an error message when patientId is missing', function () {
            expect(scope.isMissingId).toBe(true);
        });

        describe('Fetch information for valid patientId', function () {

            beforeEach(inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                spyOn(StorageService, 'getPatient').and.callThrough();
                spyOn(StorageService, 'getVisits').and.callThrough();
                ViewPatientCtrl = $controller('ViewPatientCtrl', {
                    $scope: scope,
                    $routeParams: routeParams,
                    StorageService: StorageService
                });
            }));

            it('should call getPatient for the given patient', function () {
                expect(StorageService.getPatient).toHaveBeenCalledWith(routeParams.patientId);
            });

            it('should call getVisits for the given patient', function () {
                expect(StorageService.getVisits).toHaveBeenCalledWith(routeParams.patientId);
            });

            it('should store the fetched patient information', function () {
                expect(scope.patient).toEqual(someValidPatientObj);
            });

            it('should store the fetched visit history', function () {
                expect(scope.visits).toEqual(someValidVisits);
            });
        });

        describe('Error messages for invalid patientId', function () {

            var someNonExistingPatientId = '98765';

            var routeParams2 = {
                patientId: someNonExistingPatientId
            };

            beforeEach(inject(function ($controller, $rootScope) {
                scope = $rootScope.$new();
                ViewPatientCtrl = $controller('ViewPatientCtrl', {
                    $scope: scope,
                    $routeParams: routeParams2,
                    StorageService: StorageService
                });
            }));

            it('should show an error for patient information', function () {
                expect(scope.hasVisitError).toBe(true);
            });

            it('should show an error for visit history', function () {
                expect(scope.hasVisitError).toBe(true);
            });

        });
    });
});