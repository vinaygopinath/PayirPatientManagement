'use strict';

describe('Controller: AddVisitCtrl', function () {

    // load the controller's module
    beforeEach(angular.mock.module('PayirPatientManagement'));

    var AddVisitCtrl,
        scope, VldService, StorageService;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _VldService_, _StorageService_) {
        scope = $rootScope.$new();
        VldService = _VldService_;
        StorageService = _StorageService_;
        AddVisitCtrl = $controller('AddVisitCtrl', {
            $scope: scope,
            StorageService: _StorageService_
        });
    }));

    describe('Initialization', function () {

        it('should have an empty visit object', function () {
            expect(scope.visit).toEqual({});
        });

        it('should have no validation errors', function () {
            expect(scope.hasValErrors).toBe(false);
        });
    });

    describe('Save visit', function () {

        it('should be defined', function () {
            expect(!!scope.saveVisit).toBe(true);
        });

        it('should validate the visit object', function () {
            spyOn(VldService, 'isValidVisit');

            scope.saveVisit({});

            expect(VldService.isValidVisit).toHaveBeenCalled();
        });

        it('should save valid visit objects', function () {
            spyOn(StorageService, 'saveVisit');
            var someValidVisitObj = {
                id: '2222',
                date: new Date(),
                issue: 'Headache'
            };

            scope.saveVisit(someValidVisitObj);

            expect(StorageService.saveVisit).toHaveBeenCalled();
        });

        it('should not save invalid visit objects', function () {
            spyOn(StorageService, 'saveVisit');

            scope.saveVisit({});

            expect(StorageService.saveVisit).not.toHaveBeenCalled();
        });

        it('should show validation errors for invalid objects', function () {

            scope.saveVisit({});
            expect(scope.hasValErrors).toBe(true);
        });

        it('should not show validation errors for valid objects', function () {
            var someValidVisitObj = {
                id: '2222',
                date: new Date(),
                issue: 'Headache'
            };

            scope.saveVisit(someValidVisitObj);

            expect(scope.hasValErrors).toBe(false);
        });
    });

    describe('Clear visit', function () {
        it('should be defined', function () {
            expect(!!scope.clearVisit).toBe(true);
        });

        it('should clear the visit object', function () {
            var someNonEmptyObj = {
                'name': 'ABCD'
            };
            scope.visit = someNonEmptyObj;
            scope.clearVisit();

            expect(scope.visit).toEqual({});
        });

        it('should clear validation errors', function () {
            scope.hasValErrors = true;
            scope.clearVisit();
            expect(scope.hasValErrors).toBe(false);
        });
    });

});