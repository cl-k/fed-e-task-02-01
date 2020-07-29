脚手架的实现过程
1. 通过命令行交互询问用户问题
2. 根据用户的回答及预设的模板结构生成文件

步骤：

1. 创建项目文件夹，使用`yanr init` 初始化项目，文件目录中的 templates 为模板文件夹，里面放置了脚手架创建项目的模板，包括目录和文件

2. 编写 cli.js 文件

   ```js
   // cli.js
   #!/use/bin/env node
   
   console.log('test ....')
   ```

   

3. 修改 package.js 文件，增加 bin 字段，然后使用 link 注册命令，之后就可以使用 link 之后的命令运行

   ```js
   // package.js
   "bin": "cli.js",
   ```

   bin 字段配置的是执行命令名和执行代码的路径。

   ```bash
   # 使用 yarn link 之后既可以在命令行中运行 link 过后的命令
   $ yarn link
   $ 01-k-cli # 输出 test .... 说明配置正确
   ```

   

4. 需要通过命令行与用户交互，接收用户的回答信息，需要安装 inquirer 包，因为项目中使用了 ejs 模板，所以需要安装 ejs 依赖，在生成文件时通过 ejs 模板引擎渲染。

   ```bash
   $ yarn add inquirer ejs --dev
   ```

5. 再次编写 cli.js，根据提问，接收用户信息，复制模板文件夹下的内容到项目的思路编写

   ```js
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
       let tempItem = item.split('/')
       tempItem = tempItem.slice(0, tempItem.length - 1)
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
   ```

使用，在所需生成项目结构的文件夹命令行中输入 01-k-cli 即可。也可上传至 npm 仓库，下载安装后使用

   

   

