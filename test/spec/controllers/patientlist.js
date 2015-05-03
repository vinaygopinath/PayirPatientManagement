'use strict';

describe('Controller: PatientListCtrl', function () {

    // load the controller's module
    beforeEach(module('PayirPatientManagement'));

    var PatientListCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        PatientListCtrl = $controller('PatientListCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});