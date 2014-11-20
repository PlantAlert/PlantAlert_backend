module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-mongo-drop');


  grunt.initConfig({
    jshint: {
      options: {
        node: true
      },
      src: ['models/**/*.js', 'server.js', 'routes/**/*.js']
    },

    jscs: {
      all: {
        src: "lib/*.js",
        options: {
            config: ".jscsrc",
            requireCurlyBraces: [ "if" ]
        }

      }
    },

    simplemocha: {
      src: ['test/api/**/*.js']
    },

    mongo_drop: {
      test: {
      'uri': 'mongodb://localhost/city_development',
      }
    }

  });

  grunt.registerTask('test', ['jshint', 'jscs', 'mongo_drop', 'simplemocha']);
  grunt.registerTask('default', ['test']);
};

  // grunt.registerTask('test', ['jshint', 'mongo_drop', 'simplemocha']);
