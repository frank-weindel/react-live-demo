/**
 * This file exports all major directories and paths used in the entire application.
 */
var path = require('path');
var root = module.exports = {};
var paths = root.paths = {};

paths.rootDir = __dirname;
paths.srcDir = path.join( paths.rootDir, 'app' );

paths.buildDir = path.join( paths.rootDir, 'build' );
paths.lastBuildDir = path.join( paths.rootDir, 'lastbuild' );
