'use strict';

describe('Controller: ViewPatientCtrl', function () {

    // load the controller's module
    beforeEach(angular.mock.module('PayirPatientManagement'));

    var ViewPatientCtrl, scope;

    var someExistingPatientId = '12345';

    var routeParams = {
        patientId: someExistingPatientId
    };

    var sucPromise = {
        then: function (callback) {
            callback();
        }
    };

    var failPromise = {
        then: function (callback, errback) {
            errback();
        }
    };

    var someValidPatientObj = {
        id: someExistingPatientId,
        gender: 1,
        name: 'Some Name',
        age: 30,
        contactNum: '1234567890',
        village: 'Thenur'
    };

    var someValidVisits = [{
        id: someExistingPatientId,
        date: new Date(),
        issue: 'Headache'
                }, {
        id: someExistingPatientId,
        date: new Date(0),
        issue: 'Fever'
                }, {
        id: someExistingPatientId,
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
            return sucPromise;
        },
        deleteVisit: function () {
            return sucPromise;
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

    describe('Initialization', function () {

        xit('should show an error message when patientId is missing', function () {
            expect(routeParams.patientId).not.toBeDefined();
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

    var mdDialog;


    describe('Delete', function () {

        beforeEach(inject(function ($controller, $rootScope, $mdDialog) {
            scope = $rootScope.$new();
            mdDialog = $mdDialog;
            ViewPatientCtrl = $controller('ViewPatientCtrl', {
                $mdDialog: mdDialog,
                $scope: scope,
                StorageService: StorageService,
                $routeParams: routeParams,
            });
        }));

        it('should provide a delete option', function () {
            expect(!!scope.deletePatient).toBe(true);
        });

        it('should show a confirmation dialog', function () {
            spyOn(StorageService, 'deletePatient').and.callThrough();
            spyOn(scope, 'showConfirm').and.returnValue(sucPromise);
            scope.deletePatient();
            expect(scope.showConfirm).toHaveBeenCalled();
        });

        it('should delete the patient record when delete is confirmed', function () {
            spyOn(StorageService, 'deletePatient').and.callThrough();
            spyOn(scope, 'showConfirm').and.returnValue(sucPromise);
            scope.deletePatient();
            expect(StorageService.deletePatient).toHaveBeenCalled();
        });

        it('should do nothing when delete is cancelled', function () {
            spyOn(StorageService, 'deletePatient').and.callThrough();
            spyOn(scope, 'showConfirm').and.returnValue({
                then: function (callback, errback) {
                    if (errback) {
                        errback();
                    }
                }
            });
            scope.deletePatient();
            expect(StorageService.deletePatient).not.toHaveBeenCalled();
        });

    });

    describe('View visit', function () {

        var someVisit = {
            id: '1234',
            issue: 'Issue',
            date: new Date()
        };

        beforeEach(inject(function ($controller, $rootScope, $mdDialog) {
            scope = $rootScope.$new();
            mdDialog = $mdDialog;
            ViewPatientCtrl = $controller('ViewPatientCtrl', {
                $mdDialog: mdDialog,
                $scope: scope,
                StorageService: StorageService,
                $routeParams: routeParams,
            });
        }));

        it('should be defined', function () {
            expect(!!scope.viewVisit).toBe(true);
        });

        it('should show a dialog', function () {
            spyOn(mdDialog, 'show').and.returnValue({
                then: function (deleteback, cancelback) {
                    //Pretend that the user closed the dialog
                    if (cancelback) {
                        cancelback();
                    }
                }
            });

            scope.viewVisit(someVisit);
            expect(mdDialog.show).toHaveBeenCalled();
        });

        it('should show a delete confirmation dialog when user clicks delete', function () {
            spyOn(mdDialog, 'show').and.returnValue(sucPromise);
            spyOn(scope, 'showConfirm').and.returnValue(sucPromise);

            scope.viewVisit(someVisit);
            expect(scope.showConfirm).toHaveBeenCalled();
        });

        it('should, on confirmation, delete the visit from DB and show a toast on DB success + dismiss the dialog', function () {
            spyOn(mdDialog, 'show').and.returnValue(sucPromise);
            spyOn(scope, 'showConfirm').and.returnValue(sucPromise);
            spyOn(StorageService, 'deleteVisit').and.returnValue(sucPromise);
            spyOn(scope, 'showSimpleToast');
            spyOn(mdDialog, 'hide');

            scope.viewVisit(someVisit);
            expect(StorageService.deleteVisit).toHaveBeenCalled();
            expect(scope.showSimpleToast).toHaveBeenCalled();
            expect(mdDialog.hide).toHaveBeenCalled();
        });

        it('should, on confirmation, delete the visit from DB and show a toast on DB failure + NOT dismiss the dialog', function () {
            spyOn(mdDialog, 'show').and.returnValue(sucPromise);
            spyOn(scope, 'showConfirm').and.returnValue(sucPromise);
            spyOn(StorageService, 'deleteVisit').and.returnValue(failPromise);
            spyOn(scope, 'showSimpleToast');
            spyOn(mdDialog, 'hide');

            scope.viewVisit(someVisit);
            expect(StorageService.deleteVisit).toHaveBeenCalled();
            expect(scope.showSimpleToast).toHaveBeenCalled();
            expect(mdDialog.hide).not.toHaveBeenCalled();
        });
    });

    describe('Add visit', function () {

        beforeEach(inject(function ($controller, $rootScope, $mdDialog) {
            scope = $rootScope.$new();
            mdDialog = $mdDialog;
            ViewPatientCtrl = $controller('ViewPatientCtrl', {
                $mdDialog: mdDialog,
                $scope: scope,
                StorageService: StorageService,
                $routeParams: routeParams,
            });
        }));

        it('should provide an option to add a new visit', function () {
            expect(!!scope.addVisit).toBe(true);
        });

        it('should show the add visit dialog', function () {
            spyOn(mdDialog, 'show').and.returnValue(sucPromise);
            scope.addVisit();
            expect(mdDialog.show).toHaveBeenCalled();
        });

        it('should add the visit to the existing list of visits', function () {
            scope.visits = [];
            var someVisit = {
                id: '1234',
                issue: 'Issue',
                date: new Date()
            };
            spyOn(mdDialog, 'show').and.returnValue({
                then: function (callback) {
                    callback(someVisit);
                }
            });
            scope.addVisit();
            expect(scope.visits).toEqual([someVisit]);
        });
    });
});