<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>
      <div class="left-side">
        <span class="title">
          Welcome to your new project!
        </span>
        <system-information></system-information>
      </div>

      <div class="right-side">
        <div class="doc">
          <div class="title">Getting Started</div>
          <el-upload
                  class="upload-demo"
                  ref="upload"
                  drag
                  action="#"
                  :on-change="handleChange"
                  accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          {
          <div v-for="data in tableData">"{{data[name1]}}":"{{data[name2]}}";</div>
          }

        </div>

        <div>

        </div>
        <div class="doc">
          <div class="title alt">Other Documentation</div>
          <button class="alt" @click="open('https://electron.atom.io/docs/')">Electron</button>
          <button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import XLSX from 'xlsx'
  let fs=require("fs");

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data() {
      return {
        tableData: [],
        name1:'数据库字段',
        name2:"繁体中文",
      }
    },
    created(){
      this.exportdata();
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link)
      },
      exportdata(){
        //json数组
        let data=
                {	"aa":"11",
                  "mc":"22",
                  "cc":"33",
                };
          //数组转json字符串
          let jsonObj=JSON.stringify(data);
          ////////把json数据写入TXT文件中
          fs.writeFile("F:\\eletrontest\\TESTABC.txt",jsonObj,function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("file success！！！")
            }
          })
      },
      handleChange(file, fileList) {
        console.log(file, fileList)
        let files = {0:file.raw}
        this.readExcel1(files);
      },
      readExcel1(files) {//表格导入
        var that = this;
        console.log(files);
        if(files.length<=0){//如果没有文件名
          return false;
        }else if(!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())){
          this.$Message.error('上传格式不正确，请上传xls或者xlsx格式');
          return false;
        }

        const fileReader = new FileReader();
        fileReader.onload = (ev) => {
          try {
            const data = ev.target.result;
            const workbook = XLSX.read(data, {
              type: 'binary'
            });
            const wsname = workbook.SheetNames[0];//取第一张表
            const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
            console.log(JSON.parse(JSON.stringify(ws)));
            that.tableData = JSON.parse(JSON.stringify(ws));
            // that.peopleArr = [];//清空接收数据
            // if(that.peopleArr.length == 1 && that.peopleArr[0].roleName == "" && that.peopleArr[0].enLine == ""){
            //     that.peopleArr = [];
            // }
            //重写数据
         /*   try{

            }catch(err){
              console.log(err)
            }
            this.$refs.upload.value = '';*/
            console.log(that.tableData );

          } catch (e) {

            return false;
          }
        };
        fileReader.readAsBinaryString(files[0]);

      },
      httpRequest(e) {
        let file = e.file // 文件信息
        console.log('e: ', e)
        console.log('file: ', e.file)

        if (!file) {
          // 没有文件
          return false
        } else if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
          // 格式根据自己需求定义
          this.$message.error('上传格式不正确，请上传xls或者xlsx格式')
          return false
        }

        const fileReader = new FileReader()
        fileReader.onload = (ev) => {
          try {
            const data = ev.target.result
            const workbook = XLSX.read(data, {
              type: 'binary' // 以字符编码的方式解析
            })
            const exlname = workbook.SheetNames[0] // 取第一张表
            const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname]) // 生成json表格内容
            console.log(exl)
            // 将 JSON 数据挂到 data 里
            this.tableData = exl
            // document.getElementsByName('file')[0].value = '' // 根据自己需求，可重置上传value为空，允许重复上传同一文件
          } catch (e) {
            console.log('出错了：：')
            return false
          }
        }
        fileReader.readAsBinaryString(file)
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
