'use strict';

describe('Controller: PatientListCtrl', function () {

    // load the controller's module
    beforeEach(angular.mock.module('PayirPatientManagement'));

    var PatientListCtrl,
        scope;

    var someValidPatientObjs = [{
        id: '12345',
        name: 'Some Name',
        village: 'Thenur',
        gender: 1
    }, {
        id: '5678',
        name: 'Another Person',
        village: 'Thenur',
        gender: 2
    }, {
        id: '9876',
        name: 'Third Person',
        village: 'Edumalai',
        gender: 1
    }];

    var StorageService = {
        getPatients: function () {
            return {
                then: function (callback, errback, notiback) {
                    notiback(someValidPatientObjs);
                }
            };
        }
    };

    beforeEach(angular.mock.module(function ($provide) {
        $provide.value('StorageService', StorageService);
    }));



    describe('Initialization and functions', function () {

        beforeEach(inject(function ($controller, $rootScope, _StorageService_) {
            scope = $rootScope.$new();
            spyOn(StorageService, 'getPatients').and.callThrough();
            PatientListCtrl = $controller('PatientListCtrl', {
                $scope: scope,
                StorageService: _StorageService_
            });
        }));

        describe('Get Patients', function () {
            it('should fetch a list of patients', function () {
                expect(StorageService.getPatients).toHaveBeenCalled();
            });

            it('should fetch only a trimmed list of patients', function () {
                expect(StorageService.getPatients).toHaveBeenCalledWith(true);
            });

            it('should store the list of patients', function () {
                expect(scope.patients).toEqual(someValidPatientObjs);
            });
        });

        describe('Search', function () {

            it('should be defined', function () {
                expect(!!scope.search).toBe(true);
            });

            it('should start with an empty string query', function () {
                expect(scope.searchStr).toEqual('');
            });
        });

        describe('Clear search', function () {

            it('should be defined', function () {
                expect(!!scope.clearSearch).toBe(true);
            });

            it('should reset the search query to empty string', function () {
                scope.clearSearch();
                expect(scope.searchStr).toEqual('');
            });
        });


    });

    describe('Error', function () {

        beforeEach(inject(function ($controller, $rootScope, _StorageService_) {
            scope = $rootScope.$new();
            spyOn(StorageService, 'getPatients').and.returnValue({
                then: function (callback, errback) {
                    errback();
                }
            });
            PatientListCtrl = $controller('PatientListCtrl', {
                $scope: scope,
                StorageService: _StorageService_
            });
        }));


        it('should show an error message in case of getPatients error', function () {
            expect(scope.hasError).toBe(true);
        });
    });

});