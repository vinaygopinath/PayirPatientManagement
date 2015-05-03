'use strict';

describe('Controller: AddPatientCtrl', function () {

    // load the controller's module
    beforeEach(module('PayirPatientManagement'));

    var AddPatientCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AddPatientCtrl = $controller('AddPatientCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});