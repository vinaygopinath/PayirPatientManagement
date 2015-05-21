'use strict';

/**
 * @ngdoc service
 * @name PayirPatientManagement.Calendar
 * @description
 * # Calendar
 * Service in the PayirPatientManagement.
 */
angular.module('PayirPatientManagement')
    .service('GoogleService', function GoogleService($q, $filter, StorageService, Err) {

        //var AUTH_SUC_PAGE = '<html>\n<body>\n<h2>Google Authorization Successful<\/h2><h3>Payir Patient Management can now schedule events in your calendar and backup the patient database to your Google Drive!<\/h3><h3>You may close this tab<\/h3><\/body>\n<\/html>';
        var AUTH_SUC_PAGE = '<html>\n<body>\n<h2>Google Authorization Successful<\/h2><h3>Payir Patient Management can now schedule events in your calendar!<\/h3><h3>You may close this tab<\/h3><\/body>\n<\/html>';

        var SCOPES = ['https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/drive.appfolder'];

        var fs = require('fs');
        var google = require('googleapis');
        var GoogleAuth = require('google-auth-library');
        var calendar = google.calendar('v3');
        var open = require('open');
        var TOKEN_DIR;

        try {
            TOKEN_DIR = require('nw.gui').App.dataPath;
        } catch (err) {
            TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
                process.env.USERPROFILE);
        }

        var _credentials;

        function storeToken(email, token) {
            try {
                fs.mkdirSync(TOKEN_DIR);
            } catch (err) {
                if (err.code !== 'EEXIST') {
                    throw err;
                }
            }

            fs.writeFile(getTokenPath(email), JSON.stringify(token));
        }

        function readCredentials() {
            var deferred = $q.defer();

            if (_credentials) {
                deferred.resolve(_credentials);
            } else {
                fs.readFile('client_secret.json', function processClientSecrets(err, content) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        var credentials = JSON.parse(content);
                        _credentials = credentials;
                        deferred.resolve(credentials);
                    }
                });
            }
            return deferred.promise;
        }

        function getTokenPath(email) {
            if (!email) {
                throw new Error('Invalid email!');
            }
            email.replace(/[^a-z\d\s]+/gi, '');
            return TOKEN_DIR + '/.cred-' + email + '.json';
        }

        function readToken(email) {
            if (!email) {
                throw new Error('Invalid email!');
            }
            var deferred = $q.defer();
            fs.readFile(getTokenPath(email), function (err, token) {
                if (err) {
                    deferred.reject(Err.G_MISSING_TOKEN);
                } else {
                    deferred.resolve(JSON.parse(token));
                }
            });

            return deferred.promise;
        }

        function getClient(email) {
            if (!email) {
                throw new Error('Invalid email!');
            }
            var deferred = $q.defer();
            $q.all([readCredentials(), readToken(email)]).then(function (results) {

                var credentials = results[0];
                var token = results[1];

                if (credentials && token) {
                    var clientSecret = credentials.installed.client_secret;
                    var clientId = credentials.installed.client_id;
                    var redirectUrl = credentials.installed.redirect_uris[0];
                    var auth = new GoogleAuth();
                    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

                    oauth2Client.credentials = token;

                    deferred.resolve(oauth2Client, credentials, token);
                }
            }, function () {
                deferred.reject(Err.G_MISSING_TOKEN);
            });
            return deferred.promise;
        }

        function _createEventHelper(smsAlert, email) {

            var deferred = $q.defer();
            getClient(email).then(function (authClient) {
                    calendar.events.insert({
                        auth: authClient,
                        calendarId: 'primary',
                        sendNotifications: true,
                        resource: {
                            start: {
                                dateTime: smsAlert.startTime
                            },
                            end: {
                                dateTime: smsAlert.endTime
                            },
                            reminders: {
                                overrides: [{
                                    method: 'sms',
                                    minutes: 60
                                }],
                                useDefault: false
                            },
                            summary: smsAlert.titleStr,
                            description: smsAlert.description
                        }
                    }, function (err) {
                        if (err && err.code === 'ENOTFOUND') {
                            deferred.reject({
                                'code': Err.G_NOT_CONNECTED,
                                'email': email
                            });
                        } else if (err) {
                            deferred.reject({
                                'code': Err.G_UNKNOWN,
                                'email': email
                            });
                        } else {
                            deferred.resolve(email);
                        }
                    });
                },
                function () {
                    //                    console.log('Token missing for ', email);
                    deferred.reject({
                        'code': Err.G_MISSING_TOKEN,
                        'email': email
                    });
                });
            return deferred.promise;
        }

        function createEvent(patient, visit) {
            if (!visit || !visit.smsAlert.date) {
                throw new Error('createEvent requires a valid visit object');
            } else if (!patient) {
                throw new Error('createEvent requires a patient object');
            }

            var deferred = $q.defer();

            //Implementation detail - Converting from ISOString (value returned by NEDB) to Date object
            visit.date = new Date(visit.date);

            var startTime = visit.smsAlert.date.toISOString();
            var endTime = new Date(visit.smsAlert.date);
            endTime.setHours(visit.smsAlert.date.getHours() + 1);
            endTime = endTime.toISOString();
            var titleStr = 'SmsAlert: ' + patient.name + ' from ' + patient.village;
            var description = 'Last visited on ' + $filter('date')(visit.date, 'dd MMM') + '\nNote: ' + visit.smsAlert.message;

            var smsAlert = {
                'startTime': startTime,
                'endTime': endTime,
                'titleStr': titleStr,
                'description': description
            };

            //            console.log('Start time = ', startTime);
            //            console.log('End time = ', endTime);
            //            console.log('Title = ', titleStr);
            //            console.log('Description = ', description);
            //            console.log('Pending emails = ', visit.smsAlert.pending);
            //            console.log('Internet status = ', navigator.onLine);

            var result = {
                completed: [],
                failed: [],
                authFailure: 0,
                connFailure: 0
            };

            var errCallback = function (err) {
                result.failed.push(err.email);
                if (err && err.code && err.code === Err.G_MISSING_TOKEN) {
                    result.authFailure++;
                } else if (err && err.code && err.code === Err.G_NOT_CONNECTED) {
                    result.connFailure++;
                }
            };

            var sucCallback = function (email) {
                result.completed.push(email);
            };

            var eventPromises = [];
            angular.forEach(visit.smsAlert.pending, function (email) {
                eventPromises.push(_createEventHelper(smsAlert, email).then(sucCallback, errCallback));
            });


            $q.all(eventPromises)
                .finally(function () {
                    //console.log('Finally, evaluating result = ', result);
                    if (result.completed.length === 0) {
                        //console.log('Events not created for any emails!');
                        deferred.reject(result);
                    } else if (result.completed.length === visit.smsAlert.pending.length) {
                        //console.log('Events created for all emails');
                        delete visit.smsAlert.pending;
                        StorageService.saveVisit(visit).then(function () {
                            deferred.resolve(true);
                        });
                    } else {
                        //console.log('Events created for some emails');
                        visit.smsAlert.pending = result.failed;
                        StorageService.saveVisit(visit).then(function () {
                            deferred.resolve(false, result);
                        });
                    }
                });
            return deferred.promise;
        }

        function authorize(email) {
            var deferred = $q.defer();
            readCredentials().then(function (credentials) {
                var clientSecret = credentials.installed.client_secret;
                var clientId = credentials.installed.client_id;
                var redirectUrl = credentials.installed.redirect_uris[0];
                var auth = new GoogleAuth();
                var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

                var authUrl = oauth2Client.generateAuthUrl({
                    access_type: 'offline',
                    scope: SCOPES
                });
                open(authUrl);
                var http = require('http');
                var server = http.createServer(function (req, res) {

                    req.on('data', function () {});

                    req.on('end', function () {
                        res.writeHeader(200, {
                            'Content-Type': 'text/html'
                        });
                        //console.log('req.url.indexOf(?code) = ', req.url.indexOf('/?code'));
                        if (req.url.indexOf('/?error') !== -1) {
                            res.end('Error: User cancelled the authorization. Please close this tab');
                            server.close();
                            deferred.reject(Err.G_USER_CANCEL);
                        } else if (req.url.indexOf('/?code') !== -1) {

                            var url = require('url');
                            var parseOutput = url.parse(req.url, true);
                            //console.log('Parsed output = ', parseOutput);
                            //console.log('Query = ', parseOutput.query);
                            if (parseOutput.query) {
                                //console.log('Code = ', parseOutput.query.code);
                                oauth2Client.getToken(parseOutput.query.code, function (err, token) {
                                    if (err) {
                                        deferred.reject(Err.G_TOKEN_PARSE);
                                        res.end('Error: Failed to process the token. Please close this tab');
                                    } else {
                                        oauth2Client.credentials = token;
                                        storeToken(email, token);
                                        deferred.resolve();
                                        res.end(AUTH_SUC_PAGE);
                                    }
                                    server.close();
                                });
                            }
                        }
                    });
                });
                server.listen(9000);
            });
            return deferred.promise;
        }

        return {
            'readToken': readToken,
            'createEvent': createEvent,
            'authorize': authorize
        };
    });