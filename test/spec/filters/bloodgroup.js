'use strict';

describe('Filter: bloodGroupFilter', function () {

    // load the filter's module
    beforeEach(angular.mock.module('PayirPatientManagement'));

    // initialize a new instance of the filter before each test
    var bloodGroup;
    beforeEach(inject(function ($filter) {
        bloodGroup = $filter('bloodGroupFilter');
    }));

    it('should return A+ for 1', function () {
        expect(bloodGroup(1)).toBe('A+');
        expect(bloodGroup('1')).toBe('A+');
    });

    it('should return A- for 2', function () {
        expect(bloodGroup(2)).toBe('A-');
        expect(bloodGroup('2')).toBe('A-');
    });


    it('should return B+ for 3', function () {
        expect(bloodGroup(3)).toBe('B+');
        expect(bloodGroup('3')).toBe('B+');
    });

    it('should return B- for 4', function () {
        expect(bloodGroup(4)).toBe('B-');
        expect(bloodGroup('4')).toBe('B-');
    });


    it('should return AB+ for 5', function () {
        expect(bloodGroup(5)).toBe('AB+');
        expect(bloodGroup('5')).toBe('AB+');
    });

    it('should return AB- for 6', function () {
        expect(bloodGroup(6)).toBe('AB-');
        expect(bloodGroup('6')).toBe('AB-');
    });


    it('should return O+ for 7', function () {
        expect(bloodGroup(7)).toBe('O+');
        expect(bloodGroup('7')).toBe('O+');
    });

    it('should return O- for 8', function () {
        expect(bloodGroup(8)).toBe('O-');
        expect(bloodGroup('8')).toBe('O-');
    });

    it('should return Unknown for missing input', function () {
        expect(bloodGroup()).toBe('Unknown');
    });

    it('should return Invalid for any other number', function () {
        expect(bloodGroup('120')).toBe('Invalid');
        expect(bloodGroup(120)).toBe('Invalid');
    });

    it('should return Invalid for any other text', function () {
        expect(bloodGroup('hello')).toBe('Invalid');
    });
});