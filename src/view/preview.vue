<template>
  <div style="height: 100%">
    <klHeader id="header"></klHeader>
    <div class="kl-preview__op">
      <span>筛选日期：</span>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        style="margin-right: 20px"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
      <span>选择类型</span>
      <el-select v-model="type">
        <el-option value="CASES" label="感染人数">感染人数</el-option>
        <el-option value="DEATHS" label="死亡人数">死亡人数</el-option>
      </el-select>
      <el-link
        @click.native="playEpidemic"
        :underline="false"
        style="font-size: 24px; font-weight: bold; float: right"
        ><i :class="play ? 'el-icon-video-pause' : 'el-icon-video-play'"></i
        >疫情回顾</el-link
      >
    </div>
    <div class="kl-preview">
      <div class="kl-preview-map">
        <div id="map" style="background-color: #fff; border-radius: 10px"></div>
      </div>
      <div class="kl-preview-chart">
        <div
          id="chart"
          style="background-color: #fff; border-radius: 10px"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import klHeader from "../components/header";
import * as echarts from "echarts";
import axios from "axios";

const ROOT_PATH =
  "https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples";

const prefix = "http://123.57.149.69:8080";

let option = {
  title: {
    text: "USA epidemic situation data",
    left: "left",
  },
  tooltip: {
    trigger: "item",
    showDelay: 0,
    transitionDuration: 0.2,
    formatter: function (params) {
      var value = (params.value + "").split(".");
      value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,");
      return params.seriesName + "<br/>" + params.name + ": " + value;
    },
  },
  visualMap: {
    left: "right",
    min: 0,
    max: 50000,
    inRange: {
      color: [
        "rgba(255, 255, 128, 0.8)",
        "rgba(252, 224, 98, 0.8)",
        "rgba(242, 167, 46, 0.8)",
        "rgba(196, 109, 27, 0.8)",
        "rgba(150, 58, 12, 0.8)",
        "rgb(107, 6, 0.8)",
      ],
    },
    text: ["High", "Low"], // 文本，默认为数值文本
    calculable: true,
  },
  toolbox: {
    show: true,
    //orient: 'vertical',
    left: "right",
    top: "top",
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {},
    },
  },
  series: [
    {
      name: "USA Epidemic situation",
      type: "map",
      roam: true,
      map: "USA",
      emphasis: {
        label: {
          show: true,
        },
      },
      // 文本位置修正
      textFixed: {
        Alaska: [20, -20],
      },
      data: [
        { name: "Alabama", value: 4822023 },
        { name: "Alaska", value: 731449 },
        { name: "Arizona", value: 6553255 },
        { name: "Arkansas", value: 2949131 },
        { name: "California", value: 38041430 },
        { name: "Colorado", value: 5187582 },
        { name: "Connecticut", value: 3590347 },
        { name: "Delaware", value: 917092 },
        { name: "District of Columbia", value: 632323 },
        { name: "Florida", value: 19317568 },
        { name: "Georgia", value: 9919945 },
        { name: "Hawaii", value: 1392313 },
        { name: "Idaho", value: 1595728 },
        { name: "Illinois", value: 12875255 },
        { name: "Indiana", value: 6537334 },
        { name: "Iowa", value: 3074186 },
        { name: "Kansas", value: 2885905 },
        { name: "Kentucky", value: 4380415 },
        { name: "Louisiana", value: 4601893 },
        { name: "Maine", value: 1329192 },
        { name: "Maryland", value: 5884563 },
        { name: "Massachusetts", value: 6646144 },
        { name: "Michigan", value: 9883360 },
        { name: "Minnesota", value: 5379139 },
        { name: "Mississippi", value: 2984926 },
        { name: "Missouri", value: 6021988 },
        { name: "Montana", value: 1005141 },
        { name: "Nebraska", value: 1855525 },
        { name: "Nevada", value: 2758931 },
        { name: "New Hampshire", value: 1320718 },
        { name: "New Jersey", value: 8864590 },
        { name: "New Mexico", value: 2085538 },
        { name: "New York", value: 19570261 },
        { name: "North Carolina", value: 9752073 },
        { name: "North Dakota", value: 699628 },
        { name: "Ohio", value: 11544225 },
        { name: "Oklahoma", value: 3814820 },
        { name: "Oregon", value: 3899353 },
        { name: "Pennsylvania", value: 12763536 },
        { name: "Rhode Island", value: 1050292 },
        { name: "South Carolina", value: 4723723 },
        { name: "South Dakota", value: 833354 },
        { name: "Tennessee", value: 6456243 },
        { name: "Texas", value: 26059203 },
        { name: "Utah", value: 2855287 },
        { name: "Vermont", value: 626011 },
        { name: "Virginia", value: 8185867 },
        { name: "Washington", value: 6897012 },
        { name: "West Virginia", value: 1855413 },
        { name: "Wisconsin", value: 5726398 },
        { name: "Wyoming", value: 576412 },
        { name: "Puerto Rico", value: 3667084 },
      ],
    },
  ],
};

