'use strict';

describe('Service: Calendar', function () {

  // load the service's module
  beforeEach(module('payirPatientManagementApp'));

  // instantiate service
  var Calendar;
  beforeEach(inject(function (_Calendar_) {
    Calendar = _Calendar_;
  }));

  it('should do something', function () {
    expect(!!Calendar).toBe(true);
  });

});
