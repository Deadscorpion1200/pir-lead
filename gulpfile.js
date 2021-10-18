const { src, dest, parallel, series, watch } = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const ttf2Woff = require('gulp-ttf2woff');
const ttf2Woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
const tinypng = require('gulp-tinypng-compress');
const htmlMin = require('gulp-htmlmin');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const revdel = require('gulp-rev-delete-original');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
const devip = require('dev-ip');

const fonts = () => {
	src('./src/fonts/**.ttf')
		.pipe(ttf2Woff())
		.pipe(dest('./app/fonts/'))
	return src('./src/fonts/**.ttf')
		.pipe(ttf2Woff2())
		.pipe(dest('./app/fonts/'))
}

const cb = () => { }

let srcFonts = './src/sass/_fonts.sass';
let appFonts = './app/fonts/';

const checkWeight = (fontname) => {
	let weight = 400;
	switch (true) {
		case /Thin/.test(fontname):
			weight = 100;
			break;
		case /ExtraLight/.test(fontname):
			weight = 200;
			break;
		case /Light/.test(fontname):
			weight = 300;
			break;
		case /Regular/.test(fontname):
			weight = 400;
			break;
		case /Medium/.test(fontname):
			weight = 500;
			break;
		case /SemiBold/.test(fontname):
			weight = 600;
			break;
		case /Bold/.test(fontname):
			weight = 700;
			break;
		case /ExtraBold/.test(fontname):
			weight = 800;
			break;
		case /Black/.test(fontname):
			weight = 900;
			break;

	}
	return weight;
}

const fontsStyle = (done) => {
	let file_content = fs.readFileSync(srcFonts);

	fs.writeFile(srcFonts, '', cb);
	fs.readdir(appFonts, function (err, items) {
		if (items) {
			let c_fontname;
			for (var i = 0; i < items.length; i++) {
				let fontname = items[i].split('.');
				fontname = fontname[0];
				let font = items[i].split('-')[0];
				let weight = checkWeight(fontname);
				if (c_fontname != fontname) {
					fs.appendFile(srcFonts, '@include font-face("' + font + '", "' + fontname + '", ' + weight + ')\r\n', cb);
				}
				c_fontname = fontname;
			}
		}
	});
	done();
}

const svgSprites = () => {
	return src('./src/img/svg/**.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg"
				}
			}
		}))
		.pipe(dest('./app/img'))
}

const imgToApp = () => {
	return src(['./src/img/**.jpg', './src/img/**.jpeg', './src/img/**.png'])
		.pipe(dest('./app/img'))
}

const resources = () => {
	return src('./src/resources/**')
		.pipe(dest('./app/'))
}

const styles = () => {
	return src('./src/sass/**/*.sass')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', notify.onError()))
		.pipe(rename({ suffix: '.min' }))
		.pipe(autoprefixer({ cascade: false }))
		.pipe(cleanCss({ level: 2 }))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('./app/css/'))
		.pipe(browserSync.stream());
}

const htmlInclude = () => {
	return src(['./src/*.html'])
		.pipe(fileInclude({
			prefix: '@',
			basePath: '@file'
		}))
		.pipe(dest('./app'))
		.pipe(browserSync.stream());
}

const clean = () => {
	return del(['app/*'])
}

const scripts = () => {
	return src('./src/scripts/scripts.js')
		.pipe(webpackStream({
			output: {
				filename: 'scripts.js',
			},
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: [
									['@babel/preset-env', { targets: "defaults" }]
								]
							}
						}
					}
				]
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(uglify().on('Error', notify.onError()))
		.pipe(sourcemaps.write())
		.pipe(dest('./app/scripts'))
		.pipe(browserSync.stream());

}

const watchfiles = () => {
	browserSync.init({
		server: { baseDir: './app' },
		notify: false,
		host: devip(),
		// tunnel: true
	});
	watch('./src/sass/**/*.sass', styles);
	watch('./src/html/*.html', htmlInclude);
	watch('./src/*.html', htmlInclude);
	watch('./src/img/**.jpg', imgToApp);
	watch('./src/img/**.jpeg', imgToApp);
	watch('./src/img/**.png', imgToApp);
	watch('./src/img/**.svg', svgSprites)
	watch('./src/resources/**', resources)
	watch('./src/fonts/**.ttf', fonts)
	watch('./src/fonts/**.ttf', fontsStyle)
	watch('./src/scripts/**/*.js', scripts)
}

exports.styles = styles;
exports.watchfiles = watchfiles;
exports.fileInclude = htmlInclude;

exports.default = series(clean, parallel(htmlInclude, fonts, scripts, imgToApp, svgSprites, resources), fontsStyle, styles, watchfiles);


//build
const stylesBuild = () => {
	return src('./src/sass/**/*.sass')
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', notify.onError()))
		.pipe(rename({ suffix: '.min' }))
		.pipe(autoprefixer({ cascade: false }))
		.pipe(cleanCss({ level: 2 }))
		.pipe(dest('./app/css/'))
}

const scriptsBuild = () => {
	return src('./src/scripts/scripts.js')
		.pipe(webpackStream({
			output: {
				filename: 'scripts.js',
			},
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: [
									['@babel/preset-env', { targets: "defaults" }]
								]
							}
						}
					}
				]
			}
		}))
		.pipe(uglify().on('Error', notify.onError()))
		.pipe(dest('./app/scripts'))

}
function tinyPng(cb) {
	return src('./src/img/**/*.{png,jpg,jpeg}')
		.pipe(tinypng({
			key: 'wyw4Z4XSEDRaf1eeGnxENiHvTxhUJoer',
			parallel: true,
			parallelMax: 50,
			log: true
		}))
		.pipe(dest('./app/img/')),
		cb();
}

const caches = () => {
	return src('./app/**/*.{css,js,svg,png,jpg,jpeg,woff2,woff}', { base: 'app' })
		.pipe(rev())
		.pipe(revdel())
		.pipe(dest('./app'))
		.pipe(rev.manifest('rev.json'))
		.pipe(dest('./app'));
}
const rewrite = () => {
	const maniFest = src('./app/rev.json');

	return src('./app/**/*.html')
		.pipe(revRewrite({ maniFest }))
		.pipe(dest('./app/'))
}
const htmlMini = () => {
	return src('./app/**/*.html')
		.pipe(htmlMin({ collapseWhitespace: true }))
		.pipe(dest('./app/'));
}

function exp(cb) {
	var conn = ftp.create({
		host: '109.95.210.183',
		user: 'u97997',
		password: '3L2l9S6v',
		parallel: 10,
		log: gutil.log
	});

	var globs = [
		'dist/**',
		'dist/css/**',
		'dist/js/**',
		'dist/fonts/**',
		'dist/scripts/**',
		'*.html'
	];
	return src(globs, { base: '', buffer: false })
		.pipe(conn.newer('www/akurp.ru/dina')) // only upload newer files
		.pipe(conn.dest('www/akurp.ru/dina'));
	cb();
}
exports.cache = series(caches, rewrite);
exports.build = series(clean, parallel(htmlInclude, fonts, scriptsBuild, imgToApp, svgSprites, resources), fontsStyle, stylesBuild, htmlMini, tinyPng);
