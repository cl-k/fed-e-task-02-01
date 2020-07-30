// 实现这个项目的构建任务
const loadGruntTasks = require('load-grunt-tasks') // 插件管理
const sass = require('node-sass')

// 导出 grunt 
module.exports = grunt => {
  // 配置 grunt
  grunt.initConfig({
    // 处理 Sass 
    sass: {
      options: {
        implementation: sass, // 指定使用 sass 模块来处理
        sourceMap: true
      },
      main: {
        files: [{
          expand: true, // 设置为 true，表示文件名占位要扩展成具体的文件名
          cwd: 'src/assets/styles', // 源文件路径
          src: ['**/*.scss'], // 需要处理的文件。如果采用数组形式，数组的每一项就是一个文件名，可以使用通配符
          dest: 'dist/assets/styles', // 目标文件路径
          ext: '.css' // 处理后的文件名
        }]
      }
    },
    // 处理 html 页面
    swig_precompile: {
      options: {
        active: '',
        locals: require('./data'),
        beautify: {
          indent_size: 2
        }
      },
      dev: {
        options: {
          force: false
        },
        expand: true,
        cwd: 'src',
        src: '*.html',
        dest: 'dist'
      },
      build: {
        expand: true,
        cwd: 'src',
        src: '*.html',
        dest: 'dist'
      }
    },
    // 处理 js
    babel: {
      options: {
        presets: ['@babel/preset-env'],
        sourceMap: true
      },
      main: {
        files: [{
          expand: true,
          cwd: 'src/assets/scripts',
          src: ['**/*.js'],
          dest: 'dist/assets/scripts',
          ext: '.js'
        }]
      }
    },
    // 处理其他资源文件
    copy: {
      src: {
        files: [{
          expand: true,
          cwd: 'public',
          src: ['*'],
          dest: 'dist'
        }, {
          expand: true,
          cwd: 'src/assets/fonts',
          src: ['*'],
          dest: 'dist/assets/fonts'
        }]
      },
      image: {
        files: [{
          expand: true,
          cwd: 'src/assets/images',
          src: ['*'],
          dest: 'dist/assets/images'
        }]
      }
    },
    // 处理构建注释
    useref: {
      html: 'dist/*.html',
      temp: 'dist'
    },
    // 合并依赖文件
    concat: {
      options: {
        separator: ';',
        stripBanners: true // 清除注释
      },
      css: {
        src: ['./node_modules/bootstrap/dist/css/bootstrap.css'],
        dest: 'dist/assets/styles/vendor.css'
      },
      js: {
        src: [
          './node_modules/jquery/dist/jquery.js',
          './node_modules/popper.js/dist/umd/popper.js',
          './node_modules/bootstrap/dist/js/bootstrap.js'
        ],
        dest: 'dist/assets/scripts/vendor.js'
      }
    },
    // 压缩 html
    htmlmin: {
      options: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkAttributes: true,
        useShortDoctype: true
      },
      dev: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['*.html'],
          dest: 'dist/'
        }]
      }
    },
    // 压缩 css
    cssmin: {
      prod: {
        options: {
          report: 'min',
        },
        files: [{
          expand: true,
          cwd: 'dist/assets/styles',
          src: ['**/*.css'],
          dest: 'dist/assets/styles'
        }]
      }
    },
    // 压缩 js
    uglify: {
      prod: {
        options: {
          sourceMap: true
        },
        files: [{
          expand: true,
          cwd: 'dist/assets/scripts',
          src: ['**/*.js'],
          dest: 'dist/assets/scripts'
        }]
      }
    },
    // 压缩图片
    imagemin: {
      prod: {
        options: {
          optimizationLevel: 7,
          pngquant: true
        },
        files: [{
            expand: true,
            cwd: 'dist/assets/images',
            src: ['*'],
            dest: 'dist/assets/images'
          },
          {
            expand: true,
            cwd: 'dist/assets/fonts',
            src: ['*'],
            dest: 'dist/assets/fonts'
          }
        ]
      }
    },
    // 清除之前构建的文件
    clean: {
      dist: 'dist'
    },
    // 检测文件变化
    watch: {
      html: {
        files: ['src/**/*.html'],
        tasks: ['swing_precompile', 'htmlmin']
      },
      css: {
        files: ['src/assets/styles/*.scss'],
        tasks: ['sass', 'cssmin']
      },
      js: {
        files: ['src/assets/scripts/*.js'],
        tasks: ['babel', 'uglify']
      },
    }
  })

  loadGruntTasks(grunt)

  grunt.registerTask('build', ['clean', 'sass', 'swig_precompile', 'babel', 'concat', 'useref', 'copy', 'uglify', 'htmlmin', 'cssmin', 'watch'])
  // grunt.registerTask('build', ['clean', 'sass', 'swig_precompile', 'babel', 'concat', 'useref', 'copy', 'uglify', 'htmlmin', 'cssmin'])
}
