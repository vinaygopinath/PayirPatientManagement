'use strict';

require('nedb');
describe('Service: StorageService', function () {

    var PATIENT_DB = 'patient.db';
    var VISIT_DB = 'visit.db';
    var SETTINGS_DB = 'settings.db';
    var TEST_DB = 'test.db';

    //TODO [Critical] Rewrite tests 

    // load the service's module
    beforeEach(angular.mock.module('PayirPatientManagement'));
    var deferred = function () {
        return {
            promise: {
                then: function (callback) {
                    callback();
                }
            },
            reject: function () {},
            resolve: function () {}
        };
    };
    var q = {
        defer: deferred
    };

    beforeEach(function () {

        angular.mock.module(function ($provide) {
            $provide.value('$q', q);
        });

    });

    // instantiate service
    var StorageService, VldService, rootScope, Datastore, spiedOpenDatabase;
    beforeEach(inject(function ($rootScope, _VldService_, _StorageService_) {
        rootScope = $rootScope;
        StorageService = _StorageService_;
        Datastore = require('nedb');
        spyOn(q, 'defer').and.callThrough();
        spiedOpenDatabase = spyOn(StorageService, 'openDatabase');
        spiedOpenDatabase.and.callThrough();
        spyOn(window, 'require').and.callFake(function (mod) {
            if (mod === 'nedb') {
                return Datastore;
            } else if (mod === 'path') {
                return {
                    join: function () {
                        return TEST_DB;
                    }
                };
            } else {
                throw new Error('Unsupported test module!');
            }
        });
        StorageService = _StorageService_;
        VldService = _VldService_;
    }));

    describe('openDatabase', function () {
        it('should be defined', function () {
            expect(!!StorageService.openDatabase).toBe(true);
        });

        it('should create a promise', function () {
            StorageService.openDatabase(PATIENT_DB);
            expect(q.defer).toHaveBeenCalled();
        });

        it('should require the nedb module', function () {
            StorageService.openDatabase(PATIENT_DB);
            expect(window.require).toHaveBeenCalledWith('nedb');
        });

        it('should require the path module', function () {
            StorageService.openDatabase(PATIENT_DB);
            expect(window.require).toHaveBeenCalledWith('path');
        });
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
            //            .and.callFake(function () {
            //                return new Datastore({
            //                    filename: TEST_DB
            //                });
            //            });
            StorageService.getPatient('1234');
            //expect(openDatabase).toHaveBeenCalled();

            //            var fakeDb = {
            //                findOne: function () {}
            //            };
            //            var fakeSucPromise = {
            //                then: function (callback) {
            //                    callback(fakeDb);
            //                }
            //            };
            //            var somePatientId = '1234';
            //            var openDatabase = jasmine.createSpy('openDatabase');
            //            console.log(openDatabase);
            //            spyOn(StorageService, 'openDatabase').and.returnValue(fakeSucPromise);
            //            StorageService.getPatient(somePatientId);
            //            expect(openDatabase).toHaveBeenCalledWith(PATIENT_DB);
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

    describe('Delete visit', function () {

        it('should be defined', function () {
            expect(!!StorageService.deleteVisit).toBe(true);
        });

        it('should throw an error when called without a visit ID', function () {
            expect(function () {
                StorageService.deleteVisit();
            }).toThrow();
        });
    });

});