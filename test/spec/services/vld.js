'use strict';

describe('Service: VldService', function () {

    // load the service's module
    beforeEach(angular.mock.module('PayirPatientManagement'));

    // instantiate service
    var VldService;
    beforeEach(inject(function (_VldService_) {
        VldService = _VldService_;
    }));

    describe('Patient validation', function () {
        it('should be defined', function () {
            expect(!!VldService).toBe(true);
        });

        it('should accept patient objects with a minimum of regNum, gender, name, age, contact number and village', function () {
            var someValidPatientObj = {
                regNum: '12345',
                gender: 1,
                name: 'Some Name',
                age: 30,
                contactNum1: '1234567890',
                village: 'Thenur'
            };
            expect(VldService.isValidPatient(someValidPatientObj)).toBeTruthy();
        });

        it('should reject empty or incomplete objects', function () {
            var emptyObj = {};
            var incompleteObj = {
                regNum: '12333',
                age: 20
            };

            var anotherIncompleteObj = {
                name: 'Name',
                regNum: '2245',
                village: 'Thottiyapatti'
            };

            expect(VldService.isValidPatient(emptyObj)).toBeFalsy();
            expect(VldService.isValidPatient(incompleteObj)).toBeFalsy();
            expect(VldService.isValidPatient(anotherIncompleteObj)).toBeFalsy();

        });

        it('should reject genders that are not numerical (1 for female and 2 for male)', function () {
            var someInvalidGenderPatientObj = {
                regNum: '12345',
                gender: 'Male',
                name: 'Some Name',
                age: 30,
                contactNum1: '1234567890',
                village: 'Thenur'
            };
            expect(VldService.isValidPatient(someInvalidGenderPatientObj)).toBeFalsy();
        });
    });

    describe('Visit validation', function () {
        it('should be defined', function () {
            expect(!!VldService.isValidVisit).toBe(true);
        });

        it('should require a regNum, date and issue', function () {
            var someValidVisit = {
                regNum: '2222',
                date: new Date(),
                issue: 'Headache'
            };

            var invalidVisit = {
                date: new Date()
            };

            expect(VldService.isValidVisit(someValidVisit)).toBeTruthy();
            expect(VldService.isValidVisit(invalidVisit)).toBeFalsy();
        });
    });

    describe('Settings validation', function () {
        it('should be defined', function () {
            expect(!!VldService.isValidSettings).toBe(true);
        });

        it('should require team information and timestamp of last sync', function () {
            var someValidSettings = {
                team: [{
                    name: 'PersonA',
                    email: 'person.a@email.com'
                }, {
                    name: 'PersonB',
                    email: 'personb@mail.com'
                }],
                lastSync: new Date(0)
            };

            var someInvalidSettings = {
                team: [{
                    irrelevantProperty: 'Person',
                    age: 32
                }],
                lastSync: new Date(0)
            };

            expect(VldService.isValidSettings(someValidSettings)).toBeTruthy();
            expect(VldService.isValidSettings(someInvalidSettings)).toBeFalsy();
        });
    });
});