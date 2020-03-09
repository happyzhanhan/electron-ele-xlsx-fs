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
                <h2>2.选择表头</h2>
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
                <h2>4.导出text</h2>
                <el-button type="primary" icon="el-icon-download" @click="exportText">点击下载</el-button>
            </div>
        </div>
        <div>

            <div class="uploadbox">
                <h2>3.数据转JSON显示</h2>
                <div class="mark">
                    {
                    <div v-for="data in tableData">"{{data[name1]}}":"{{data[name2]}}";</div>
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
                name1:'数据库字段',
                name2:"繁体中文",
                thData:[],
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
                        const wsname = workbook.SheetNames[0];//取第一张表
                        const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
                        console.log(JSON.parse(JSON.stringify(ws)));
                        that.tableData = JSON.parse(JSON.stringify(ws));
                        that.thData = JSON.parse(JSON.stringify(Object.keys(that.tableData[0])));
                        console.log(that.thData)

                    } catch (e) {

                        return false;
                    }
                };
                fileReader.readAsBinaryString(files[0]);

            },
            exportText(){
                var that = this;
                let data= {};
                for(var i=0;i<this.tableData.length;i++){
                    data[this.tableData[i][this.name1]] = this.tableData[i][this.name2];
                }
                let jsonObj=JSON.stringify(data);
                //console.log(jsonObj);F:\eletrontest\TESTABC.txt
                var path = "F:\\eletrontest\\newelectron\\newdemo\\";
                fs.writeFile(path+"abc.text",jsonObj,function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        that.$message({
                            message: '更新text成功！',
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
