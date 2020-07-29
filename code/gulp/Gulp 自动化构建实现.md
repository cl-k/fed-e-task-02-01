### 准备工作

要使用 Gulp 实现自动化构建首先需要把 Gulp 作为项目的依赖，然后在项目根目录中新建 gulpfile.js 文件，这个文件将作为 Gulp 的入口。

```bash
$ yarn add gulp --dev
```

因为 Gulp 核心工作原理是：读取流 ——> 转换流 ——> 写入流，所以需要先引入 src（输入）, dest（输出）

```js
const { src, dest } = require('gulp')
```

Gulp 在转换各种资源中需要使用不同的插件，为了节省每次需要新插件都要引入的操作，可以安装 gulp-load-plugins 对插件进行统一的管理，这个插件会自动找到使用的插件并引入进来，安装完成后声明 plugins 常量，之后使用其他插件时直接使用 plugins.<插件名>

```bash
$ yarn add gulp-load-plugins --dev
```

```js
const loadPlugins = require('gulp-load-plugins')
const pulgins = loadPlugins()
```

### 处理样式文件

处理样式文件，把 src/assets/styles 下的所有 sass 文件编译为 css 并且存放到目标文件下的, 使用 gulp-sass 插件

```js
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
```

### 处理页面文件

处理页面文件需要把 src 下面的所有 html 文件进行处理，因为 html 中了使用 swig 模板，所以需要通过 gulp-swig 插件来处理模板渲染

```js
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

```

### 处理 JS 脚本文件

处理 JS 文件时，需要使用 babel 把新特性新语法进行转换。需要用到的插件是 gulp-babel ,于此同时还需要安装 @babel/core, @babel/preset-env 两个依赖

```bash
 $ yarn add gulp-babel @babel/core @babel/preset-env --dev
```

```js
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
```

### 处理图片文件与字体文件

需要把所有图片/字体文件进行压缩，使用 gulp-imagemin 插件来压缩

```js
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
```

### 处理 public 文件夹下的文件

只需要复制到目标文件夹中，无需做其他转换工作

```js
// 处理 public 文件夹里面文件，只需要全部复制就行，不需要其他转换操作
const extra = () => {
  return src('public/**', {
      base: 'public'
    })
    .pipe(dest('dist'))
}
```

### 清除任务

清除任务用于构建时删除之前构建生成的文件，需要安装 del 依赖

````bash
$ yarn add del --dev
````

```js
const del = require('del')

// 清除任务,使用 del 依赖，删除文件夹
const clean = () => {
  return del(['dist', '.temp'])
}
```



现在已经完成了所有需要的构建任务定义，但是如果每次都是一个个命令去执行就很影响工作效率，所以要对上面的任务进行组合，需要从 Gulp 中引入 parallel，series 两个方法，组合后把任务导出。

```js
const {
  src,
  dest,
  parallel,
  series
} = require('gulp')
```

注：parallel（并行任务），series（串行任务）

在组合任务时可以根据任务特性进行组合，方便满足各种编译需求。

### 定义编译任务，定义构建任务，导出

```js
// 编译任务
const compile = parallel(styles, pages, scripts)

// 构建任务
const build = series(
  clean,
  parallel(compile, image, font, extra)
)

module.exports = {
  compile,
  build
}
```

现在已经可以使用 compile, build 两个任务了。

### 处理编译注释，压缩文件

由于在编辑结束后一些文件还存在编译注释，所以还需要对这些编译注释进行处理，要不一些资源文件构建后没办法引入。比如如下的注释

```html
 <!-- build:css assets/styles/vendor.css -->
  <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
  <!-- endbuild -->
  <!-- build:css assets/styles/main.css -->
  <link rel="stylesheet" href="assets/styles/main.css">
  <!-- endbuild -->
```

在处理编译注释的时候，还可以顺便对文件进行压缩，减少相应文件的体积。处理编译注释需要用到 gulp-useref 插件，压缩 JS 文件需要用到 gulp-uglify ，压缩 CSS 使用 gulp-clean-css, 压缩 html 使用 gulp-htmlmin, 判断文件所属类型时使用 gulp-if 。安装并编写任务。

```bash
$ yarn add gulp-useref gulp-uglify gulp-clean-css gulp-htmlmin gulp-if --dev
```

```js
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

// 构建任务
const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
)
```

此时，整个自动化的构建流程已经完成了。但是为了方便开发时的调试，还需要创建一个服务任务，提供一个服务器查看生成的网页，还需要实现观察文件改变实现热更新的功能

### 服务器

需要使用 browser-sync ，从 Gulp 引入 watch 检测文件的改变

```bash
$ yarn add browser-sync --dev
```

```js
// 引入输入流 src, 输出流 dest
const {
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp')

const browserSync = require('browser-sync')
const bs = browserSync.create()

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

// 开发任务
const develop = series(compile, serve)

module.exports = {
  compile,
  build,
  develop
}

```

根据具体情况来使用对应任务：

```bash 
$ yarn gulp compile
$ yarn gulp build
$ yarn gulp develop
```

以上就是整个 Gulp 自动化构建过程的实现

