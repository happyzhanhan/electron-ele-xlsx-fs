# newdemo

> 项目为了将LanguageExcel 转为 Json的Text。采用electron + vue + element-ui + fs +xlsx集成。

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```

创建步骤：
``` bash
vue init simulatedgreg/electron-vue electron-vue

 Application Name 项目名称 electron-vue
 Application Id 项目ID www.zzh.com
 Application Version 项目版本 0.0.1
 Project description Excel 项目描述 导出json数据的小应用
 Use Sass / Scss? 使用sass或scss  Yes
 Select which Vue plugins to install (Press <space> to select, <a> to toggle all, <i> to invert select
 n)安装如下依赖： axios, vue-electron, vue-router, vuex, vuex-electron
 Use linting with ESLint? 使用代码校验 Yes
 Which ESLint config would you like to use? 代码校验标准 Standard
 Set up unit testing with Karma + Mocha? 使用单元测试 No
 Set up end-to-end testing with Spectron + Mocha? 使用测试结束No
 What build tool would you like to use? 是否自动编译 builder
 author 作者 zzh<1659725767@qq.com>

``` 
安装xlsx
``` bash
yarn add xlsx 
``` 
在渲染进程目录下src/renderer/main.js如下配置即可
``` bash
...
import XLSX from 'xlsx'
...
var reader = new FileReader();
reader.onload = function (e) {
  // 数据预处理
  var binary = "";
  var bytes = new Uint8Array(e.target.result);
  var length = bytes.byteLength;
  for (var i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  /* 读取 workbook */
  var wb = XLSX.read(binary, {
    type: 'binary'
  });

  /* 选择第一个sheet */
  var wsname = wb.SheetNames[0];
  var ws = wb.Sheets[wsname];

  /* excel转换json数组,加上{header:1}是普通数组，不写是对象数组 */
  self.data = XLSX.utils.sheet_to_json(ws);
  console.log(self.data);
...

``` 
做页面的时候习惯来个ui框架，就装个element-ui吧:
``` bash
npm i element-ui -S
```
使用
``` bash
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

 render: h => h(App),
``` 




---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[45a3e22](https://github.com/SimulatedGREG/electron-vue/tree/45a3e224e7bb8fc71909021ccfdcfec0f461f634) 
