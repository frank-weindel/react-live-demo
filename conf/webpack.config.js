var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BowerWebpackPlugin = require("bower-webpack-plugin");
var path = require("path");
var appPaths = require("../root.js").paths;
var bowerPath = path.join( appPaths.rootDir, "bower_components" );

/*
  Unlike standard webpack config files, this one returns a function that
  returns a customized configuration based on specified arguments.
 */

/**
 * Returns a webpack config
 *
 * @param  {String} configTarget Target to use for config loader.
 * @param  {Boolean} watch      Enable webpack watch
 * @param  {Boolean} sourceMaps Enable sourcemaps
 * @param  {Boolean} uglify     Enable uglifying
 * @param  {Boolean} profile    Enable profiling
 * @return {Object}             Webpack config
 */
module.exports = function(configTarget, watch, sourceMaps, uglify, profile) {
  var config = {
    watch: watch,
    profile: profile,
    cache: true,
    entry: {
      app: path.join(appPaths.srcDir, "index.js")
    },
    output: {
      filename: "[name].js",
      publicPath: ""
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, "../bower_components/fido"),
            path.resolve(__dirname, "../app")
          ],
          exclude: /__test__/,
          loader: 'babel-loader!eslint-loader'
        },
        {
          test: /\.js$/,
          include: /__test__/,
          loader: 'babel-loader'
        },
        { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file-loader?name=fonts/[hash].[ext]' },
        { test: /\.css$/, loader: "style-loader!css-loader" },
        { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
        { test: /\.html$/, loader: 'html-loader' },
        { test: /\.(png|jpg|gif)/, loader: 'file-loader?name=images/[hash].[ext]' },
        { test: /\.json/, loader: 'json-loader' }
      ]
    },
    // Look for loaders in the directory that contains this config file.
    resolveLoader: {
      modulesDirectories: [path.join(appPaths.rootDir, "app_loaders"), path.join(appPaths.rootDir, "node_modules")]
    },

    resolve: {
      extensions: ['', '.js'],
      // Look in node_modules first, then look in bower_components
      modulesDirectories: [bowerPath, "node_modules"],
      /*
        Use react with addons
       */
      alias: {
        react: path.join(appPaths.rootDir, 'node_modules', 'react'),
        app: path.join(appPaths.srcDir),
        common: path.join(appPaths.srcDir, "common"),
        modules: path.join(appPaths.srcDir, "modules"),
        'data-providers': path.join(appPaths.srcDir, "data-providers")
      }
    },


    loader: {
      /*
        This data is used by the webpack-config-loader
       */
      configEnvironment: configTarget
    },

    devtool: sourceMaps ? 'inline-source-map' : '',
    plugins: [
      // new webpack.optimize.AggressiveMergingPlugin({
      //   minSizeReduce: 1.1,
      //   moveToParents: true
      // }),
      new HtmlWebpackPlugin({
        chunks: ['app'],
        template: path.join(appPaths.srcDir, "index.template.html"),
        filename: 'index.html'
      }),
      // Tell webpack to look at the "main" property of bower.json files to resolve paths
      new BowerWebpackPlugin({
        modulesDirectories: bowerPath,
        searchResolveModulesDirectories: false
      }),
      new ExtractTextPlugin("[name].css", {
        allChunks: true
      }),
      // Prevent moment.js from including unneeded locales
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    eslint: {
      configFile: path.join(__dirname, '../.eslintrc')
    }
  };
  if (uglify) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
  }
  return config;
};
