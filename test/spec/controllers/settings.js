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

    describe('Team members', function () {

        it('should have an empty person object (for new team member details)', function () {
            expect(scope.newPerson).toEqual({});
        });

        it('should allow storing new team members', function () {
            expect(!!scope.addPersonToTeam).toBe(true);
        });

        it('should update the new team member in the local settings and reset the person object', function () {
            scope.settings = someSettingObj;
            var newPerson = {
                name: 'ABCD',
                email: 'pqrs@email.com'
            };

            scope.addPersonToTeam(newPerson);

            var updatedSettings = someSettingObj;
            updatedSettings.team.push(newPerson);
            expect(scope.settings).toEqual(updatedSettings);
            expect(scope.newPerson).toEqual({});
        });

        it('should have a function to check for uniqueness of new person', function () {
            expect(!!scope.isUniquePerson).toBe(true);
        });

        it('should check that the new person object is unique', function () {
            spyOn(scope, 'isUniquePerson');
            var newPerson = {
                name: 'ABCD',
                email: 'pqrs@email.com'
            };
            scope.addPersonToTeam(newPerson);
            expect(scope.isUniquePerson).toHaveBeenCalled();
        });

        it('unique check function should check based on name and email', function () {
            var somePerson = {
                name: 'ABCD',
                email: 'abcd@email.com'
            };
            scope.settings = [somePerson];
            var duplicatePerson = somePerson;
            var someOtherPerson = {
                name: 'PQRS',
                email: 'pqrs@email.com'
            };

            expect(scope.isUniquePerson(duplicatePerson, scope.settings)).toBeFalsy();
            expect(scope.isUniquePerson(someOtherPerson, scope.settings)).toBeTruthy();
        });

    });
});