let option1 = {
        visualMap: [
          {
            show: false,
            type: "continuous",
            seriesIndex: 0,
            min: 0,
            max: 400,
          },
        ],

        title: [
          {
            left: "center",
            text: "USA epidemic situation",
          },
        ],
        tooltip: {
          trigger: "axis",
        },
        xAxis: [
          {
            data: [],
          },
        ],
        yAxis: [{}],
        series: [
          {
            type: "line",
            showSymbol: false,
            data: [],
            markLine: {
              data:[]
            }
          },
        ],
      };

let interval;

export default {
  data() {
    return {
      play: false, //疫情回顾按钮
      date: "2020-04-10", //展示的开始日期
      type: "CASES", //展示的类型
      map: null, //地图
      chart: null //折线图
    };
  },
  components: {
    klHeader,
  },
  async mounted() {
    $(".kl-preview").css("height", window.innerHeight * 0.7 + "px");
    $(".kl-preview__op").css("padding-top", $("#header").height() + 60 + "px");
    $("#map").css("height", $(".kl-preview-map").height() + "px");
    $("#map").css("width", $(".kl-preview-map").width() + "px");
    $("#chart").css("height", $(".kl-preview-chart").height() + "px");
    $("#chart").css("width", $(".kl-preview-chart").width() + "px");
    await this.initMap();
    this.getCasesMap();
    this.initChart();
    this.getChartData()
  },
  methods: {
    /**
     * 获取图表数据
     */
    getChartData () {
      axios.post(prefix + '/manageMent/totalData', {
        TYPE: this.type,
        date: this.date
      })
      .then((res) => {
        let data = res.data.data
        let time = res.data.time
        let dateList = data.map((item, index) => {
          if(time == item.idx_date) {
            option1.series[0].markLine.data[0] = {
              name: '预测线',
              xAxis: index
            }
          }
          return item.idx_date
        })
        let valueList 
        if(this.type == 'CASES') {
          valueList = data.map((item) => {
            return item.idx_total_cases
          })
        } else {
          valueList = data.map((item) => {
            return item.idx_total_death_cases
          })
        }
       // option1.xAxis[0].data = dateList
        option1.series[0].data = valueList
        this.chart.setOption(option1, true)
      })
    },
    /**
     * 获取全国感染地图信息
     */
    getCasesMap() {
      axios
        .post(prefix + "/checkState/countDiagnosisByDate", {
          date: this.date,
        })
        .then((res) => {
          let data = this.formData(res.data, "CASES");
          let options = option;
          options.series.data = data;
          options.series[0].data = data;
          this.map.setOption(options, true);
        });
    },
    /**
     * 获取全国死亡地图信息
     */
    getDeathsMap() {
      axios
        .post(prefix + "/checkState/countDeathByDate", {
          date: this.date,
        })
        .then((res) => {
          let data = this.formData(res.data, "DEATHS");
          let options = option;
          options.series.data = data;
          options.series[0].data = data;
          this.map.setOption(options, true);
        });
    },
    /**
     * 格式化数据
     * @param {Array} data 数据
     * @param {String} type 图表类型
     */
    formData(data, type) {
      let res = [];
      for (let i = 0; i < data.length; i++) {
        if (type == "CASES") {
          res.push({
            name: data[i].idx_state,
            value: data[i].idx_total_cases,
          });
        } else {
          res.push({
            name: data[i].idx_state,
            value: data[i].idx_total_death_cases,
          });
        }
      }
      return res;
    },
    /**
     * 初始化地图
     */
    async initMap() {
      return new Promise(async (resolve, reject) => {
        let json = await this.getMapJson();
        this.map = echarts.init(document.getElementById("map"));
        echarts.registerMap("USA", json, {
          Alaska: {
            left: -131,
            top: 25,
            width: 15,
          },
          Hawaii: {
            left: -110, // 夏威夷
            top: 28,
            width: 5,
          },
          "Puerto Rico": {
            // 波多黎各
            left: -76,
            top: 26,
            width: 2,
          },
        });
        this.map.setOption(option);
        resolve();
      });
    },
    /**
     * 获取地图json数据
     */
    getMapJson() {
      return new Promise((resolve, reject) => {
        axios
          .get(ROOT_PATH + "/data/asset/geo/USA.json")
          .then((res) => {
            if (res.status != 200) {
              this.$message.error("请检查网络");
            } else {
              resolve(res.data);
            }
          })
          .catch((err) => {
            this.$message.error("请检查网络");
            reject(err);
          });
      });
    },
    /**
     * 初始化折线图
     */
    initChart() {
      var data = [];

      var dateList = data.map(function (item) {
        return item[0];
      });
      var valueList = data.map(function (item) {
        return item[1];
      });
      option1.xAxis[0].data = dateList
      option1.series[0].data = valueList
      let chartDom = document.getElementById("chart");
      this.chart = echarts.init(chartDom);
      this.chart.setOption(option1);
    },
    /**
     * 开始疫情回顾
     */
    playEpidemic() {
      if (this.play == false) {
        this.play = true;
      } else {
        this.play = false;
      }
    },
    /**
     * 格式化日期
     */
    formatDate(date) {
      var date = new Date(date);
      var YY = date.getFullYear() + "-";
      var MM =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return YY + MM + DD;
    },
  },
  watch: {
    play: function (val) {
      if (val == true) {
        interval = setInterval(() => {
          let dateTime = new Date(this.date);
          dateTime = dateTime.setDate(dateTime.getDate() + 1);
          this.date = this.formatDate(dateTime);
        }, 700);
      } else {
        clearInterval(interval);
      }
    },
    date: function(val) {
      if (this.type == "CASES") {
        this.getCasesMap();
      } else {
        this.getDeathsMap();
      }
      this.getChartData()
    },
    type: function (val) {
      if (val == "CASES") {
        this.getCasesMap();
      } else {
        this.getDeathsMap();
      }
      this.getChartData()
    }
  },
};
</script>

<style scoped>
.kl-preview {
  padding: 30px 60px;
  height: 100%;
  background-color: #f4f7fa;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
}

.kl-preview__op {
  padding: 0 80px;
  background-color: #f4f7fa;
}

.kl-preview-map {
  max-width: 50%;
  background-color: #f4f7fa;
  flex: 0 0 60%;
  box-sizing: border-box;
  padding: 0 15px;
}

.kl-preview-chart {
  max-width: 50%;
  background-color: #f4f7fa;
  flex: 0 0 50%;
  box-sizing: border-box;
  padding: 0 15px;
}

.kl-preview__op {
  display: block;
  font-size: 18px;
  font-weight: bold;
}
</style>