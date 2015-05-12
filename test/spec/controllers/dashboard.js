'use strict';

describe('Controller: DashboardCtrl', function () {

    // load the controller's module
    beforeEach(angular.mock.module('PayirPatientManagement'));

    var DashboardCtrl, scope;

    var someDashboardInfo = {
        patients: {
            total: 85,
            thisMonth: 12
        },
        visits: {
            total: 255,
            thisMonth: 34
        },
        followUp: [{
                name: 'Person A',
                issue: 'Fever',
                visitDate: new Date(2015, 1, 1),
                followUp: new Date(2020, 10, 10)
            },
            {
                name: 'Person B',
                issue: 'Typhoid',
                visitDate: new Date(2014, 10, 10),
                followUp: new Date(2020, 10, 10),
            }]
    };

    var StorageService = {
        getDashboardInfo: function () {
            return {
                then: function (callback) {
                    callback(someDashboardInfo);
                }
            };
        }
    };

    beforeEach(angular.mock.module(function ($provide) {
        $provide.value('StorageService', StorageService);
    }));



    describe('Initialization', function () {

        // Initialize the controller and a mock scope
        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            spyOn(StorageService, 'getDashboardInfo').and.callThrough();
            DashboardCtrl = $controller('DashboardCtrl', {
                $scope: scope,
                StorageService: StorageService
            });
        }));

        it('should fetch dashboard info', function () {
            expect(StorageService.getDashboardInfo).toHaveBeenCalled();
        });

        it('should store fetched dashboard info', function () {
            expect(scope.info).toEqual(someDashboardInfo);
        });

        it('should have patient stats', function () {
            expect(scope.info.patients).toBeDefined();
            expect(scope.info.patients.total).toBeDefined();
        });

        it('should have visit stats', function () {
            expect(scope.info.visits).toBeDefined();
            expect(scope.info.visits.total).toBeDefined();
            expect(scope.info.visits.thisMonth).toBeDefined();
        });

        it('should have an array of visits marked for follow-up', function () {
            expect(scope.info.followUp).toBeDefined();
        });
    });

    describe('Error handling', function () {

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            spyOn(StorageService, 'getDashboardInfo').and.returnValue({
                then: function (callback, errback) {
                    errback('Unknown DB error');
                }
            });
            DashboardCtrl = $controller('DashboardCtrl', {
                $scope: scope,
                StorageService: StorageService
            });
        }));

        it('should show an error when info fetch fails', function () {
            expect(scope.hasError).toBe(true);
        });
    });

});