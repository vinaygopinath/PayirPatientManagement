'use strict';

/**
 * @ngdoc service
 * @name PayirPatientManagement.Storage
 * @description
 * # Storage
 * Service in the PayirPatientManagement.
 */
angular.module('PayirPatientManagement')
    .service('StorageService', function StorageService(VldService, $q, Err) {

        var _cachedPatientDB;
        var _cachedVisitDB;
        var _cachedSettingsDB;
        var _cachedPatients;

        var PATIENT_DB = 'patient.db';
        var VISIT_DB = 'visit.db';
        var SETTINGS_DB = 'settings.db';

        function openDatabase(dbName) {
            if (!dbName) {
                throw new Error('Please specify the database name');
            }

            var dbPromise;

            if (dbName === PATIENT_DB) {
                if (_cachedPatientDB) {
                    return _cachedPatientDB.promise;
                }
                _cachedPatientDB = dbPromise = $q.defer();
            } else if (dbName === VISIT_DB) {
                if (_cachedVisitDB) {
                    return _cachedVisitDB.promise;
                }
                _cachedVisitDB = dbPromise = $q.defer();
            } else if (dbName === SETTINGS_DB) {
                if (_cachedSettingsDB) {
                    return _cachedSettingsDB.promise;
                }
                _cachedSettingsDB = dbPromise = $q.defer();
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
                filename: path.join(basePath, dbName)
            });
            db.loadDatabase(function (err) {
                if (err && err.code === 'ENOENT') {

                    dbPromise.reject(Err.DB_FAIL);
                } else if (err) {
                    dbPromise.reject(Err.DB_UNKNOWN);
                } else {
                    dbPromise.resolve(db);
                }
            });

            return dbPromise.promise;
        }


        function _updatePatientsCache(patient) {
            var pIndex = -1;
            _cachedPatients.forEach(function (cachedPatient, index) {
                if (cachedPatient.id === patient.id) {
                    pIndex = index;
                }
            });
            if (pIndex !== -1) {
                _cachedPatients[pIndex] = patient;
            } else {
                _cachedPatients.push(patient);
            }
        }

        function getPatients() {
            var deferred = $q.defer();

            if (_cachedPatients) {
                deferred.resolve(_cachedPatients);
                return deferred.promise;
            }

            var projection = {
                name: 1,
                village: 1,
                id: 1,
                gender: 1
            };
            openDatabase(PATIENT_DB).then(function (db) {
                db.find({}, projection, function (err, patients) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        _cachedPatients = patients;
                        deferred.resolve(patients || []);
                    }
                });
            });
            return deferred.promise;
        }

        function getPatient(patientId) {
            if (!patientId) {
                throw new Error('getPatient needs the patientId parameter');
            }
            var deferred = $q.defer();
            openDatabase(PATIENT_DB).then(function (db) {
                db.findOne({
                    id: patientId
                }, function (err, patient) {
                    if (err) {
                        deferred.reject(err);
                    } else if (patient) {
                        deferred.resolve(patient);
                    } else {
                        deferred.reject(Err.DB_MISSING_OBJ);
                    }
                });
            });
            return deferred.promise;
        }

        function savePatient(patient) {
            if (!patient) {
                throw new Error('savePatient needs a patient object parameter');
            }
            var deferred = $q.defer();
            if (VldService.isValidPatient(patient)) {
                if (patient.$$hashkey) {
                    delete patient.$$hashkey;
                }
                var callback = function (err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        _updatePatientsCache(patient);
                        deferred.resolve();
                    }
                };
                openDatabase(PATIENT_DB).then(function (db) {
                    if (patient._id) {
                        db.update({
                            _id: patient._id
                        }, patient, {
                            upsert: true
                        }, callback);
                    } else {
                        db.insert(patient, callback);
                    }
                });
            } else {
                deferred.reject(Err.DB_VALIDATION_FAILED);
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
            });
            return deferred.promise;
        }

        function getVisits(patientId) {
            if (!patientId) {
                throw new Error('getVisits needs patientId');
            }
            var deferred = $q.defer();
            openDatabase(VISIT_DB).then(function (db) {
                db.find({
                    'patientId': patientId
                }, function (err, visits) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        visits = visits || [];
                        deferred.resolve(visits);
                    }
                });
            });
            return deferred.promise;
        }

        function getVisit(visitId) {
            if (!visitId) {
                throw new Error('getVisit needs visitId');
            }
            var deferred = $q.defer();
            openDatabase(VISIT_DB).then(function (db) {
                db.findOne({
                    '_id': visitId
                }, function (err, visit) {
                    if (err) {
                        deferred.reject(err);
                    } else if (visit) {
                        deferred.resolve(visit);
                    } else {
                        deferred.reject(Err.DB_MISSING_OBJ);
                    }
                });
            });
            return deferred.promise;
        }

        function saveVisit(visit) {
            if (!visit) {
                throw new Error('saveVisit needs a visit object');
            }
            console.log('saveVisit');
            var deferred = $q.defer();
            if (VldService.isValidVisit(visit)) {
                if (visit.$$hashkey) {
                    delete visit.$$hashkey;
                }
                openDatabase(VISIT_DB).then(function (db) {

                    if (visit._id) {
                        db.update({
                                '_id': visit._id
                            }, visit, {
                                upsert: true
                            },
                            function (err) {
                                if (err) {
                                    deferred.reject(err);
                                } else {
                                    deferred.resolve(visit);
                                }
                            });
                    } else {
                        db.insert(visit, function (err, newDoc) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(newDoc);
                            }
                        });
                    }
                });
            } else {
                deferred.reject(Err.DB_VALIDATION_FAILED);
            }
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
                        deferred.resolve(settings);
                    }
                });
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
                });
            } else {
                deferred.reject(Err.DB_VALIDATION_FAILED);
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
                    dashboardInfo.patients.total = count;
                });

                visitDb.count({}, function (err, count) {
                    dashboardInfo.visits.total = count;
                });

                var date = new Date();
                var firstDay = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);

                visitDb.count({
                    'date': {
                        $gt: firstDay
                    }
                }, function (err, count) {
                    dashboardInfo.visits.thisMonth = count;
                });

                console.log(settingsDb);

                deferred.resolve(dashboardInfo);
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
                        deferred.reject(err);
                    } else {
                        var resArr = [];
                        angular.forEach(patients, function (patient) {
                            if (resArr.indexOf(patient.village) === -1) {
                                resArr.push(patient.village);
                            }
                        });
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
                    '_id': visitId
                }, {}, function (err, numRemoved) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(numRemoved);
                    }
                });
            });
            return deferred.promise;
        }

        function getPendingAlerts() {
            var deferred = $q.defer();
            var now = new Date();
            openDatabase(VISIT_DB).then(function (db) {
                db.find({
                    $where: function () {
                        return !!this.smsAlert.date && !!this.smsAlert.pending && this.smsAlert.date > now && this.smsAlert.pending.length > 0;
                    }
                }, function (err, visits) {
                    if (err) {
                        deferred.reject(err);
                    } else {


                        visits = visits || [];
                        var promises = [];
                        var resArr = [];

                        var findMatchingVisit = function (patient) {
                            var res;
                            visits.forEach(function (visit) {
                                if (visit.patientId === patient.id) {
                                    res = visit;
                                    return;
                                }
                            });
                            return res;
                        };

                        var sucCallback = function (patient) {
                            resArr.push({
                                'patient': patient,
                                'visit': findMatchingVisit(patient)
                            });
                        };

                        visits.forEach(function (visit) {
                            promises.push(getPatient(visit.patientId).then(sucCallback));
                        });

                        $q.all(promises).finally(function () {
                            if (resArr.length > 0) {
                                deferred.resolve(resArr);
                            } else {
                                deferred.reject('Unknown issues');
                            }
                        });
                    }
                });
            });
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
            'saveSettings': saveSettings,
            'getDashboardInfo': getDashboardInfo,
            'getVillages': getVillages,
            'deleteVisit': deleteVisit,
            'getPendingAlerts': getPendingAlerts
        };
    });