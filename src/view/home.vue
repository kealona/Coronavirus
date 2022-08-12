<template>
  <div style="height: 100%">
    <klheader
      style="box-shadow: 0 8px 20px rgb(55 125 255 / 8%)"
      id="header"
    ></klheader>
    <div class="kl-content">
      <div>
        <el-upload
          style="display: none"
          ref="upload"
          action="/"
          :limit="1"
          accept=".csv,.xlsx"
          :before-upload="onBeforeUploadFile"
          :http-request="uploadFile"
        ></el-upload>
        <a class="kl-content-btn" @click="clickUploadBtn"
          >Upload <i class="el-icon-upload"></i
        ></a>
        <span class="kl-content__tips"
          >Tips:上传文件字段必须包括date，state，county，cases，death且只能上传xlsx/csv文件</span
        >
      </div>
      <div class="kl-content-list_group">
        <ul class="kl-content-list">
          <li
            v-for="(item, index) in fileList"
            :key="index"
            @click="displayOperation"
            class="kl-content-list-item"
          >
            <article class="kl-content-list__container">
              <div class="kl-content-list__main">
                <div class="kl-content-list__layout">
                  <div class="kl-content-list__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="kl-content-list__svg"
                      viewBox="0 0 189 131"
                      aria-hidden="true"
                    >
                      <defs>
                        <filter
                          x="-9.5%"
                          y="-34%"
                          width="118.9%"
                          height="167.9%"
                          filterUnits="objectBoundingBox"
                          id="dashboard/thumbnailMode/foldera"
                        >
                          <feGaussianBlur
                            stdDeviation="5.156"
                            in="SourceGraphic"
                          ></feGaussianBlur>
                        </filter>
                      </defs>
                      <g fill="none" fill-rule="evenodd">
                        <path
                          d="M16.286.571H172.15a8 8 0 0 1 8 8v92.54H8.286V8.572a8 8 0 0 1 8-8z"
                          :fill="getMainColor(item.idx_filecolor)"
                        ></path>
                        <path
                          d="M30.637 11.743h127.161a8.602 8.602 0 0 1 8.603 8.602V92.51a8.602 8.602 0 0 1-8.603 8.602H30.637a8.602 8.602 0 0 1-8.602-8.602V20.345a8.602 8.602 0 0 1 8.602-8.602z"
                          fill-opacity=".7"
                          fill="#FFF"
                        ></path>
                        <path
                          d="M23.762 22.054h140.911a8.602 8.602 0 0 1 8.602 8.603v80.758a8.602 8.602 0 0 1-8.602 8.602H23.763a8.602 8.602 0 0 1-8.603-8.602V30.657a8.602 8.602 0 0 1 8.602-8.603z"
                          fill="#FFF"
                        ></path>
                        <path
                          d="M11.171 39.486h149.522a6.875 6.875 0 0 1 6.874 6.874v38.67H4.297V46.36a6.875 6.875 0 0 1 6.874-6.874z"
                          fill="#C57D00"
                          opacity=".099"
                          filter="url(#dashboard/thumbnailMode/foldera)"
                          transform="matrix(-1 0 0 1 180.15 .571)"
                        ></path>
                        <path
                          d="M171.548 40.347H54.837a6.875 6.875 0 0 1-4.473-1.654l-6.168-5.285a6.875 6.875 0 0 0-4.473-1.654H16.888a8.602 8.602 0 0 0-8.602 8.602v81.618a8.602 8.602 0 0 0 8.602 8.602h154.66a8.602 8.602 0 0 0 8.602-8.602V48.95a8.602 8.602 0 0 0-8.602-8.603z"
                          :fill="getColor(item.idx_filecolor)"
                        ></path>
                      </g>
                    </svg>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="更多"
                      placement="bottom"
                      transition="el-zoom-in-bottom"
                    >
                      <button class="kl-content-icon_more">
                        <i class="el-icon-more"></i>
                      </button>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </article>
            <article class="kl-content-list__name">
              {{ item.idx_filename }}
            </article>
            <p style="display: none">{{ item.pk_id }}</p>
            <p style="display: none">{{ item.idx_filepath }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="kl-dialog"
      v-if="show"
      :style="'top: ' + tranTop + ';left: ' + tranLeft"
    >
      <ul class="kl-dialog-list">
        <li>
          <div class="wrapper" @click="clickToDownload">下载</div>
        </li>
        <li style="height: 30px">
          <div style="display: inline-block" class="kl-dialog__color_list">
            <button
              @click="changeColor('DEFAULT')"
              style="
                background-color: rgb(161, 173, 187);
                border-color: rgb(139, 153, 168);
              "
            ></button>
            <button
              @click="changeColor('RED')"
              style="
                background-color: rgb(249, 120, 112);
                border-color: rgb(246, 91, 81);
              "
            ></button>
            <button
              @click="changeColor('YELLOW')"
              style="
                background-color: rgb(247, 175, 99);
                border-color: rgb(245, 150, 24);
              "
            ></button>
            <button
              @click="changeColor('GREEN')"
              style="
                background-color: rgb(115, 206, 120);
                border-color: rgb(59, 195, 76);
              "
            ></button>
            <button
              @click="changeColor('BLUE')"
              style="
                background-color: rgb(97, 156, 248);
                border-color: rgb(27, 126, 245);
              "
            ></button>
          </div>
        </li>
        <li>
          <div class="wrapper" @click="changeNameDialog = true">重命名</div>
        </li>
        <li>
          <div class="wrapper" style="color: rgb(208, 2, 27)" @click="deleteFile">删除</div>
        </li>
      </ul>
    </div>

    <!-- 重命名文件对话框 开始 -->
    <el-dialog title="重命名文件" :visible.sync="changeNameDialog">
      <el-form :model="form">
        <el-form-item label="文件名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeNameDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeName"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 重命名文件对话框 结束 -->
  </div>
</template>

<script>
import header from "../components/header";
import $ from "jquery";
import axios from "axios";
import XLSX from "xlsx";

const prefix = "http://123.57.149.69:8080";

export default {
  components: {
    klheader: header,
  },
  data() {
    return {
      fileList: [], //文件列表
      show: false, //是否显示操作容器
      tranLeft: 0, //操作容器位置
      tranTop: 0,
      id: 1, //当前操作id
      changeNameDialog: false, //重命名对话框
      formLabelWidth: '120px',
      form: {},
      filepath: ''
    };
  },
  created() {
    this.getAllFiles();
  },
  mounted() {
    $(".kl-content").css("padding-top", $("#header").height() + 40 + "px");
    document.addEventListener("click", (e) => {
      if (
        e.target.className != "kl-content-list-item" &&
        e.target.className != "el-icon-more" &&
        e.target.className != "kl-tooltip" &&
        e.target.className != "kl-content-icon_more"
      ) {
        this.show = false;
      } else {
        this.show = true;
      }
    });
  },
  methods: {
    /**
     * 展示操作栏
     */
    displayOperation(e) {
      this.tranLeft = e.pageX + "px";
      this.tranTop = e.pageY + "px";
      this.show = true;
      let parents = e.path;
      for (let item of parents) {
        if (item.className == "kl-content-list-item") {
          this.id = item.childNodes[4].innerHTML;
          this.filepath = item.childNodes[5].innerHTML
          break;
        }
      }
    },
    /**
     * 自定义上传文件
     */
    uploadFile(file) {
      let data = new FormData();
      data.append("file", file.file);
      axios
        .post(prefix + "/manageMent/uploadFile", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          this.$message.success("上传成功");
          this.getAllFiles();
        });
    },
    /**
     * 在上传文件之前
     */
    onBeforeUploadFile(file) {
      const fileds = ["date", "county", "state", "cases", "deaths"];
      let reader = new FileReader();
      let isCSV = file.name.split(".")[1] == "csv";
      let wb; //读取完成的数据
      let flag; //是否符合上传要求
      reader.onload = (e) => {
        let data = e.target.result;
        if (isCSV) {
          wb = data.split("\n");
          data = wb[0].split(",");
          data[data.length - 1] = data[data.length - 1].replace("\r", "");
          flag = data.sort().toString() == fileds.sort().toString();
        } else {
          let workbook = XLSX.read(data, { type: "binary" });
          let headers_key = new Array();
          let str = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
          );
          for (let key in str[0]) {
            headers_key.push(key);
          }
          flag = headers_key.sort().toString() == fileds.sort().toString();
          let outdata = XLSX.utils.sheet_to_csv(
            workbook.Sheets[workbook.SheetNames[0]]
          );
        }
        if (!flag) {
          this.$message.error(
            "上传文件字段必须包括date，state，county，cases，death"
          );
        }
        return flag;
      };
      reader.readAsBinaryString(file);
    },
    /**
     * 点击上传文件按钮
     */
    clickUploadBtn() {
      //触发文件上传的input组件
      this.$refs["upload"].$children[0].$refs.input.click();
    },
    /**
     * 获取文件列表
     */
    getAllFiles() {
      axios
        .post(prefix + "/manageMent/fileList", null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((res) => {
          this.fileList = res.data;
        });
    },
    /**
     * 点击下载按钮
     */
    clickToDownload() {
      try {
        let element = document.createElement("iframe");
        let src;
        for (let i = 0; i < this.fileList.length; i++) {
          if (this.fileList[i].pk_id == this.id) {
            src = prefix + this.fileList[i].idx_filepath;
          }
        }
        element.src = src;
        element.style.display = "none";
        document.body.appendChild(element);
      } catch (e) {
        console.log(e);
      }
    },
    /**
     * 重命名文件
     */
    changeName () {
      axios.post(prefix+'/manageMent/changeFileName', {
        id: this.id,
        name: this.form.name
      })
      .then((res) => {
        this.$message.success('重命名成功')
        this.getAllFiles()
        this.changeNameDialog = false
      })
    },
    /**
     * 删除文件
     */
    deleteFile() {
      axios.post(prefix+'/manageMent/deleteFile', {
        id: this.id,
        filepath: this.filepath
      })
      .then((res) => {
        this.$message.success('删除成功')
        this.getAllFiles()
      })
    },
    /**
     * 改变文件的颜色
     */
    changeColor(color) {
      axios.post(prefix + '/manageMent/changeFileColor', {
        id: this.id,
        color: color
      })
      .then((res) => {
        this.$message.success('修改成功')
        this.getAllFiles()
      })
    }
  },
  computed: {
    getMainColor() {
      return function (name) {
        if (name == "RED") {
          return "rgb(240, 146, 125)";
        } else if (name == "DEFAULT") {
          return "rgb(198, 207, 217)";
        } else if (name == "GREEN") {
          return "rgb(141, 227, 154)";
        } else if (name == "YELLOW") {
          return "rgb(237, 212, 123)";
        } else if (name == "BLUE") {
          return "rgb(130, 185, 251)";
        }
      };
    },
    getColor() {
      return function (name) {
        if (name == "RED") {
          return "rgb(240, 164, 146)";
        } else if (name == "DEFAULT") {
          return "rgb(220, 224, 232)";
        } else if (name == "GREEN") {
          return "rgb(171, 237, 180)";
        } else if (name == "YELLOW") {
          return "rgb(247, 220, 139)";
        } else if (name == "BLUE") {
          return "rgb(166, 206, 255)";
        }
      };
    },
  },
};
</script>

