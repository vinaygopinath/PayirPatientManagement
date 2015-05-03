'use strict';

describe('Controller: AddVisitCtrl', function () {

    // load the controller's module
    beforeEach(module('PayirPatientManagement'));

    var AddVisitCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AddVisitCtrl = $controller('AddVisitCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});