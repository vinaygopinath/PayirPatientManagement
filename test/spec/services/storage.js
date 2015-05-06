'use strict';

describe('Service: StorageService', function () {

    // load the service's module
    beforeEach(module('PayirPatientManagement'));

    // instantiate service
    var StorageService, VldService, rootScope;
    beforeEach(inject(function ($rootScope, _StorageService_, _VldService_) {
        rootScope = $rootScope;
        StorageService = _StorageService_;
        VldService = _VldService_;
    }));

    describe('openDatabase', function () {
        it('should be defined', function () {
            expect(!!StorageService.openDatabase).toBe(true);
        });

        it('should return the datastore', function () {
            StorageService.openDatabase().then(function (db) {
                expect(db).toBeTruthy();
                console.log(db);
            });
            rootScope.$digest();
        });
    });

    describe('getPatientsList', function () {
        it('should be defined', function () {
            expect(!!StorageService.getPatientsList).toBe(true);
        });
    });

    describe('getPatient', function () {
        it('should be defined', function () {
            expect(!!StorageService.getPatient).toBe(true);
        });
    });

    describe('savePatient', function () {
        it('should be defined', function () {
            expect(!!StorageService.savePatient).toBe(true);
        });

        it('should validate the patient object', function () {
            spyOn(VldService, 'isValidPatient');
            StorageService.savePatient();
            expect(VldService.isValidPatient).toHaveBeenCalled();
        });

        it('should fail for invalid patient objects', function () {
            StorageService.savePatient().then(function () {}, function (err) {
                expect(err).toBeTruthy();
            });
            rootScope.$digest();
        });
    });

    describe('deletePatient', function () {
        it('should be defined', function () {
            expect(!!StorageService.deletePatient).toBe(true);
        });
    });
});