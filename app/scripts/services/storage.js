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
        function getPatients() {
            var deferred = $q.defer();
            openDatabase(PATIENT_DB).then(function (db) {
                db.find({}, function (err, docs) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(docs);
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
            var deferred = $q.defer();
            openDatabase(PATIENT_DB).then(function (db) {
                db.findOne({
                    regNum: patientId
                }, function (err, patient) {
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
                    'regNum': patientId
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
                    regNum: patientId
                }, function (err, visits) {
                    if (err) {
                        deferred.reject(err);
                    } else {
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

        }

        function saveSettings(settings) {
            if (!settings) {
                throw new Error('saveSettings needs a settings object');
            }
            var deferred = $q.defer();
            if (VldService.isValidSettings(settings)) {
                openDatabase(SETTINGS_DB).then(function (db) {
                    db.insert(settings, function (err, savedPatient) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(savedPatient);
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
            'saveSettings': saveSettings
        };
    });