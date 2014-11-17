module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');


  grunt.initConfig({
    jshint: {
      options: {
        node: true
      },
      src: ['models/**/*.js', 'server.js', 'routes/**/*.js']
    },

    simplemocha: {
      src: ['test/api/**/*.js']
    }

    // mongo_drop: {
    //   test: {
    //   'uri': 'mongodb://localhost/notes_test',
    //   }
    // }

  });

  grunt.registerTask('test', ['jshint', 'simplemocha']);
  grunt.registerTask('default', ['test']);
};