<style scoped>
.kl-content {
  height: 100%;
  width: 100%;
  background-image: url("http://v.bootstrapmb.com/2021/8/6cpp310953/assets/img/hero/app-overview-main-bg.png");
  background-size: 100% 100%;
  background-attachment: scroll;
  background-position: center center;
  background-repeat: no-repeat;
  overflow: hidden;
  padding: 40px;
}

.kl-content-btn {
  font-size: 0.6em;
  font-weight: bolder;
  box-shadow: 0 10px 30px 0 rgb(71 59 240 / 36%);
  text-transform: capitalize;
  vertical-align: middle;
  overflow: hidden;
  background-color: #473bf0;
  padding: 12px 40px;
  border-radius: 50px;
  color: #fff;
  display: inline-block;
  position: relative;
  z-index: 1;
  cursor: pointer;
  margin-right: 20px;
}

.kl-content-btn:hover {
  box-shadow: 0 0 30px 0 rgb(0 0 0 / 30%);
  color: #fff;
}

.kl-content-btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #161c2d;
  transition: 0.3s;
  border-radius: 50px;
  width: 0;
  box-sizing: border-box;
  z-index: -1;
}

.kl-content-btn:hover::after {
  width: 100%;
}

.kl-content__tips {
  font-size: 0.5em;
  font-weight: bold;
}

