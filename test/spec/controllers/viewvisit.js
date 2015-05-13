'use strict';

describe('Controller: ViewVisitCtrl', function () {

    // load the controller's module
    beforeEach(angular.mock.module('PayirPatientManagement'));

    var ViewVisitCtrl, scope, mdDialog;

    var someExistingPatientId = '12345';

    var someVisit = {
        id: someExistingPatientId,
        date: new Date(),
        issue: 'Headache'
    };

    beforeEach(angular.mock.module(function ($provide) {
        $provide.value('visit', someVisit);
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _StorageService_, _$mdDialog_) {
        scope = $rootScope.$new();
        mdDialog = _$mdDialog_;
        ViewVisitCtrl = $controller('ViewVisitCtrl', {
            $scope: scope,
            $mdDialog: _$mdDialog_
        });
    }));

    describe('Initialization', function () {

        it('should store the supplied visit object', function () {
            expect(scope.visit).toEqual(someVisit);
        });
    });

    describe('Close', function () {

        it('should be defined', function () {
            expect(!!scope.close).toBe(true);
        });

        it('should close the dialog', function () {
            spyOn(mdDialog, 'cancel');
            scope.close();
            expect(mdDialog.cancel).toHaveBeenCalled();
        });
    });

    describe('Delete', function () {

        it('should be defined', function () {
            expect(!!scope.delete).toBe(true);
        });

        it('should dismiss the dialog with the visit ID', function () {
            spyOn(mdDialog, 'hide');
            scope.delete();
            expect(mdDialog.hide).toHaveBeenCalledWith(scope.visit.id);
        });
    });

});