/*jshint camelcase: false*/

module.exports = function (grunt) {
    'use strict';

    // load all grunt tasks
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var config = {
        app: 'app',
        dist: 'dist',
        distLinux32: 'dist/Linux32',
        distLinux64: 'dist/Linux64',
        distWin: 'dist/Win',
        tmp: 'buildTmp',
        resources: 'resources'
    };

    grunt.initConfig({
        config: config,
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
            '<%= config.dist %>/*',
            '<%= config.tmp %>/*'
          ]
        }]
            },
            distLinux64: {
                files: [{
                    dot: true,
                    src: [
            '<%= config.distLinux64 %>/*',
            '<%= config.tmp %>/*'
          ]
        }]
            },
            distLinux32: {
                files: [{
                    dot: true,
                    src: [
            '<%= config.distLinux32 %>/*',
            '<%= config.tmp %>/*'
          ]
        }]
            },
            distWin: {
                files: [{
                    dot: true,
                    src: [
            '<%= config.distWin %>/*',
            '<%= config.tmp %>/*'
                ]
            }]
            },
            postBuild: {
                files: [{
                    dot: true,
                    src: ['<%= config.tmp %>']
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: ['<%= config.app %>/scripts/{,*/}*.js', 'test/spec/{,*/}*.js']
        },
        copy: {
            appLinux64: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.distLinux64 %>/app.nw',
                    src: ['**', '!node_modules/bower/**', '!node_modules/*grunt*/**', '!node_modules/**/test*/**', '!node_modules/**/doc*/**', '!node_modules/**/example*/**', '!node_modules/**/demo*/**', '!node_modules/**/bin/**', '!node_modules/**/package.json', '!node_modules/**/*.md', '!node_modules/**/*.txt']
        }]
            },
            appLinux32: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.distLinux32 %>/app.nw',
                    src: ['**', '!node_modules/bower/**', '!node_modules/*grunt*/**', '!node_modules/**/test*/**', '!node_modules/**/doc*/**', '!node_modules/**/example*/**', '!node_modules/**/demo*/**', '!node_modules/**/bin/**', '!node_modules/**/package.json', '!node_modules/**/*.md', '!node_modules/**/*.txt']
        }]
            },
            copyWinToTmp: {
                files: [{
                    expand: true,
                    cwd: '<%= config.resources %>/node-webkit/Windows/',
                    dest: '<%= config.tmp %>/',
                    src: '**'
        }, {
                    expand: true,
                    cwd: '<%= config.app %>',
                    src: ['**', '!node_modules/bower/**', '!node_modules/*grunt*/**', '!node_modules/**/test*/**', '!node_modules/**/doc*/**', '!node_modules/**/example*/**', '!node_modules/**/demo*/**', '!node_modules/**/bin/**', '!node_modules/**/package.json', '!node_modules/**/*.md', '!node_modules/**/*.txt'],
                    dest: '<%= config.tmp %>/app/'
        }]
            },
            distWin: {
                files: [{
                    expand: true,
                    cwd: '<%= config.tmp %>',
                    src: '**',
                    dest: '<%= config.distWin %>/PayirPatientManagement/'
                }]
            }
        },
        compress: {
            tmpApp: {
                options: {
                    archive: '<%= config.tmp %>/app.zip'
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.tmp %>/app',
                    src: ['**']
        }]
            },
            finalWindowsApp: {
                options: {
                    archive: '<%= config.distWin %>/PayirPatientManagement.zip'
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.tmp %>',
                    src: ['**']
        }]
            }
        },
        rename: {
            zipToApp: {
                files: [{
                    src: '<%= config.tmp %>/app.zip',
                    dest: '<%= config.tmp %>/app.nw'
        }]
            }
        },
        htmlmin: {
            options: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                collapseBooleanAttributes: true,
                removeCommentsFromCDATA: true,
                removeOptionalTags: true
            },
            distLinux64: {
                files: [{
                    expand: true,
                    cwd: '<%= config.distLinux64 %>/app.nw',
                    src: ['*.html', 'views/{,*/}*.html'],
                    dest: '<%= config.distLinux64 %>/app.nw'
                    }]
            },
            distLinux32: {
                files: [{
                    expand: true,
                    cwd: '<%= config.distLinux32 %>/app.nw',
                    src: ['*.html', 'views/{,*/}*.html'],
                    dest: '<%= config.distLinux32 %>/app.nw'
                    }]
            },
            distWin: {
                files: [{
                    expand: true,
                    cwd: '<%= config.tmp %>/app',
                    src: ['*.html', 'views/{,*/}*.html'],
                    dest: '<%= config.tmp %>/app'
                }]
            }
        },
        ngAnnotate: {
            distLinux64: {
                files: [{
                    expand: true,
                    src: ['<%= config.distLinux64 %>/app.nw/scripts/{,*/}*.js'],
                    }]
            },
            distLinux32: {
                files: [{
                    expand: true,
                    src: ['<%= config.distLinux32 %>/app.nw/scripts/{,*/}*.js'],
                    }]
            },
            distWin: {
                files: [{
                    expand: true,
                    src: ['<%= config.tmp %>/app/scripts/{,*/}*.js'],
                    }]
            }
        },


        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                logLevel: 'INFO'
            }
        },

        //        nodewebkit: {
        //            options: {
        //                version: '0.12.0',
        //                build_dir: './build',
        //                keep_nw: true,
        //                embed_nw: false,
        //            },
        //            src: ['./app/**', '!./app/node_modules/bower/**', '!./app/node_modules/*grunt*/**',
        //    '!./app/node_modules/**/test*/**', '!./app/node_modules/**/doc*/**', '!./app/node_modules/**/example*/**', '!./app/node_modules/**/demo*/**', '!./app/node_modules/**/bin/**',
        //    '!./app/node_modules/**/package.json', '!./app/node_modules/**/*.md', '!./app/node_modules/**/*.txt']
        //        }
        //        useminPrepare: {
        //            distLinux32: {
        //                html: '<%= config.distLinux32 %>/app.nw/index.html',
        //                options: {
        //                    dest: '<%= yeoman.distLinux32 %>/app.nw',
        //                    flow: {
        //                        html: {
        //                            steps: {
        //                                js: ['concat', 'uglifyjs'],
        //                                css: ['cssmin']
        //                            }
        //                        }
        //                    }
        //                }
        //            },
        //            distLinux64: {
        //                html: '<%= config.distLinux64 %>/app.nw/index.html',
        //                options: {
        //                    dest: '<%= yeoman.distLinux64 %>/app.nw',
        //                    flow: {
        //                        html: {
        //                            steps: {
        //                                js: ['concat', 'uglifyjs'],
        //                                css: ['cssmin']
        //                            }
        //                        }
        //                    }
        //                }
        //            },
        //            distWin: {
        //                html: '<%= config.tmp %>/app/index.html',
        //                options: {
        //                    dest: '<%= config.tmp %>/app/',
        //                    flow: {
        //                        html: {
        //                            steps: {
        //                                js: ['concat', 'uglifyjs'],
        //                                css: ['cssmin']
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //        }
    });

    grunt.registerTask('createLinuxApp', 'Create linux distribution.', function (version) {
        var done = this.async();
        var childProcess = require('child_process');
        var exec = childProcess.exec;
        var path = './' + (version === 'Linux64' ? config.distLinux64 : config.distLinux32);
        exec('mkdir -p ' + path + '; cp resources/node-webkit/' + version + '/nw.pak ' + path + ' && cp resources/node-webkit/' + version + '/nw ' + path + '/node-webkit && cp resources/node-webkit/' + version + '/icudtl.dat ' + path + '/icudtl.dat', function (error, stdout, stderr) {
            var result = true;
            if (stdout) {
                grunt.log.write(stdout);
            }
            if (stderr) {
                grunt.log.write(stderr);
            }
            if (error !== null) {
                grunt.log.error(error);
                result = false;
            }
            done(result);
        });
    });

    grunt.registerTask('createWindowsApp', 'Create windows distribution.', function () {
        var done = this.async();
        var concat = require('concat-files');
        concat([
      'buildTmp/nw.exe',
      'buildTmp/app.nw'
    ], 'buildTmp/PayirPatientManagement.exe', function () {
            var fs = require('fs');
            fs.unlink('buildTmp/app.nw', function (error, stdout, stderr) {
                if (stdout) {
                    grunt.log.write(stdout);
                }
                if (stderr) {
                    grunt.log.write(stderr);
                }
                if (error !== null) {
                    grunt.log.error(error);
                    done(false);
                } else {
                    fs.unlink('buildTmp/nw.exe', function (error, stdout, stderr) {
                        var result = true;
                        if (stdout) {
                            grunt.log.write(stdout);
                        }
                        if (stderr) {
                            grunt.log.write(stderr);
                        }
                        if (error !== null) {
                            grunt.log.error(error);
                            result = false;
                        }
                        done(result);
                    });
                }
            });
        });
    });

    grunt.registerTask('setVersion', 'Set version to all needed files', function (version) {
        var config = grunt.config.get(['config']);
        var appPath = config.app;
        var resourcesPath = config.resources;
        var mainPackageJSON = grunt.file.readJSON('package.json');
        var appPackageJSON = grunt.file.readJSON(appPath + '/package.json');

        mainPackageJSON.version = version;
        appPackageJSON.version = version;
        grunt.file.write('package.json', JSON.stringify(mainPackageJSON, null, 2), {
            encoding: 'UTF8'
        });
        grunt.file.write(appPath + '/package.json', JSON.stringify(appPackageJSON, null, 2), {
            encoding: 'UTF8'
        });
    });

    grunt.registerTask('dist-linux64', 'Create a Linux 64-bit build', [
    'jshint',
    'clean:distLinux64',
    'copy:appLinux64',
//    'useminPrepare:distLinux64',
    'htmlmin:distLinux64',
    'ngAnnotate:distLinux64',
    'createLinuxApp:Linux64'
  ]);

    grunt.registerTask('dist-linux32', 'Create a Linux 32-bit build', [
    'jshint',
    'clean:distLinux32',
    'copy:appLinux32',
//    'useminPrepare:distLinux32',
    'htmlmin:distLinux32',
    'ngAnnotate:distLinux32',
    'createLinuxApp:Linux32'
  ]);

    grunt.registerTask('dist-win', 'Create a Windows build', [
    'jshint',
    'clean:distWin',
    'copy:copyWinToTmp',
//    'useminPrepare:distWin',
    'htmlmin:distWin',
    'ngAnnotate:distWin',
    'compress:tmpApp',
    'rename:zipToApp',
    'createWindowsApp',
    'copy:distWin',
        'clean:postBuild'
//    'compress:finalWindowsApp'
  ]);

    grunt.registerTask('test', 'Lint-check JS files and run unit tests', [
    'jshint',
    'karma'
  ]);

    grunt.registerTask('distAll', 'Create Windows and Linux release builds', [
        'dist-win',
        'dist-linux32',
        'dist-linux64'
    ])

};