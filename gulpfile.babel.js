import gulp from 'gulp';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import replace from 'gulp-replace';
import changed from 'gulp-changed';
import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import include from 'gulp-html-tag-include';

var path = require('path');
var ENV_CONFIG = require('./env.config.js');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var getWebpackConfig = require('./webpack.config.js');

/* ------------ FILE PATH ------------ */
let filePath = {};
filePath.src = './src';
filePath.tmp = './.tmp/';
filePath.page = ['./src/**/*.html'];
filePath.js = ['./src/**/*.js'];
filePath.css = ['./src/**/*.css', './src/**/*.less'];
filePath.cimg = ['./src/cimg/*.jpg', './src/cimg/*.png'];
filePath.img = ['./src/**/*.jpg', './src/**/*.png', './src/**/*.gif'];
filePath.build = './topic';

let CONF = {
  CONST: {
    CONTEXT_PATH: "#contextpath#",
    ASSERT_PATH: "#assertpath#"
  }
};

/* ------------ 处理图片和 html ------------ */
gulp.task('handle', ['handleHtml', 'handleImg', 'handleCImg']);
gulp.task('handleImg', function () {
  return gulp.src(filePath.img)
    .pipe(changed(filePath.tmp))
    .pipe(gulp.dest(filePath.tmp))
  //.pipe(webp())
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(filePath.build));
});
/*webp 暂时无法解决ios兼容问题*/
gulp.task('handleCImg', function () {
  return gulp.src(filePath.cimg)
    .pipe(changed(filePath.tmp))
    .pipe(gulp.dest(filePath.tmp))
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(filePath.src + '/cimg'));
});

gulp.task('handleHtml', function () {
  return gulp.src(filePath.page)
    .pipe(replace(CONF.CONST.CONTEXT_PATH, ENV_CONFIG[process.env.ENV].CONTEXT_PATH))
    .pipe(replace(CONF.CONST.ASSERT_PATH, ENV_CONFIG[process.env.ENV].ASSERT_PATH))
    .pipe(changed(filePath.tmp))
    // .pipe(include())
    .pipe(gulp.dest(filePath.tmp))
    .pipe(gulp.dest(filePath.build));
});

/* ------------ RELOAD ------------ */
gulp.task('reload', ['handle'], () => {
  browserSync.reload();
});

/* ------------ SERVER ------------ */
gulp.task('serve', ['webpack-dev-server', 'handle'], function () {
  browserSync({
    server: {
      baseDir: "./topic",
      directory: true
    }
  });
  var _tmpArr = [].concat(filePath.page, filePath.css, filePath.js, filePath.img);
  gulp.watch(_tmpArr).on('change', function () {
    gulp.start('reload');
  });
});

/* ------------ WEBPACK DEV SERVER ------------  */
gulp.task('webpack-dev-server', function () {
  var webpackConfig = getWebpackConfig(process.env.ENV);
  return new WebpackDevServer(webpack(getWebpackConfig(process.env.ENV)), {
    publicPath: "/",
    stats: webpackConfig.devServer.stats
  }).listen(3333, 'localhost', function (err) {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server]', 'http://localhost:3333/webpack-dev-server/');
  });
});

/* ----------- webpack build --------------- */
gulp.task('webpack:build', function (callback) {
  // Modify some webpack config options
  var myConfig = Object.create(getWebpackConfig(process.env.ENV));

  myConfig.plugins = myConfig.plugins.concat(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.MinChunkSizePlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
    );

  // Run webpack
  webpack(myConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }

    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));

    callback();
  });
});

/* ----------- CLEAN --------------- */
gulp.task('clean', function () {
  return gulp.src([filePath.tmp].concat(filePath.build), {
    read: false
  }).pipe(clean());
});


gulp.task('default', ['runLoc']);

gulp.task('runLoc', ['loc', 'serve']);
gulp.task('runDev', ['dev', 'serve']);
gulp.task('runTest', ['test', 'serve']);
gulp.task('run', ['pro', 'serve']);

gulp.task('build', ['loc', 'handle', 'webpack:build']);
gulp.task('buildDev', ['dev', 'handle', 'webpack:build']);
gulp.task('buildTest', ['test', 'handle', 'webpack:build']);
gulp.task('buildPro', ['pro', 'handle', 'webpack:build']);

gulp.task('loc', function () {
  process.env.ENV = ENV_CONFIG.ENV.LOC;
  return true;
});

gulp.task('dev', function () {
  process.env.ENV = ENV_CONFIG.ENV.DEV;
  return true;
});

gulp.task('test', function () {
  process.env.ENV = ENV_CONFIG.ENV.TEST;
  return true;
});

gulp.task('pro', function () {
  process.env.ENV = ENV_CONFIG.ENV.PRO;
  return true;
});