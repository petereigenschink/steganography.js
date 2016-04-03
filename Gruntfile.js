// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks needed for this run
  require('jit-grunt')(grunt);

  // configurable paths
  var config = {
      app: 'src',
      tmp: 'test/lib',
      test: 'test',
      dist: 'build'
  };

  grunt.registerMultiTask('echo', 'Echo back input', function(){
    var data = this.data;

    if (typeof (data) === 'string') {
      if (grunt.file.exists(data)) {
        grunt.log.writeln(grunt.file.read(data));
      } else {
        grunt.log.writeln(data);
      }
    }

    if (typeof (data) === 'object') {
      var key;
      for (key in data) {
        if (data.hasOwnProperty(key)) {
          grunt.log.writeln(data[key]);
        }
      }
    }
  });

  var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    pkg: pkg,
    config: config,    
    banner: '/*\n * <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %>\n *\n * Copyright (C) 2012 Peter Eigenschink (http://www.peter-eigenschink.at/)\n * Dual-licensed under MIT and Beerware license.\n*/\n',

    echo: {
      help: 'README.md'
    },

    clean: {
      options: {
        force: true
      },
      links: ["<%= config.dist %>/**", "coverage/**"],
      tmp: ["<%= config.tmp %>/**"]
    },

    jsdoc : {
      dist : {
        src: ['<%= config.app %>/*.js', '<%= config.app %>/**/*.js'],
        options: {
          destination: 'docs/jsdoc'
        }
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>;(function (name, context, factory) {\n\n  // Supports UMD. AMD, CommonJS/Node.js and browser context\n  if (typeof module !== "undefined" && module.exports) {\n    module.exports = factory();\n  } else if (typeof define === "function" && define.amd) {\n    define(factory);\n  } else {\n    context[name] = factory();\n  }\n\n})("stego", this, function () {\nvar Cover = function Cover() {};\n',
        footer: '\nreturn new Cover();\n});'
      },
      dist: {
        src: ['<%= config.app %>/util.js','<%= config.app %>/config.js','<%= config.app %>/capacity.js','<%= config.app %>/encode.js','<%= config.app %>/decode.js'],
        dest: '<%= config.tmp %>/steganography.js',
        nonull: true
      }
    },

    copy: {
      dist: {
        src: '<%= config.tmp %>/steganography.js',
        dest: '<%= config.dist %>/steganography.js',
        options: {
          process: function (content) {
            return '/* ' + pkg.name + ' v' + pkg.version + ' ' + grunt.template.today("yyyy-mm-dd") + ' - Copyright notice here */\n' + content;
          },
        },
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      build: {
        src: '<%= config.dist %>/steganography.js',
        dest: '<%= config.dist %>/steganography.min.js'
      }
    },

    jshint: {
        options: {
            jshintrc: '.jshintrc',
            reporter: require('jshint-stylish')
        },
        all: [
            'Gruntfile.js',
            '<%= config.tmp %>/{,*/}*.js'
        ]
    },

    karma: {
      options: {
        configFile: '<%= config.test %>/karma.conf.js',
      },
      unit: {
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: ['dots', 'coverage']
      },
      watch: {
        browsers: ['PhantomJS'],
        reporters: ['dots', 'coverage']
      },
      debug: {
        reporters: ['progress']
      }
    },

    checkDependencies: {
      'this': {
        options: {
          npmInstall: true
        }
      }
    }
  });

  // Print help
  grunt.registerTask('help', ['echo:help']);

  // Verify installation
  grunt.registerTask('verify', ['checkDependencies']);

  grunt.registerTask('test', ['karma:unit']);
  // Build
  grunt.registerTask('build', function(target) {
    target = target ? ':'+target : '';
    grunt.task.run([
      'clean',
      'concat' + target,
      'jshint',
      'test',
      'copy:dist',
      'uglify',
      'jsdoc',
      'clean:tmp'
    ]);
  });

  // Setup default task that runs when you just run 'grunt'
  grunt.registerTask('default', ['build']);
};