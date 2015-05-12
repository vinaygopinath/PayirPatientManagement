'use strict';

/**
 * @ngdoc filter
 * @name PayirPatientManagement.filter:bloodGroup
 * @function
 * @description
 * # bloodGroup
 * Filter in the PayirPatientManagement.
 */
angular.module('PayirPatientManagement')
    .filter('bloodGroupFilter', function () {
        return function (input) {
            if (input) {
                try {
                    var num = parseInt(input);
                    switch (num) {
                    case 1:
                        return 'A+';
                    case 2:
                        return 'A-';
                    case 3:
                        return 'B+';
                    case 4:
                        return 'B-';
                    case 5:
                        return 'AB+';
                    case 6:
                        return 'AB-';
                    case 7:
                        return 'O+';
                    case 8:
                        return 'O-';
                    default:
                        return 'Invalid';
                    }
                } catch (err) {
                    return 'Invalid';
                }
            }
            return 'Unknown';
        };
    });