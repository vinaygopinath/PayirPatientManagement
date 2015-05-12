'use strict';

describe('Controller: ViewvisitCtrl', function () {

    // load the controller's module
    beforeEach(angular.mock.module('PayirPatientManagement'));

    var ViewVisitCtrl,
        scope;

    var someExistingPatientId = '12345';
    var someExistingVisitId = '12345';

    var someVisit = {
        id: someExistingPatientId,
        date: new Date(),
        issue: 'Headache'
    };

    var routeParams = {
        visitId: someExistingVisitId
    };

    var StorageService = {
        getVisit: function (id) {
            if (id === someExistingVisitId) {
                return {
                    then: function (callback) {
                        callback(someVisit);
                    }
                };
            } else {
                return {
                    then: function (callback, errback) {
                        errback('Invalid ID');
                    }
                };
            }
        }
    };

    beforeEach(angular.mock.module(function ($provide) {
        $provide.value('StorageService', StorageService);
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _StorageService_) {
        scope = $rootScope.$new();
        ViewVisitCtrl = $controller('ViewVisitCtrl', {
            $scope: scope,
            StorageService: _StorageService_
        });
    }));

    describe('Initialization', function () {

        it('should initially have an empty visit object', function () {
            expect(scope.visit).toEqual({});
        });

        it('should show an error message when visitId is missing', function () {
            expect(scope.isMissingId).toBe(true);
        });

        describe('Fetch information for valid patientId', function () {

            beforeEach(inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                spyOn(StorageService, 'getVisit').and.callThrough();
                ViewVisitCtrl = $controller('ViewVisitCtrl', {
                    $scope: scope,
                    $routeParams: routeParams,
                    StorageService: StorageService
                });
            }));

            it('should call getVisit for the given visit', function () {
                expect(StorageService.getVisit).toHaveBeenCalledWith(routeParams.visitId);
            });

            it('should store the fetched visit information', function () {
                expect(scope.visit).toEqual(someVisit);
            });
        });

        describe('Error messages for invalid visitId', function () {

            var someNonExistingVisitId = '98765';

            var routeParams2 = {
                visitId: someNonExistingVisitId
            };

            beforeEach(inject(function ($controller, $rootScope) {
                scope = $rootScope.$new();
                ViewVisitCtrl = $controller('ViewVisitCtrl', {
                    $scope: scope,
                    $routeParams: routeParams2,
                    StorageService: StorageService
                });
            }));

            it('should show an error for visit information', function () {
                expect(scope.hasError).toBe(true);
            });
        });
    });

});