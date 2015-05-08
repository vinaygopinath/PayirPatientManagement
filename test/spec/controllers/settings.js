'use strict';

describe('Controller: SettingsCtrl', function () {

    // load the controller's module
    beforeEach(angular.mock.module('PayirPatientManagement'));

    var SettingsCtrl,
        scope;

    var someSettingObj = {
        team: [{
            name: 'PersonA',
            email: 'person.a@email.com'
                }, {
            name: 'PersonB',
            email: 'personb@mail.com'
                }],
        lastSync: new Date(0)
    };

    var fakePromise = function () {
        return {
            then: function (callback) {
                callback(someSettingObj);
            }
        };
    };

    var StorageService = {
        getSettings: fakePromise,
        saveSettings: fakePromise
    };

    beforeEach(angular.mock.module(function ($provide) {
        $provide.value('StorageService', StorageService);
    }));

    describe('Get Settings', function () {

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            spyOn(StorageService, 'getSettings').and.callThrough();
            SettingsCtrl = $controller('SettingsCtrl', {
                $scope: scope,
                StorageService: StorageService
            });
        }));


        it('should fetch settings on init', function () {
            expect(StorageService.getSettings).toHaveBeenCalled();
        });

        it('should store fetched settings', function () {
            expect(scope.settings).toEqual(someSettingObj);
        });
    });

    describe('Save Settings', function () {

        var VldService;
        beforeEach(inject(function ($controller, $rootScope, _VldService_) {
            scope = $rootScope.$new();
            VldService = _VldService_;
            SettingsCtrl = $controller('SettingsCtrl', {
                $scope: scope,
                StorageService: StorageService,
                VldService: VldService
            });
        }));

        it('should be defined', function () {
            expect(!!scope.saveSettings).toBe(true);
        });

        it('should validate the settings object', function () {
            spyOn(VldService, 'isValidSettings');
            scope.saveSettings({});
            expect(VldService.isValidSettings).toHaveBeenCalled();
        });

        it('should show validation error for invalid objects', function () {
            scope.saveSettings({});
            expect(scope.hasValErrors).toBe(true);
        });

        it('should save valid settings in database', function () {
            spyOn(StorageService, 'saveSettings').and.callThrough();
            scope.saveSettings(someSettingObj);
            expect(StorageService.saveSettings).toHaveBeenCalled();
        });

        it('should not save invalid settings in database', function () {
            spyOn(StorageService, 'saveSettings');
            scope.saveSettings({});
            expect(StorageService.saveSettings).not.toHaveBeenCalled();
        });
    });

});