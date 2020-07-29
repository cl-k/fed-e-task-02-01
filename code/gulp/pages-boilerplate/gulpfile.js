// 引入输入流 src, 输出流 dest
const {
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp')

// 引入 gulp-load-plugins 对插件进行统一管理
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()

const del = require('del')

const browserSync = require('browser-sync')
const bs = browserSync.create()

// 模板数据
const data = {
  menus: [{
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [{
          name: 'Twitter',
          link: 'https://twitter.com/'
        },
        {
          name: 'About',
          link: 'https://weibo.com/'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

// 处理样式文件，把 sass 编译为 css
// 处理后暂存为.temp 目录下
const styles = () => {
  return src('src/assets/styles/*.scss', {
      base: 'src'
    })
    .pipe(plugins.sass({
      outputStyle: 'expanded'
    }))
    .pipe(dest('.temp'))
}

// 处理页面文件，渲染模板，处理后暂存 .temp 目录下
const pages = () => {
  return src('src/*.html', {
      base: 'src'
    })
    .pipe(plugins.swig({
      data,
      defaults: {
        cache: false // 不进行缓存，热更新时保证刷新效果
      }
    }))
    .pipe(dest('.temp'))
}

// 处理 js 文件
const scripts = () => {
  return src('src/assets/scripts/*.js', {
      base: 'src'
    })
    .pipe(plugins.babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(dest('.temp'))
}

// 处理图片，对图片进行压缩
const image = () => {
  return src('src/assets/images/**', {
      base: 'src'
    })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

// 处理字体文件
const font = () => {
  return src('src/assets/fonts/**', {
      base: 'src'
    })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

// 处理 public 文件夹里面文件，只需要全部复制就行，不需要其他转换操作
const extra = () => {
  return src('public/**', {
      base: 'public'
    })
    .pipe(dest('dist'))
}

// 清除任务,使用 del 依赖，删除文件夹
const clean = () => {
  return del(['dist', '.temp'])
}

// 处理编译注释，压缩文件
const useref = () => {
  return src('.temp/*.html', {
      base: '.temp'
    })
    .pipe(plugins.useref({
      searchPath: ['.temp', '.']
    }))
    // 压缩 html css js
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(dest('dist'))
}

// 提供服务器，观测文件变化刷新页面
const serve = () => {
  watch('src/assets/styles/*.scss', styles) // 检测到 scss 文件变化，运行 style 任务
  watch('src/assets/scripts/*.js', scripts) // js 文件变化，运行 scripts 任务
  watch('src/*.html', pages) // html 文件变化，运行 pages 任务
  watch([
      'src/assets/images/**',
      'src/assets/fonts/**',
      'public/**'
    ],
    bs.reload) // 资源文件的改变，在开发阶段不需要重新编译任务，只需要刷新页面即可

  bs.init({
    notify: false,
    port: 3001,
    open: true, // 是否自动打开浏览器
    files: 'dist/**', // 监听文件的改变
    server: {
      // 指明请求资源的位置,routes 预先于 baseDir
      // 一个请求发生后，会先在 routes 中看有没得相应的配置
      baseDir: ['.temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

// 编译任务
const compile = parallel(styles, pages, scripts)

// 构建任务，上线前运行
const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
)

// 开发任务
const develop = series(compile, serve)

module.exports = {
  clean,
  compile,
  build,
  develop
}
