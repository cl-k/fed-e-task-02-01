#!/usr/bin/env node
// 思路：
// 1. 询问问题
// 2. 获取答案生成文件

const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const ejs = require('ejs')

const templates = [
  '.browserslistrc',
  '.editorconfig',
  '.env.development',
  '.env.production',
  '.eslintrc.js',
  '.gitignore',
  'babel.config.js',
  'package.json',
  'postcss.config.js',
  'README.md',
  'public/favicon.ico',
  'public/index.html',
  'src/App.vue',
  'src/main.js',
  'src/router.js',
  'src/assets/logo.png',
  'src/components/HelloWorld.vue',
  'src/store/actions.js',
  'src/store/getters.js',
  'src/store/index.js',
  'src/store/mutations.js',
  'src/store/state.js',
  'src/utils/request.js',
  'src/views/About.vue',
  'src/views/Home.vue'
]

// 模板目录
const templDir = path.join(__dirname, 'templates')
// 目标目录
const destDir = process.cwd()

inquirer.prompt([{
  type: 'input',
  name: 'name',
  message: 'Project name:',
  default: 'my-vue-app'
}]).then(answers => {
  templates.forEach(item => {
    let tempItem = item.split('/');
    tempItem = tempItem.slice(0, tempItem.length - 1);

    const dirPath = tempItem.join('/')
    if (tempItem.length) {
      // 创建目录
      createDirectory(dirPath)
    }
    // 创建文件
    createFile(item, answers)
  })
})

// 创建目录
function createDirectory(path) {
  fs.mkdir(path, {
    recursive: true
  }, err => {
    if (err) throw err;
  })
}

// 创建文件,将模板目录下的文件全部转换到目标目录
function createFile(file, answer) {
  // 通过模板引擎渲染文件
  ejs.renderFile(path.join(templDir, file), answer, (err, content) => {
    if (err) throw err;

    // 将结果写入目标文件
    fs.writeFileSync(path.join(destDir, file), content)
  })
}