'use strict';

describe('Service: GoogleService', function () {

    // load the service's module
    beforeEach(module('PayirPatientManagement'));

    // instantiate service
    var GoogleService;
    beforeEach(inject(function (_GoogleService_) {
        GoogleService = _GoogleService_;
    }));

    describe('Authorize', function () {

        it('should provide a function to perform authorization', function () {
            expect(!!GoogleService.authorize).toBe(true);
        });
    });

    describe('Check authorization', function () {

        it('should provide a function', function () {
            expect(!!GoogleService.isAuthorized).toBe(true);
        });

        it('should initially return false', function () {
            expect(GoogleService.isAuthorized).toBe(false);
        });
    });
});