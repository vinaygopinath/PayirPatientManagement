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

        it('should accept patient objects with a minimum of id, gender, name, age, contact number and village', function () {
            var someValidPatientObj = {
                id: '12345',
                gender: 1,
                name: 'Some Name',
                age: 30,
                contactNum: '1234567890',
                village: 'Thenur'
            };
            expect(VldService.isValidPatient(someValidPatientObj)).toBeTruthy();
        });

        it('should reject empty or incomplete objects', function () {
            var emptyObj = {};
            var incompleteObj = {
                id: '12333',
                age: 20
            };

            var anotherIncompleteObj = {
                name: 'Name',
                id: '2245',
                village: 'Thottiyapatti'
            };

            expect(VldService.isValidPatient(emptyObj)).toBeFalsy();
            expect(VldService.isValidPatient(incompleteObj)).toBeFalsy();
            expect(VldService.isValidPatient(anotherIncompleteObj)).toBeFalsy();

        });

        it('should reject genders that are not numerical (1 for female and 2 for male)', function () {
            var someInvalidGenderPatientObj = {
                id: '12345',
                gender: 'Male',
                name: 'Some Name',
                age: 30,
                contactNum: '1234567890',
                village: 'Thenur'
            };
            expect(VldService.isValidPatient(someInvalidGenderPatientObj)).toBeFalsy();
        });
    });

    describe('Visit validation', function () {
        it('should be defined', function () {
            expect(!!VldService.isValidVisit).toBe(true);
        });

        it('should require a id, date and issue', function () {
            var someValidVisit = {
                id: '2222',
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

        it('should provide validation for person', function () {
            expect(!!VldService.isValidPerson).toBe(true);
        });

        it('should accept persons with a minimum of 3 letters in their name, and optional email', function () {
            var validPerson = {
                name: 'Person'
            };
            var invalidPerson = {
                name: 'AB'
            };
            expect(VldService.isValidPerson(validPerson)).toBeTruthy();
            expect(VldService.isValidPerson(invalidPerson)).toBeFalsy();

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