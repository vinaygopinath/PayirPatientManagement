angular.module('PayirPatientManagement', ['ngAnimate', 'ngRoute', 'ngMaterial'])
    .config(function ($routeProvider) {
        'use strict';
        $routeProvider.when('/patient/new', {
            templateUrl: 'views/addpatient.html',
            controller: 'AddPatientCtrl'
        }).when('/patient/:patientId/edit', {
            templateUrl: 'views/addpatient.html',
            controller: 'AddPatientCtrl'
        }).when('/patient/:patientId', {
            templateUrl: 'views/viewpatient.html',
            controller: 'ViewPatientCtrl'
        }).when('/patient/:patientId/visit/new', {
            templateUrl: 'views/addvisit.html',
            controller: 'AddVisitCtrl'
        }).when('/patient/:patientId/visit/:visitId', {
            templateUrl: 'views/viewvisit.html',
            controller: 'ViewVisitCtrl'
        }).when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardCtrl'
        }).when('/settings', {
            templateUrl: 'views/settings.html',
            controller: 'SettingsCtrl'
        }).otherwise({
            redirectTo: '/dashboard'
        });
    });