'use strict';

/**
 * @ngdoc service
 * @name PayirPatientManagement.Storage
 * @description
 * # Storage
 * Service in the PayirPatientManagement.
 */
angular.module('PayirPatientManagement')
    .service('StorageService', function StorageService(VldService, $q) {

        var _cachedPatientDB;
        var _cachedVisitDB;
        var _cachedSettingsDB;
        var _cachedListPromise;

        var PATIENT_DB = 'patient.db';
        var VISIT_DB = 'visit.db';
        var SETTINGS_DB = 'settings.db';

        function openDatabase(dbName) {
            var deferred = $q.defer();

            if (_cachedPatientDB && dbName === PATIENT_DB) {
                deferred.resolve(_cachedPatientDB);
                return deferred.promise;
            } else if (_cachedVisitDB && dbName === VISIT_DB) {
                deferred.resolve(_cachedVisitDB);
                return deferred.promise;
            } else if (_cachedSettingsDB && dbName === SETTINGS_DB) {
                deferred.resolve(_cachedSettingsDB);
                return deferred.promise;
            }
            var Datastore = require('nedb');
            var path = require('path');
            var basePath;
            try {
                basePath = require('nw.gui').App.dataPath;
            } catch (err) {
                basePath = '/tmp';
            }
            var db = new Datastore({
                filename: path.join(basePath, (dbName || 'ppm.db'))
            });
            db.loadDatabase(function (err) {
                if (err) {
                    console.log(err);
                    deferred.reject(err);
                } else {
                    if (dbName === PATIENT_DB) {
                        _cachedPatientDB = db;
                    } else if (dbName === VISIT_DB) {
                        _cachedVisitDB = db;
                    } else if (dbName === SETTINGS_DB) {
                        _cachedSettingsDB = db;
                    }
                    deferred.resolve(db);
                }
            });
            return deferred.promise;
        }

        //TODO Accept an argument to provide a subset of properties
        //TODO Handle empty fetch
        function getPatients(subset) {
            var deferred = $q.defer();
            var projection = (subset) ? {
                name: 1,
                village: 1,
                id: 1,
                gender: 1
            } : {};

            openDatabase(PATIENT_DB).then(function (db) {
                db.find({}, projection, function (err, patients) {
                    if (err) {
                        deferred.reject(err);
                    } else if (subset) {
                        _cachedListPromise = deferred;
                        console.log('Saved promise ', _cachedListPromise);
                        deferred.notify(patients);
                    } else {
                        deferred.resolve(patients);
                    }
                });
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        //TODO Handle empty fetch
        function getPatient(patientId) {
            if (!patientId) {
                throw new Error('getPatient needs the patientId parameter');
            }
            console.log('Step 1');
            var deferred = $q.defer();
            console.log('Step 1A');
            openDatabase(PATIENT_DB).then(function (db) {
                console.log('Step 2?');
                db.findOne({
                    id: patientId
                }, function (err, patient) {
                    console.log('Step 3?');
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(patient);
                    }
                });
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        //TODO Accept a parameter to control save vs update
        function savePatient(patient) {
            if (!patient) {
                throw new Error('savePatient needs a patient object parameter');
            }
            var deferred = $q.defer();
            if (VldService.isValidPatient(patient)) {
                openDatabase(PATIENT_DB).then(function (db) {
                    db.insert(patient, function (err, savedPatient) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(savedPatient);
                            if (_cachedListPromise) {
                                console.log('Notifying promise');
                                _cachedListPromise.notify(savedPatient);
                            }
                        }
                    });
                    console.log(db);
                }, function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.reject('Validation failed');
            }
            return deferred.promise;
        }

        function deletePatient(patientId) {
            if (!patientId) {
                throw new Error('deletePatient needs the patient ID');
            }
            var deferred = $q.defer();
            openDatabase(PATIENT_DB).then(function (db) {
                db.remove({
                    'id': patientId
                }, {}, function (err, numRemoved) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(numRemoved);
                    }
                });
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        //TODO Handle empty fetch
        function getVisits(patientId) {
            if (!patientId) {
                throw new Error('getVisits needs patientId');
            }
            var deferred = $q.defer();
            console.log('Here');
            openDatabase(VISIT_DB).then(function (db) {
                db.find({
                    id: patientId
                }, function (err, visits) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        visits = visits || [];
                        deferred.resolve(visits);
                    }
                });
            }, function (err) {
                deferred.reject(err);
            });
            console.log('Reaching this return');
            return deferred.promise;
        }

        //TODO Handle empty fetch
        function getVisit(visitId) {
            if (!visitId) {
                throw new Error('getVisit needs visitId');
            }
            var deferred = $q.defer();
            openDatabase(VISIT_DB).then(function (db) {
                db.findOne({
                    visitId: visitId
                }, function (err, visit) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        visit = visit || {};
                        deferred.resolve(visit);
                    }
                });
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        //TODO Accept a parameter to control save vs update
        function saveVisit(visit) {
            if (!visit) {
                throw new Error('saveVisit needs a visit object');
            }
            var deferred = $q.defer();
            return deferred.promise;
        }

        function getSettings() {
            var deferred = $q.defer();
            openDatabase(SETTINGS_DB).then(function (db) {
                db.findOne({}, function (err, settings) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        settings = settings || {};
                        settings.team = settings.team || [];
                        //                        settings.lastSync = settings.lastSync || new Date(0);
                        deferred.resolve(settings);
                    }
                });
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function saveSettings(settings) {
            if (!settings) {
                throw new Error('saveSettings needs a settings object');
            }
            var deferred = $q.defer();
            if (VldService.isValidSettings(settings)) {
                openDatabase(SETTINGS_DB).then(function (db) {
                    db.update({}, settings, {
                        upsert: true
                    }, function (err) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve();
                        }
                    });
                }, function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.reject('Validation failed');
            }

            return deferred.promise;
        }

        function getDashboardInfo() {
            var deferred = $q.defer();
            $q.all([openDatabase(PATIENT_DB), openDatabase(VISIT_DB), openDatabase(SETTINGS_DB)]).then(function (db) {
                var patientDb = db[0];
                var visitDb = db[1];
                var settingsDb = db[2];

                var dashboardInfo = {
                    patients: {},
                    visits: {},
                    followUp: []
                };

                patientDb.count({}, function (err, count) {
                    console.log('Total Patient count', count);
                    dashboardInfo.patients.total = count;
                });

                visitDb.count({}, function (err, count) {
                    console.log('Total visit count', count);
                    dashboardInfo.visits.total = count;
                });

                var date = new Date();
                var firstDay = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);

                visitDb.count({
                    'date': {
                        $gt: firstDay
                    }
                }, function (err, count) {
                    console.log('Total visit thisMonth count', count);
                    dashboardInfo.visits.thisMonth = count;
                });

                console.log(settingsDb);

                deferred.resolve(dashboardInfo);
                //TODO Provide followUp array
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function getVillages() {
            var deferred = $q.defer();
            openDatabase(PATIENT_DB).then(function (db) {
                db.find({}, {
                    village: 1
                }, function (err, patients) {
                    if (err) {
                        console.log('Error in getVillages');
                        deferred.reject(err);
                    } else {
                        console.log('patients=', patients);
                        var resArr = [];
                        angular.forEach(patients, function (patient) {
                            if (resArr.indexOf(patient.village) === -1) {
                                resArr.push(patient.village);
                            }
                        });
                        console.log('Returning ', resArr);
                        deferred.resolve(resArr);
                    }
                });
            });
            return deferred.promise;
        }

        function deleteVisit(visitId) {
            if (!visitId) {
                throw new Error('deleteVisit needs an ID parameter');
            }
            var deferred = $q.defer();
            openDatabase(VISIT_DB).then(function (db) {
                db.remove({
                    'id': visitId
                }, {}, function (err, numRemoved) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(numRemoved);
                    }
                });
            }, function (err) {
                deferred.reject(err);
            });
            return deferred;
        }

        return {
            'openDatabase': openDatabase,
            'getPatients': getPatients,
            'getPatient': getPatient,
            'savePatient': savePatient,
            'deletePatient': deletePatient,
            'getVisits': getVisits,
            'getVisit': getVisit,
            'saveVisit': saveVisit,
            'getSettings': getSettings,
            'saveSettings': saveSettings,
            'getDashboardInfo': getDashboardInfo,
            'getVillages': getVillages,
            'deleteVisit': deleteVisit
        };
    });