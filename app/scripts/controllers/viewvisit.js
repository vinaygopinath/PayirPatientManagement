'use strict';

/**
 * @ngdoc function
 * @name PayirPatientManagement.controller:ViewVisitCtrl
 * @description
 * # ViewVisitCtrl
 * Controller of the PayirPatientManagement
 */
angular.module('PayirPatientManagement')
    .controller('ViewVisitCtrl', function ($scope, visit, $mdDialog) {
        if (visit) {
            $scope.visit = visit;
        }

        console.log('Visit = ', $scope.visit);
        console.log('Visit date Raw = ', {
            'blah': $scope.visit.smsAlert.date
        });
        console.log('Visit date Date = ', {
            'blah': new Date($scope.visit.smsAlert.date)
        });
        console.log('Visit date ISO? = ', {
            'blah': new Date($scope.visit.smsAlert.date.toISOString())
        });
        console.log('Visit date parse? = ', {
            'blah': new Date(Date.parse($scope.visit.smsAlert.date))
        });
        var dt = new Date($scope.visit.smsAlert.date);
        var resDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), 0, 0);
        console.log('Visit date parse + ISO? = ', {
            'year': dt.getFullYear(),
            'month': dt.getMonth(),
            'date': dt.getDate(),
            'hours': dt.getHours(),
            'mins': dt.getMinutes(),
            'secs': dt.getSeconds()
        });

        console.log('Processed date = ', {
            'blah': resDate
        });

        $scope.close = function () {
            $mdDialog.cancel();
        };

        $scope.delete = function () {
            $mdDialog.hide();
        };
    });