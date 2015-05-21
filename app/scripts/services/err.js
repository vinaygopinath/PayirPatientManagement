'use strict';

/**
 * @ngdoc service
 * @name PayirPatientManagement.Err
 * @description
 * # Err
 * Constant in the PayirPatientManagement.
 */
angular.module('PayirPatientManagement')
    .constant('Err', {
        'G_MISSING_TOKEN': 100,
        'G_NOT_CONNECTED': 101,
        'G_USER_CANCEL': 102,
        'G_TOKEN_PARSE': 103,
        'G_UNKNOWN': 104,
        'DB_FAIL': 105,
        'DB_UNKNOWN': 106,
        'DB_MISSING_OBJ': 107,
        'DB_VALIDATION_FAILED': 108
    });