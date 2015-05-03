'use strict';

describe('Controller: ViewPatientCtrl', function () {

    // load the controller's module
    beforeEach(module('PayirPatientManagement'));

    var ViewPatientCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ViewPatientCtrl = $controller('ViewPatientCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});