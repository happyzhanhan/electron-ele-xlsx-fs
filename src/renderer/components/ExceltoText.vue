<template>
<div class="ExceltoText">
    <div class="layout">
        <div>
            <div class="uploadbox">
                <h2>1.Excel上传</h2>
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
                    <div class="el-upload__tip" slot="tip">只能上传xlsx/xls文件，且不超过500kb</div>
                </el-upload>
            </div>

            <div class="uploadbox">
                <h2>2.选择sheet</h2>
                <div style="margin-bottom:30px;">
                    <el-select v-model="sheetName" placeholder="sheetName" size="mini">
                        <el-option v-for="sheet in sheetNames" :label="sheet" :value="sheet"></el-option>
                    </el-select>
                </div>
                <h2>3.选择表头</h2>
                <div>
                    <el-select v-model="name1" placeholder="键" size="mini">
                        <el-option v-for="th in thData" :label="th" :value="th"></el-option>
                    </el-select>
                    <el-select v-model="name2" placeholder="值" size="mini">
                        <el-option v-for="th in thData" :label="th" :value="th"></el-option>
                    </el-select>
                </div>

            </div>

            <div class="uploadbox">
                <h2>5.导出text</h2>
                <el-button type="primary" icon="el-icon-download" @click="exportText">点击下载</el-button>
            </div>
        </div>
        <div>

            <div class="uploadbox">
                <h2>4.数据转JSON显示</h2>
                <!--<div class="mark">
                    {
                    <div v-for="data in tableData">"{{data[name1]}}":"{{data[name2]}}",</div>
                    }
                </div>-->

                <div class="mark">
                    {{sheetName}}:{
                         <div v-for="data in tableDatalist">
                             <div v-for="list in data[sheetName]">{{list[name1]}}:{{list[name2]}},</div>
                         </div>
                    }
                </div>

            </div>

        </div>
    </div>
</div>
</template>

<script>
    import XLSX from 'xlsx'
    import fs from 'fs'

    export default {
        name: "ExceltoText",
        data() {
            return {
                tableData: [],
                tableDatalist:[],
                name1:'数据库字段',
                name2:"繁体中文",
                thData:[],
                sheetNames:[],
                sheetName:"CommonBtn",  //默认sheetName
                jsName:"fixedValue", //生成js文件的名字
                MouldName:"fixedValue", //模块名称 allLanguage ,fixedValue
            }
        },
        methods:{
            handleChange(file, fileList) {
               // console.log(file, fileList)
                let files = {0:file.raw}
                this.readExcel1(files);
            },
            readExcel1(files) {//表格导入
                var that = this;
               // console.log(files);
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
                      //  console.log(workbook);
                        that.sheetNames = workbook.SheetNames;
                        var SheetNames = workbook.SheetNames;
                        const wsname = workbook.SheetNames[0];//取第一张表
                        const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
                      //  console.log(JSON.parse(JSON.stringify(ws)));

                        for(var s in SheetNames){
                            //console.warn( SheetNames[s],JSON.parse(JSON.stringify(XLSX.utils.sheet_to_json(workbook.Sheets[SheetNames[s]]))));
                            //XLSX.utils.sheet_to_json(workbook.Sheets[SheetNames[s]])
                            var name = [SheetNames[s]];
                            var dataobj = {};
                            dataobj[name] = JSON.parse(JSON.stringify(XLSX.utils.sheet_to_json(workbook.Sheets[SheetNames[s]])));
                            that.tableDatalist.push(dataobj)
                        }
                        that.tableData = JSON.parse(JSON.stringify(ws));
                        that.thData = JSON.parse(JSON.stringify(Object.keys(that.tableData[0])));
                        console.warn(that.thData);

                    } catch (e) {

                        return false;
                    }
                };
                fileReader.readAsBinaryString(files[0]);

            },
            exportText(){
                var that = this;
                /*let data= {};
                for(var i=0;i<this.tableData.length;i++){
                    data[this.tableData[i][this.name1]] = this.tableData[i][this.name2];
                }
                let jsonObj=JSON.stringify(data);
                //console.log(jsonObj);*/

                var jsName= "cn";
                var textData ="";
                var jsondata = {};

                for(var list in that.tableDatalist){
                    var datafor = that.tableDatalist[list][Object.keys(that.tableDatalist[list])[0]];
                    jsondata = {};
                    for(var datashow in datafor){
                        jsondata[datafor[datashow][that.name1]] = datafor[datashow][that.name2];
                    }
                    textData = textData + Object.keys(that.tableDatalist[list])[0]+":"+ JSON.stringify(jsondata)+',' ;
                }

                //英文   en
                //波兰语  pl
                //俄语    ru
                //日语    ja
                //阿拉伯语 ar
                //西班牙语  es
                //韩语 ko
                /*switch(that.name2){
                    case '中文': jsName = 'all'; break;
                    case '繁体中文': jsName = 'all'; break;
                    case '英文': jsName = 'all'; break;
                    case '波兰语': jsName = 'all'; break;
                    case '俄语': jsName = 'all'; break;
                    case '日语': jsName = 'all'; break;
                    case '阿拉伯语': jsName = 'all'; break;
                    case '西班牙语': jsName = 'all'; break;
                    case '韩语': jsName = 'all'; break;
                }*/
                var path = "F:\\eletrontest\\newelectron\\newdemo\\lan\\";
                fs.writeFile(path+ that.jsName +".js", "const "+that.MouldName+"={"+textData+"};export default "+that.MouldName+";" ,function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        that.$message({
                            message: '更新js成功！',
                            type: 'success'
                        });
                        console.log("file success！！！")
                    }
                })

            },
        }
    }
</script>

<style scoped lang="scss">

.ExceltoText{
    background:#fff;
    height:100vh;
}
.uploadbox,.textShow{
    margin:50px;
    h2{margin-bottom:10px;}
}
.layout{
    display: flex;
    flex-direction: row;
}
.mark{
    padding:10px;
    background: bisque;
}
</style>