.kl-content-list {
  margin: 0;
  padding: 0px 40px;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  -webkit-box-align: start;
  align-items: start;
  margin-right: -52px;
}

.kl-content-list li {
  margin-right: 52px;
}

.kl-content-list__container {
  position: relative;
  box-sizing: border-box;
  width: 140px;
  margin-bottom: 8px;
  display: block;
  height: 100px;
}

.kl-content-list__main {
  cursor: pointer;
  transition: all 0.2s ease-in-out 0s;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  margin-bottom: 8px;
  border-radius: 8px;
}

.kl-content-list__main:hover {
  background-color: rgb(235, 235, 235);
}

.kl-content-list__main:hover .kl-content-icon_more {
  opacity: 1;
}

.kl-content-list__layout {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.kl-content-list__svg {
  height: 80px;
  width: 100px;
}

.kl-content-list_group {
  margin-left: 20px;
  padding-right: 40px;
  margin-top: 20px;
  flex: 1 1 0%;
}

.kl-content-list__name {
  font-size: 0.8em;
  text-align: center;
  font-weight: bold;
}

.kl-content-icon_more {
  position: absolute;
  right: 2px;
  top: 2px;
  opacity: 0;
  transition: opacity 0.1s ease-in-out;
  width: 22px;
  height: 22px;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: rgb(82, 94, 113);
  border-radius: 2px;
}

.kl-content-icon_more:hover {
  background-color: rgb(216, 216, 216);
}

.kl-dialog-list {
  box-shadow: rgb(0 0 0 / 14%) 0px 2px 16px 0px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  padding: 2px 0px;
  transition: all 0.2s ease-in-out;
  min-width: 226px;
  list-style: none;
}

.kl-dialog-list li {
  position: relative;
}

.kl-dialog-list li:hover {
  background-color: rgb(242, 242, 242);
}

.kl-dialog {
  background-color: #fff;
  position: absolute;
}

.wrapper {
  padding: 0 16px;
  height: 30px;
  align-items: center;
  cursor: pointer;
  color: rgb(65, 80, 88);
  display: flex;
  font-size: 0.4em;
  font-weight: bold;
}

.kl-dialog__color_list {
  list-style: none;
  z-index: 10;
  height: 30px;
  padding-left: 20px;
  padding-top: 7px;
}

.kl-dialog__color_list button {
  height: 15px;
  width: 15px;
  padding: 0;
  border-radius: 10px;
  margin-right: 5px;
  outline: none;
  display: inline;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  line-height: 30px;
  transform: translateY(-18px);
  cursor: pointer;
}
</style>