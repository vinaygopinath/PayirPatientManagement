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

        var _cachedDb;

        function openDatabase() {
            var deferred = $q.defer();

            if (_cachedDb) {
                deferred.resolve(_cachedDb);
                return deferred.promise;
            }
            var Datastore = require('nedb');
            var path = require('path');
            //            require('nw.gui').App.dataPath
            _cachedDb = new Datastore({
                filename: path.join('Hello', 'ppm.db')
            });
            _cachedDb.loadDatabase(function (err) {
                if (err) {
                    console.log(err);
                    deferred.reject(err);
                } else {
                    deferred.resolve(_cachedDb);
                }
            });
            return deferred.promise;
        }

        function getPatientsList() {

        }

        function getPatient(patientId) {
            console.log(patientId);
        }

        function savePatient(patient) {
            var deferred = $q.defer();
            if (VldService.isValidPatient(patient)) {

            } else {
                deferred.reject('Validation failed');
            }
            return deferred.promise;
        }

        function deletePatient(patient) {
            console.log(patient);
        }

        return {
            'openDatabase': openDatabase,
            'getPatientsList': getPatientsList,
            'getPatient': getPatient,
            'savePatient': savePatient,
            'deletePatient': deletePatient
        };
    });