'use strict';

describe('Controller: AddPatientCtrl', function () {

    // load the controller's module
    beforeEach(angular.mock.module('PayirPatientManagement'));

    var AddPatientCtrl,
        scope, VldService, StorageService, routeParams;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _VldService_, _StorageService_) {
        scope = $rootScope.$new();
        VldService = _VldService_;
        StorageService = _StorageService_;
        AddPatientCtrl = $controller('AddPatientCtrl', {
            $scope: scope,
        });
    }));

    describe('Initialization', function () {

        it('should have an empty patient object', function () {
            expect(scope.patient).toEqual({});
        });

        it('should have no validation errors', function () {
            expect(scope.hasValErrors).toBe(false);
        });

        it('should be in add mode when patientId is not available', function () {
            expect(scope.isEditing).toBe(false);
        });

        describe('Edit mode', function () {

            //Creating a new controller to run the isEditing check in the init section
            beforeEach(inject(function ($controller, $rootScope) {
                scope = $rootScope.$new();
                routeParams = {
                    patientId: '12345'
                };
                AddPatientCtrl = $controller('AddPatientCtrl', {
                    $scope: scope,
                    $routeParams: routeParams
                });
            }));

            it('should switch to edit mode when patientId is available', function () {
                expect(scope.isEditing).toBe(true);
            });
        });
    });

    describe('Save patient', function () {

        it('should be defined', function () {
            expect(!!scope.savePatient).toBe(true);
        });

        it('should validate the patient object', function () {
            spyOn(VldService, 'isValidPatient');

            scope.savePatient({});

            expect(VldService.isValidPatient).toHaveBeenCalled();
        });

        it('should save valid patient objects', function () {
            spyOn(StorageService, 'savePatient');
            var someValidPatientObj = {
                regNum: '12345',
                gender: 1,
                name: 'Some Name',
                age: 30,
                contactNum1: '1234567890',
                village: 'Thenur'
            };

            scope.savePatient(someValidPatientObj);

            expect(StorageService.savePatient).toHaveBeenCalled();
        });

        it('should not save invalid patient objects', function () {
            spyOn(StorageService, 'savePatient');

            scope.savePatient({});

            expect(StorageService.savePatient).not.toHaveBeenCalled();
        });

        it('should show validation errors for invalid objects', function () {

            scope.savePatient({});
            expect(scope.hasValErrors).toBe(true);
        });

        it('should not show validation errors for valid objects', function () {
            var someValidPatientObj = {
                regNum: '12345',
                gender: 1,
                name: 'Some Name',
                age: 30,
                contactNum1: '1234567890',
                village: 'Thenur'
            };

            scope.savePatient(someValidPatientObj);

            expect(scope.hasValErrors).toBe(false);
        });
    });

    describe('Clear patient', function () {
        it('should be defined', function () {
            expect(!!scope.clearPatient).toBe(true);
        });

        it('should clear the patient object', function () {
            var someNonEmptyObj = {
                'name': 'ABCD'
            };
            scope.patient = someNonEmptyObj;
            scope.clearPatient();

            expect(scope.patient).toEqual({});
        });

        it('should clear validation errors', function () {
            scope.hasValErrors = true;
            scope.clearPatient();
            expect(scope.hasValErrors).toBe(false);
        });
    });

});