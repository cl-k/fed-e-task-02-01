# 前端工程化

## 工程化概述

前端工程化是指遵循一定的标准和规范，通过工具去提高效率，较低成本的一种手段。

### 面临的问题

- 想要使用 ES6+ 新特性，但是兼容有问题
- 想要使用 Less / Sass / PostCSS 增强 CSS 的编程性，但是运行环境不能直接支持
- 想要使用模块化的方式提高项目的可维护性，但运行环境不能直接支持
- 部署上线前需要手动压缩代码及资源文件，部署过程需要手动上传代码到服务器
- 多人协同开发，无法硬性统一代码风格，从仓库中 pull 回来的代码质量无法保证
- 部分功能开发时需要等待后端服务接口提前完成

### 主要解决的问题

- 传统语言或语法的弊端
- 无法使用模块化/组件化
- 重复的机械式工作
- 代码风格统一、质量保证
- 依赖后端服务接口支持
- 整体依赖后端项目

### 工程化表现

一切以提高效率、降低成本、质量保证为目的的手段都属于工程化。一切重复的工作都应该被自动化

- 创建项目：项目结构、特性类型文件
- 编码：格式化代码、校验代码风格、编译/构建/打包
- 预览/测试：Web Server / Mock,、Live Reloading / HMR,、Source Map
- 提交：Git Hooks、Lint-staged、持续集成
- 部署：CI/CD、自动发布

工程化不等于工具

## 脚手架工具开发

### 脚手架工具概要

脚手架的本质作用：自动创建项目基础结构，提供项目规范和约定

- 相同的组织结构
- 相同的开发范式
- 相同的模块依赖
- 相同的工具配置
- 相同的基础代码

### 常用的脚手架工具

- React 项目—— create-react-app
- Vue.js 项目—— vue-cli
- Angular 项目 —— angular-cli

根据信息创建对应的项目基础结构

- Yeoman 通用型脚手架工具
- Plop 创建特定类型的文件：例如创建一个组件/模块所需的文件

### 通用脚手架工具剖析

#### Yeoman

基本使用

- 在全局范围安装yo

  ```bash
  $ npm install yo --global # or yarn global add yo
  ```

- 安装对应的 generator

  ```bash
  $ npm install generator-node --global # or yarn global add generator-node
  ```

- 通过 yo 运行 generator

  ```bash
  $ cd path/to/project-dir
  $ mkdir my-module
  $ cd my-module
  $ yo node
  ```

Sub Generator 案例

```bash
$ yo node:cli
$ yarn link
$ yarn
$ xxx-modul --help
```

使用步骤总结

1. 明确需求
2. 找到合适的 Generator
3. 全局范围安装找到的 Generator
4. 通过 Yo 运行对应的 Generator
5. 通过命令行交互填写选项
6. 生成所需的项目结构

### 基于 Yeoman 搭建自己的脚手架

#### 创建 Generator 模块

Generator 本质上就是一个 NPM 模块

Generator 基本结构

- generators/ (生成器目录)
  - app/ (默认生成器目录)
    - index.js (默认生成器实现)
  - component/（其他生成器目录）
    - index.js (其他生成器实现)
- package.json (模块包配置文件)

模块名称 generator-<name>

```bash
$ mkdir generator-sample
$ cd generator-sample
$ yarn init
$ yarn add yeoman-generator
$ yarn link
$ yo sample
```

#### 根据模板创建文件

相对于手动创建每一个文件，模板的方式大大提高了效率

#### 接收用户输入数据

prompting() 方法

### 开发一款脚手架

### 发布 Generator 模块

```bash
$ cd generator-xxx
$ exho node_modules > .gitignore
$ git init
$ git status
$ git add .
$ git commit -m "feat: initial commit"
$ git remote add origin https://github.com/xxx/xxx.git
$ git push -u origin master
$ yarn publish # or npm publish
$ yarn publish --registry=https://registry.yarnpkg.com
```

### Plop

Plop 的基本使用

- 安装 plop

```bash
$ yarn add plop --dev
```

- 项目根目录下新建 plopfile.js 文件

- 新建 plop-template/component.hbs 文件

- 运行

  ```bash
  $ yarn plop component # 生成器的名字
  ```

步骤

- 将 plop 模块作为项目开发依赖安装
- 在项目根目录下创建一个 plopfile.js 文件
- 在 plopfile.js 文件中定义脚手架任务
- 编写用于生成特定类型文件的模板
- 通过 Plop 提供的 CLI 运行脚手架任务

### 脚手架的工作原理

```bash
$ mkdir xxx
$ cd xxx
$ yarn init
# package.js 中添加 bin 字段
# 编写入口文件
$ yarn link
$ xxx # 项目名
# node 中获取用户输入需要 inquirer 模块
$ yarn add inquirer
# 编写模板文件等
# 安装模板引擎
$ yarn add ejs
```



## 自动化构建系统

一切重复工作本应自动化

自动化构建工作流的作用是脱离运行环境兼容带来的问题，在开发阶段使用提高效率的语法、规范和标准

### NPM Scripts

在 NPM Scripts 中去定义一些与项目开发过程中有关的一些脚本命令。让命令跟着项目去维护，便于开发过程中使用。

NPM Scripts 也是实现自动化构建工作流的最简方式

### 常用的自动化构建工具

- Grunt
- Gulp
- FIS

### Grunt 基本使用

```bash
$ yarn init --yes
$ yarn add grunt
# 根目录创建gruntfile.js文件
$ yarn grunt projectname # gruntfile 中定义的任务名称
```

### Grunt 标记任务失败

```js
  grunt.registerTask('bad', () => {
    console.log('bad working')
    return false // 标记失败
  })
```

```bash
$ yarn grunt default --force # 使用 --force 执行被阻断的任务
```

Grunt 多目标任务可以理解为子任务

常用 Grunt 插件

- yarn add grunt-sass sass --dev
- yarn add grunt-babel @babel/core @babel/preset-env --dev
- yarn add load-grunt-tasks --dev
- yarn add grunt-contrib-watch --dev

### Gulp 基本使用

Gulp 高效易用

```bash
$ yarn init --yes
$ yarn add gulp --dev
# 在根目录创建 gulpfile.js 文件
$ yarn gulp projectname # gulpfile 中定义的任务名称
```

Gulp 构建核心工作原理

输入（读取流）——> 加工（转换流）——> 输出（写入流）

gulp-clean-css 插件：压缩 css 代码 

gulp-sass 插件：sass 插件

gulp-rename 插件：重命名 

gulp-babel 插件：babel 插件 需要 @babel/core @babel/preset-env

gulp-swig : swig 模板转换插件

gulp-imagemin : 图片压缩

gulp-load-plugins: 自动加载插件的插件

del: 清除文件 （不是 gulp 插件）

browser-sync: 提供一个开发服务器，支持热更新

gulp-useref: 引用关系

gulp-htmlmin: 压缩 html

gulp-uglify : 压缩 js

gulp-clean-css: 压缩 css

gulp-if : 判断

Gulp 文件操作 API：src, dest

```js
exports.default = () => {
  return src('src/*.css')
    .pipe(cleanCss())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(dest('dist'))
}
```



## 模块化打包



## 项目代码规范化



## 自动化部署



