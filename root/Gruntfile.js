module.exports = function(grunt){
    var pkg = require('./package.json'), //package file
        i; //iterative member


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bump:{
            options:{
                files:[
                    'package.json',
                    'bower.json'
                ],
                updateConfigs: ['pkg'],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin'
            }
        },
        karma:{
            pre:{
                configFile: "karma.pre.js",
                autowatch: false
            },
            post:{
                configFile: "karma.post.js",
                autowatch: false
            }
        },
        connect:{
            server:{
                options:{
                    port: 9001,
                    base:[
                        'docs',
                        'analytics'
                    ],
                    keepalive:true,
                    livereload:true
                }
            }
        },
        concurrent:{
            environment:{
                tasks:["watch","connect"],
                options:{
                    logConcurrentOutput:true
                }
            }
        },
        strip:{
            dist:{
                src:"dist/{%= name %}.js",
                options:{
                    inline:true,
                    nodes:[
                        'console.log',
                        'console.warn',
                        'debug'
                    ]
                }
            }
        },
        plato:{
            report:{
                options:{
                    jshint:false
                },
                files:{
                    "analytics/plato":["src/**/*.js"]
                }
            }
        },
        jshint:{
            options:{
                smarttabs:true,
                unused:false,
                boss:true,
                debug:true
            },
            all:["src/**/*.js"]
        },
        clean:{
            dist:"dist"
        },
        watch:{
            files:[
                "README.md",
                "src/**/*.js",
                "test/**/*.js"
            ],
            tasks:["test"],
            options:{
                livereload:true,
                atBegin:true
            }
        },
        concat:{
            options:{
                stripBanners:true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */',
                process:true

            },
            dist:{
                src:["src/**/*.js"],
                dest:"dist/{%= name %}.js"
            }
        },
        uglify:{
            options:{
                mangle:false,
                report:"min",
                wrap:true,
                compress:{
                    dead_code:true,
                    drop_debugger:true,
                    sequences:true,
                    properties:true,
                    comparisons:true,
                    evaluate:true,
                    booleans:true,
                    loops:true,
                    unused:true,
                    if_return:true,
                    join_vars:true,
                    cascade:true,
                    warnings:true
                }
            },
            dist:{
                options:{
                    sourceMap:"dist/{%= name %}.map",
                    report:"gzip",
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */',
                },
                files:{
                    "dist/{%= name %}.min.js":[
                        "dist/{%= name %}.js"
                    ]
                }
            }
        },
        jsdoc:{
            dist:{
                src: [
                    "README.md",
                    "dist/{%= name %}.js"
                ],
                options:{
                    destination: 'docs'
                }
            }
        }

    });

    for(i in pkg.devDependencies){ //iterate through the development dependencies
        if(pkg.devDependencies.hasOwnProperty(i)){ //avoid iteration over inherited object members
            if(i.substr(0,6) == 'grunt-'){ //only load development dependencies that being with "grunt-""
                grunt.loadNpmTasks(i); //load all grunt tasks
            }
        }
    }
    grunt.registerTask('default',["concurrent"]);
    grunt.registerTask('test',['jshint','karma:pre','plato','jsdoc']);
    grunt.registerTask('dist',['clean','jshint','karma:pre','concat','strip','uglify','karma:post','jsdoc','bump']);
    grunt.registerTask('build',['clean','jshint','karma:pre','concat','strip','uglify','karma:post','jsdoc']);
};