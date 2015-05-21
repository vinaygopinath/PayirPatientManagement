'use strict';

describe('Service: Err', function () {

    // load the service's module
    beforeEach(module('PayirPatientManagement'));

    // instantiate service
    var Err;
    beforeEach(inject(function (_Err_) {
        Err = _Err_;
    }));

    it('should do something', function () {
        expect(!!Err).toBe(true);
    });

});