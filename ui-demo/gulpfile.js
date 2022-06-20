const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const sftp = require('gulp-sftp-up4');
const browserSync = require('browser-sync').create()
const del = require('del');
const path = require('path');
const { doesNotMatch } = require('assert');
const reload = browserSync.reload

gulp.task('style', function () {
    return gulp.src('src/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed' // 此配置使文件编译并输出压缩过的文件
        }))
        .pipe(gulp.dest('dist/static'))
})

gulp.task('js', function () {
    return gulp.src('src/**/*.js')
        .pipe(gulp.dest('dist/static'))
})

gulp.task('views', function () {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist/static'))
})

gulp.task('style:dev', function () {
    return gulp.src('src/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/static'))
        .pipe(reload({
            stream: true
        }))
})

gulp.task('js:dev', function () {
    return gulp.src('src/**/*.js')
        .pipe(gulp.dest('dist/static'))
        .pipe(reload({
            stream: true
        }))
})

gulp.task('views:dev', function () {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist/static'))
        .pipe(reload({
            stream: true
        }))
})


gulp.task('dev', gulp.series('js:dev', 'style:dev', 'views:dev'), function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        notify: false
    })
    gulp.watch('src/*', ['js:dev'])
    gulp.watch('src/*', ['style:dev'])
    gulp.watch('src/*', ['views:dev'])
})

gulp.task('build', gulp.series('style', 'js', 'views'))


gulp.task('upload', function (callback) {
    gulp.src('./dist/**')
        .pipe(sftp(Object.assign({
            remotePath: '/mydata/nginx/', // 部署到服务器的路径
            host: '192.168.154.132', // ip地址
            user: 'root',
            pass: 'Hkl123456',
            port: 22 // 默认是22端口
        })))
        callback();
})


gulp.task('do-upload', gulp.series('upload'));