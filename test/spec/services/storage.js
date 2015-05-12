'use strict';

require('nedb');
describe('Service: StorageService', function () {

    var PATIENT_DB = 'patient.db';
    var VISIT_DB = 'visit.db';
    var SETTINGS_DB = 'settings.db';

    // load the service's module
    beforeEach(angular.mock.module('PayirPatientManagement'));


    // instantiate service
    var StorageService, VldService, rootScope, q;
    beforeEach(inject(function ($rootScope, $injector, $q) {
        q = $q;
        rootScope = $rootScope;
        StorageService = $injector.get('StorageService');
        VldService = $injector.get('VldService');
    }));

    describe('openDatabase', function () {
        it('should be defined', function () {
            expect(!!StorageService.openDatabase).toBe(true);
        });

        //        it('should return a database', function (done) {
        //            var result;
        //            StorageService.openDatabase().then(function (db) {
        //                result = db;
        //                done();
        //            }, function (err) {
        //                result = err;
        //                done();
        //            });
        //            rootScope.$digest();
        //            expect(result).toBe(true);
        //        });



        //        it('should return the datastore', function () {
        //            var deferred = q.defer();
        //            var mockDbObj = {
        //                name: 'mockDB'
        //            };
        //            deferred.resolve(mockDbObj);
        //            spyOn(StorageService, 'openDatabase').and.returnValue(deferred.promise);
        //
        //            var result;
        //            StorageService.openDatabase().then(function (db) {
        //                result = db;
        //                console.log("Received DB = ", db);
        //            }, function (err) {
        //                console.log("Err = ", err);
        //            });
        //            rootScope.$apply();
        //            expect(result).toBeTruthy();
        //        });
    });

    describe('getPatients', function () {

        it('should be defined', function () {
            expect(!!StorageService.getPatients).toBe(true);
        });

        //        it('should return a list of patients', function () {
        //
        //            var db;
        //            StorageService.openDatabase('test.db').then(function (database) {
        //                db = database;
        //            });
        //            spyOn(StorageService, 'openDatabase').and.callFake(function () {
        //                var deferred = q.defer();
        //                deferred.resolve(db);
        //                return deferred.promise;
        //            });
        //
        //            var result;
        //            StorageService.getPatients().then(function (database) {
        //                database.find({}, function (res) {
        //                    console.log('Search ended');
        //                    result = res;
        //                });
        //            }, function (err) {
        //                result = err;
        //            });
        //            rootScope.$digest();
        //            expect(result).toBeTruthy();
        //        });
    });

    describe('getPatient', function () {
        it('should be defined', function () {
            expect(!!StorageService.getPatient).toBe(true);
        });

        it('should throw when patientId parameter is missing', function () {
            expect(function () {
                StorageService.getPatient();
            }).toThrow();
        });

        it('should be defined', function () {
            expect(!!StorageService.getSettings).toBe(true);
        });

        xit('should open the patient database', function () {
            var fakeDb = {
                findOne: function () {}
            };
            var fakeSucPromise = {
                then: function (callback) {
                    callback(fakeDb);
                }
            };
            var somePatientId = '1234';
            var openDatabase = jasmine.createSpy('openDatabase');
            console.log(openDatabase);
            //spyOn(StorageService, 'openDatabase').and.returnValue(fakeSucPromise);
            StorageService.getPatient(somePatientId);
            expect(openDatabase).toHaveBeenCalledWith(PATIENT_DB);
        });
    });

    describe('savePatient', function () {
        it('should be defined', function () {
            expect(!!StorageService.savePatient).toBe(true);
        });

        it('should throw when patient parameter is missing', function () {
            expect(function () {
                StorageService.savePatient();
            }).toThrow();
        });

        it('should validate the patient object', function () {
            spyOn(VldService, 'isValidPatient');
            var someObj = {};
            StorageService.savePatient(someObj);
            expect(VldService.isValidPatient).toHaveBeenCalled();
        });

        it('should fail for invalid patient objects', function () {
            var someInvalidObj = {};
            StorageService.savePatient(someInvalidObj).then(function () {}, function (err) {
                expect(err).toBeTruthy();
            });
            rootScope.$digest();
        });

        it('should work for valid objects', function () {
            var someValidPatientObj = {
                id: '12345',
                gender: 1,
                name: 'Some Name',
                age: 30,
                contactNum: '1234567890',
                village: 'Thenur'
            };

            StorageService.savePatient(someValidPatientObj).then(function (suc) {
                expect(suc).toBe(true);
            });
            rootScope.$digest();
        });
    });

    describe('deletePatient', function () {
        it('should be defined', function () {
            expect(!!StorageService.deletePatient).toBe(true);
        });
    });

    describe('Get settings', function () {
        var fakeDb = {
            find: function () {}
        };
        var fakeSucPromise = {
            then: function (callback) {
                callback(fakeDb);
            }
        };

        it('should be defined', function () {
            expect(!!StorageService.getSettings).toBe(true);
        });

        xit('should open the settings database', function () {
            spyOn(StorageService, 'openDatabase').and.returnValue(fakeSucPromise);
            expect(StorageService.openDatabase).toHaveBeenCalledWith(SETTINGS_DB);
        });
    });

    describe('Save settings', function () {
        it('should be defined', function () {
            expect(!!StorageService.saveSettings).toBe(true);
        });

        it('should throw when settings object is missing', function () {
            expect(function () {
                StorageService.saveSettings();
            }).toThrow();
        });

        it('should validate the settings object', function () {
            spyOn(VldService, 'isValidSettings');
            var someObj = {};
            StorageService.saveSettings(someObj);
            expect(VldService.isValidSettings).toHaveBeenCalled();
        });

        it('should fail for invalid settings objects', function () {
            var someInvalidObj = {};
            StorageService.saveSettings(someInvalidObj).then(function () {}, function (err) {
                expect(err).toBeTruthy();
            });
            rootScope.$digest();
        });
    });

    //TODO Mock openDatabase call and fix all the get functions 
    xdescribe('Dashboard information', function () {

        it('should be defined', function () {
            expect(!!StorageService.getDashboardInfo).toBe(true);
        });

        it('should return a dashboard info object', function (done) {
            StorageService.getDashboardInfo().then(function (dashboardInfo) {
                expect(!!dashboardInfo).toBe(true);
                done();
            });
            rootScope.$digest();
        });

        it('should provide patient stats in info', function (done) {
            StorageService.getDashboardInfo().then(function (dashboardInfo) {
                expect(!!dashboardInfo.patients).toBe(true);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('Get villages', function () {
        var fakeDb = {
            find: function () {}
        };
        var fakeSucPromise = {
            then: function (callback) {
                callback(fakeDb);
            }
        };

        it('should be defined', function () {
            expect(!!StorageService.getVillages).toBe(true);
        });

        xit('should open the patient database', function () {

            spyOn(StorageService, 'openDatabase').and.returnValue(fakeSucPromise);

            StorageService.getVillages();

            expect(StorageService.openDatabase).toHaveBeenCalledWith(PATIENT_DB);
        });

        xit('should fetch all villages', function () {
            spyOn(fakeDb, 'find');

            StorageService.getVillages();

            expect(fakeDb.find).toHaveBeenCalledWith({}, {
                village: 1
            }, jasmine.any(Function));
        });
    });

    describe('Get visit', function () {
        var fakeDb = {
            find: function () {}
        };
        var fakeSucPromise = {
            then: function (callback) {
                callback(fakeDb);
            }
        };

        it('should be defined', function () {
            expect(!!StorageService.getVisit).toBe(true);
        });

        xit('should open the visit database', function () {
            spyOn(StorageService, 'openDatabase').and.returnValue(fakeSucPromise);
            expect(StorageService.openDatabase).toHaveBeenCalledWith(VISIT_DB);
        });
    });

});