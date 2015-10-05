var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var del = require('del');
var gutil = require('gulp-util');
var webpack = require('webpack');
var gulpWebpack = require('gulp-webpack');
var karma = require('karma').server;
var WebpackDevServer = require('webpack-dev-server');

var appPaths = require("./root.js").paths;
var generateWebpackConfig = require('./conf/webpack.config.js');
var argv = require('yargs').argv;

var target = argv.target || 'development';
var configTarget = argv.configTarget || target || 'development';
var sourceMaps = argv.maps || (target === 'development');
var watch = argv.watch || (target === 'development');
var uglify = argv.uglify || (target === 'production');
var port = argv.port || 8085;
var singleRun = argv.singleRun || false;

var targetDir = target;
// May change to this later:
//var targetDir = (target === configTarget) ? target : target + '-' + configTarget;
var webpackBuildPath =  path.join(appPaths.buildDir, targetDir);

gutil.log('Build Target: ' + target);
gutil.log('Config Target: ' + configTarget);

/**
 * Build webpack bundle
 */
gulp.task('build', ['clean'], function() {
  var webpackConfig = generateWebpackConfig(configTarget, watch, sourceMaps, uglify);
  return gulp.src(path.join(appPaths.srcDir, 'index.js'))
    .pipe(gulpWebpack( webpackConfig ))
    .pipe(gulp.dest(webpackBuildPath));
});

/**
 * Clean bundle
 */
gulp.task('clean', function (cb) {
  del([
    'build/**'
  ]).then(function() {
    cb();
  });
});

/**
 * Build webpack bundle
 */
gulp.task('analyze', function(cb) {
  var webpackConfig = generateWebpackConfig(configTarget, false, sourceMaps, true);

  gulp.src(path.join(appPaths.srcDir, 'index.js'))
    .pipe(gulpWebpack( webpackConfig, null, function(err, stats) {
      fs.writeFileSync(path.join(webpackBuildPath, 'profile.json'), JSON.stringify(stats.toJson(), null, '  '));
    }));
});


/**
 * test
 *
 * Run karma test server
 */
gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/conf/karma.conf.js',
    singleRun: singleRun,
    webpack: generateWebpackConfig(configTarget, watch, sourceMaps, uglify)
  }, done);
});

/**
 * dev-server
 *
 * Webpack development server
 */
gulp.task("dev-server", function(callback) {
  var webpackConfig = generateWebpackConfig(configTarget, watch, sourceMaps);
  webpackConfig.output.publicPath = "/";
  webpackConfig.output.path = path.join(appPaths.buildDir, target),

  webpackConfig.debug = true;
  // Start a webpack-dev-server

  new WebpackDevServer( webpack(webpackConfig), {
    filename: "[name].js",
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(port, function(err) {
      if(err) throw new gutil.PluginError("webpack-dev-server", err);
      // Server listening
      gutil.log("[webpack-dev-server]", "http://localhost:"+port+"/");

      // keep the server alive or continue?
      // callback();
  });
});

try {
  var stagingDeployTools = require('ots-deploy-tools')(
    require('./deploy-config.js'),
    'staging',
    require('./package.json'),
    argv
  );


  /**
   * deploy-staging
   *
   * Deploys the entire application root to the staging server, excluding
   * the server environment.json file and a few unimportant files.
   */
  gulp.task('deploy-staging', function() {
    return stagingDeployTools.templates.deployApp({
      src: './build/staging/',
      npmInstall: false,
      restartUpstart: false,
      symlinkConfigFile: false
    });
  });
}
catch (e) {
  gutil.log('deploy-config.js not present or some other error. Deployment tasks unavailable.');
}


