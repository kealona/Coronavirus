<template>
  <div style="height: 100%;">
      <klHeader id="header"></klHeader>
      <div class="kl-model">
          <el-table :data="modelList" style="width: 90%;font-weight: bold;" align="center">
              <el-table-column prop="idx_filename" label="文件名称"></el-table-column>
              <el-table-column prop="idx_status" label="状态">
                  <template slot-scope="scope">
                      <el-tag v-if="scope.row.status" type="success" style="font-weight: bold;">正在使用</el-tag>
                  </template>
              </el-table-column>
              <el-table-column label="操作" width="500px">
                  <template slot-scope="scope">
                     <el-button type="danger" size="small" round icon="el-icon-delete" @click="deleteFile(scope.row.pk_id, scope.row.idx_filepath)">删除文件</el-button>
                     <el-button type="success" size="small" round icon="el-icon-setting" @click="useFile(scope.row.pk_id)">使用该模型</el-button>
                  </template>
              </el-table-column>
          </el-table>
      </div>
  </div>
</template>

<script>
import klHeader from "../components/header";
import $ from 'jquery'
import axios from 'axios'

const prefix = "http://123.57.149.69:8080";

export default {
    data () {
        return {
            modelList: []
        }
    },
    components: {
        klHeader,
    },
    mounted() {
        $('.kl-model').css('padding-top', $('#header').height() + 40 + 'px')
    },
    created() {
        this.getAllFiles()
    },
    methods: {
        /**
         * 获取所有文件
         */
        getAllFiles () {
            axios.post(prefix + '/manageMent/fileList')
            .then((res) => {
                this.modelList = res.data
            })
        },
        /**
         * 删除文件
         * @param {Number} id 文件id
         * @param {String} filepath 文件路径
         */
        deleteFile (id, filepath) {
            axios.post(prefix + '/manageMent/deleteFile', {
                id: id,
                filepath: filepath
            })
            .then((res) => {
                this.$message.success('删除成功')
                this.getAllFiles()
            })
        },
        /**
         * 使用该模型
         */
        useFile (id) {
            axios.post(prefix + '/', null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                     "access-control-allow-credentials": "true"
                }
            })
            .then((res) => {
                
            })
        }
    },
};
</script>

<style scoped>
    .kl-model {
        padding: 100px 80px;
        height: 100%;
        width: 100%;
        background-image: url("http://v.bootstrapmb.com/2021/8/6cpp310953/assets/img/hero/app-overview-main-bg.png");
        background-size: 100% 100%;
        background-attachment: scroll;
        background-position: center center;
        background-repeat: no-repeat;
        overflow: hidden;
    }
</style>