<template>
  <div>
    <div class="header">
      <el-row>
        <el-col :span="4" :offset="1">
          <div class="div_border">
            <span>新型冠状病毒肺炎疫情分布</span>
          </div>
        </el-col>
        <el-col :span="3">
          <span id="date">{{ date_pic }}</span>
        </el-col>
        <el-col :span="6" :offset="4">
          <el-button class="mapSort_btn">累计确诊</el-button>
          <el-button class="mapSort_btn">累计死亡</el-button>
        </el-col>
        <el-col :span="4" :offset="2">
          <span>The United States of America</span>
        </el-col>
      </el-row>
    </div>
    <div class="main_right">
      <div class="title_border">
        <h6>累计概况</h6>
        <span class="time">{{ date_pic }}</span>
      </div>
      <div class="virus_station">
        <div>
          <p style="color: #d9172e" class="data_value">{{ diagnosis }}</p>
          <p>确诊</p>
        </div>
        <div>
          <p style="color: #5994ff" class="data_value">{{ death }}</p>
          <p>死亡</p>
        </div>
      </div>
      <div class="title_border">
        <h6>累计病例详情
          <div style="float: right;margin-right: 1em;">
            <el-link @click="playMap" :underline="false" style="font-size: 1em;font-weight: bold;color: rgb(239 234 234)"><i :class="[className? 'el-icon-video-play' : 'el-icon-video-pause']"></i>疫情回顾</el-link>
          </div>
        </h6>
        <span class="time">{{ date_pic }}</span>
      </div>
      <div id="new_case"></div>
    </div>
    <div id="legend">
      <ul>
        <li>
          <img src="../assets/疫情1.png"/>
          <span>{{ status }}人数＜10</span>
        </li>
        <li>
          <img src="../assets/疫情2.png"/>
          <span>{{ status }}人数＜100</span>
        </li>
        <li>
          <img src="../assets/疫情3.png"/>
          <span>{{ status }}人数＜1000</span>
        </li>
        <li>
          <img src="../assets/疫情4.png"/>
          <span>{{ status }}人数＜5000</span>
        </li>
        <li>
          <img src="../assets/疫情5.png"/>
          <span>{{ status }}人数＜10000</span>
        </li>
        <li>
          <img src="../assets/疫情6.png"/>
          <span>{{ status }}人数≥50000</span>
        </li>
      </ul>
    </div>
    <baidu-map
      @ready="initMap"
      class="map"
      :style="getWindowHeight"
      :scroll-wheel-zoom="true"
      :center="{ lng: -110.671841, lat: 57.195226 }"
      :zoom="4"
    >
      <bm-info-window
        :position="{ lng: infoWindowContent.lng, lat: infoWindowContent.lat }"
        :show="infoWindowShow"
        @close="infoWindowClose"
        @open="infoWindowOpen"
        :width="300"
        :heigth="100"
      >
        <div class="infoWindow">
          <span>{{ infoWindowContent.state }}州疫情情况</span>
          <el-divider></el-divider>
          <ul class="info_list">
            <li>
              <span>累计确诊</span>
              <span>{{ infoWindowContent.cases }}</span>
            </li>
            <li>
              <span>累计死亡</span>
              <span>{{ infoWindowContent.deathes }}</span>
            </li>
          </ul>
          <span style="margin-left: 5px"
            >风险等级：{{ infoWindowContent.grade }}</span
          >
          <div id="view_details" @click="jump_country">
            <i class="el-icon-zoom-in"></i>
            <span>查看详情</span>
          </div>
        </div>
      </bm-info-window>
      <bm-info-window
        :position="{ lng: infoWindowContent1.lng, lat: infoWindowContent1.lat }"
        :show="infoWindowShow1"
        @close="infoWindowClose1"
        @open="infoWindowOpen1"
        :width="100"
        :heigth="100"
      >
        <div class="infoWindow">
          <span>{{ infoWindowContent1.state }}疫情情况</span>
          <el-divider></el-divider>
          <ul class="info_list">
            <li>
              <span>累计确诊</span>
              <span>{{ infoWindowContent1.cases }}</span>
            </li>
            <li>
              <span>累计死亡</span>
              <span>{{ infoWindowContent1.deathes }}</span>
            </li>
          </ul>
          <span style="margin-left: 5px"
            >风险等级：{{ infoWindowContent1.grade }}</span
          >
          <div id="view_details" @click="jump_country1">
            <i class="el-icon-zoom-in"></i>
            <span>查看详情</span>
          </div>
        </div>
      </bm-info-window>
    </baidu-map>
    <div class="search_box">
      <div class="search_boxbar">
        <input id="search_bar" placeholder="搜索地图" />
        <el-button icon="el-icon-search" id="search_button"></el-button>
      </div>
    </div>
    <div id="date_pic">
      <el-date-picker
        @change="sel_date($event)"
        v-model="date_pic"
        type="date"
        placeholder="选择日期"
        size="large"
        value-format="yyyy-MM-dd"
        :picker-options="pickerDate"
      >
      </el-date-picker>
    </div>
    <div class="content_bg">
      <div class="content_part">
        <h3>疫情概况</h3>
        <span class="deadline">数据更新至{{ date_pic }}</span>
        <div class="Epidemic_info">
          <div class="data_section">
            <p class="data_name">累计死亡</p>
            <p class="data_value" style="color: #e83132">{{ diagnosis }}</p>
          </div>
          <div class="data_section">
            <p class="data_name">累计确诊</p>
            <p class="data_value" style="color: #ec9217">{{ death }}</p>
          </div>
        </div>
        <h3 style="margin-top: 40px">
          各州疫情预测
          <el-date-picker
            @change="sel_date($event)"
            v-model="date_forecast"
            type="date"
            placeholder="选择日期"
            size="large"
            value-format="yyyy-MM-dd"
            style="float: right; margin-bottom: 10px"
            :picker-options="pickerDate"
          >
          </el-date-picker>
        </h3>
        <div style="font-weight: bold">
          <el-table
            :data="state_datainfo"
            :style="'width: 100%;font-size: ' + fontSize(0.2) + 'px'"
            :default-sort="{ prop: 'diagnosis', order: 'descending' }"
            header-row-class-name="tableHead"
          >
            <el-table-column
              prop="idx_state"
              label="地区"
              width="250px"
            ></el-table-column>
            <el-table-column
              prop="idx_total_death_cases"
              label="总死亡人数"
              sortable
            ></el-table-column>
            <el-table-column
              prop="death_near_two_weeks"
              label="最近两周死亡"
              sortable
            ></el-table-column>
            <el-table-column
              prop="death_next_two_weeks"
              label="接下来两周死亡"
              sortable
            ></el-table-column>
            <el-table-column
              prop="absolute_value"
              label="区别"
              sortable
            ></el-table-column>
          </el-table>
        </div>
        <h3 style="margin-top: 40px">
          疫情详情
          <el-date-picker
            @change="sel_month($event)"
            v-model="month_forecast"
            type="month"
            placeholder="选择日期"
            size="large"
            value-format="yyyy-MM"
            style="position: absolute; right: 3%"
            :picker-options="pickerMonth"
          >
          </el-date-picker>
        </h3>
        <!-- <span class="deadline">数据更新至{{date_pic}}</span> -->

        <div>
          <el-carousel
            indicator-position="outside"
            ref="line_charts"
            :autoplay="autoplay"
            @change="change_page"
          >
            <el-carousel-item>
              <div id="newcase_line"></div>
            </el-carousel-item>
            <el-carousel-item>
              <div id="Cumulative_line">
                <span>累计病例折线图</span>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div id="rate_line">
                <span>病死率/治愈率折线图</span>
              </div>
            </el-carousel-item>
          </el-carousel>
          <div class="tab_charts">
            <el-button class="epidemic_name" @click="change_chart(3)"
              >新增概况</el-button
            >
            <el-button class="epidemic_name" @click="change_chart(1)"
              >累计概况</el-button
            >
            <el-button class="epidemic_name" @click="change_chart(2)"
              >疫情预测</el-button
            >
          </div>
        </div>
      </div>
      <div style="height: 60px"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import $ from "jquery";
import axios from "axios";
import "echarts/extension/bmap/bmap"; // 引入百度地图插件
import {BMAPGL} from "../utils/bmpgl"

import mapTheme from "echarts/theme/cool.js";

let interval

export default {
  // mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "120%",
    },
    height: {
      type: String,
      default: "280px",
    },
  },
  data() {
    return {
      getWindowHeight: {
        height: "",
        width: "",
      },
      map_data: [],
      infoWindowContent1: {},
      infoWindowContent: {},
      infoWindowShow: false,
      infoWindowShow1: false,
      date_pic: "2020-05-10",
      date: "2020-05-10",
      clock: "17:12",
      time: "2020-05-10",
      baseInfo: {
        diagnosis: 134,
        death: 1,
      },
      diagnosis: 134,
      death: 1,
      suspected: 20,
      chart: null,
      state: 1,
      autoplay: false,
      focus_btn: true,
      date_forecast: "2020-05-10",
      status: "确诊",
      month_forecast: "2020-05",
      dataPoint: [],
      state_datainfo: [],
      cur_case: [],
      className: true,
      newcase_data: [
        {
          date: "",
        },
      ],
      pickerDate: {
        disabledDate(time) {
          if (
            time.getTime() < new Date("2020-01-20").getTime() ||
            time.getTime() > new Date("2020-05-19").getTime()
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      pickerMonth: {
        disabledDate(time) {
          if (
            time.getTime() < new Date("2020-01").getTime() ||
            time.getTime() > new Date("2020-06").getTime()
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
    };
  },
  created() {
    //初始化搜索
    this.init_search();
    //初始化病例
    this.init_newcase(this.date_pic);
    axios({
      url: "http://123.57.149.69:8080/comulativeState/comulativeUsa",
      method: "post",
      data: {
        date: this.date_pic,
      },
    })
      .then((res) => {
        this.diagnosis = res.data.idx_total_cases;
        this.death = res.data.idx_total_death_cases;
      })
      .catch((err) => {
        console.log(err);
      });
    this.init_btn(this.status);
    //初始化新增病例
    this.init_newcase_line(this.month_forecast);
    //初始化累计病例
    this.init_Cumulative_line(this.month_forecast);
    //初始化全球病死率/治愈率line图
    this.init_rate_line(this.month_forecast);
    //初始化各州疫情预测的表格
    this.init_stateTable(this.date_pic);
    //初始化数字
    // this.init_numbers()
  },
  mounted() {
    $(".mapSort_btn:first").focus();
    $(".mapSort_btn:first").click(() => {
      console.log('点击确诊')
      this.status = "确诊";
      this.init_p(this.date_pic, "确诊");
    });
    $(".mapSort_btn:eq(1)").click(() => {
      console.log('点击死亡')
      this.status = "死亡";
      this.init_p(this.date_pic, "死亡");
    });
    this.autoAdaption();
    window.onresize = () => {
      this.autoAdaption();
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    /**
     * 初始化地图
     */
    initMap({ BMap, map }) {
      this.map = map;
      this.init_p(this.date_pic, this.status);
    },
    /**
     * 初始化地图疫情信息
     */
    async init_p(time, status) {
      //访问所有州的累计确诊人数
      let data = await this.get_allstate_case(time);
      let deathData = await this.get_allstate_death(time);

      let search_list = [];
      let data_list = [];
      let death_list = [];

      for (let i = 0; i < data.length; i++) {
        search_list[i] = data[i].idx_state;
        data_list[i] = data[i].idx_total_cases;
        death_list[i] = deathData[i].idx_total_death_cases;
      }

      let temp_list = data_list;

      if (status == "死亡") {
        temp_list = death_list;
      }
      var that = this;
      for (let j = 0; j < search_list.length; j++) {
        this.$ajax
          .get("/static/" + search_list[j] + ".json")
          .then(async (response) => {
            var data = response.data;
            var allPoints = [];
            var points1 = [];
            $.each(data.features, function () {
              allPoints = this.geometry.coordinates[0];
              for (let i = 0; i < allPoints.length; i++) {
                let lng = allPoints[i][0];
                let lat = allPoints[i][1];
                var bmapPoint = new BMap.Point(lng, lat);
                points1[i] = bmapPoint;
              }
            });
            var pic = new BMap.Polygon(points1, {
              strokeColor: "rgba(115, 76, 0, 1)",
              strokeWeight: 0.5333,
              strokeOpacity: 1,
              fillOpacity: 1,
            });
            // 不同等级数据添加颜色
            if (temp_list[j] <= 10) {
              pic.setFillColor("rgba(255, 255, 128, 0.8)");
            } else if (temp_list[j] <= 100) {
              pic.setFillColor("rgba(252, 224, 98, 0.8)");
            } else if (temp_list[j] <= 1000) {
              pic.setFillColor("rgba(242, 167, 46, 0.8)");
            } else if (temp_list[j] <= 5000) {
              pic.setFillColor("rgba(196, 109, 27, 0.8)");
            } else if (temp_list[j] <= 10000) {
              pic.setFillColor("rgba(150, 58, 12, 0.8)");
            } else {
              pic.setFillColor("rgba(107, 6, 1, 0.8)");
            }
            //给覆盖物添加hover高亮事件
            pic.addEventListener("mouseover", function (e) {});
            //给覆盖物添加mouseover鼠标离开事件
            pic.addEventListener("mouseout", function (e) {});
            //给覆盖物添加click点击事件
            pic.addEventListener("click", async function (e) {
              var point
              var gc
              await BMAPGL().then((BMapGL) => {
                point = new BMapGL.Point(e.point.lng, e.point.lat);
                that.infoWindowContent.lng = e.point.lng;
                that.infoWindowContent.lat = e.point.lat;
                gc = new BMapGL.Geocoder();
              })
              gc.getLocation(point, function (rs) {
                //用set方法实时更新data数据（原因：数据层次太多没有触发render函数自动更新）
                that.$set(
                  that.infoWindowContent,
                  "state",
                  rs.addressComponents.province
                );
                that.$set(that.infoWindowContent, "cases", data_list[j]);
                that.$set(that.infoWindowContent, "deathes", death_list[j]);
                let grade;
                if (data_list[j] <= 10) {
                  grade = 1;
                } else if (data_list[j] <= 100) {
                  grade = 2;
                } else if (data_list[j] <= 1000) {
                  grade = 3;
                } else if (data_list[j] <= 5000) {
                  grade = 4;
                } else if (data_list[j] <= 10000) {
                  grade = 5;
                } else {
                  grade = 6;
                }
                that.$set(that.infoWindowContent, "grade", grade);
              });
              that.infoWindowShow = true;
            });
            that.map.addOverlay(pic);
          })
          .catch((err) => {
            console.log(err + "出错了");
          });
      }
    },
    /**
     * 获取全国累计疫情
     */
    get_allstate_case(date) {
      return new Promise((resolve, reject) => {
        //访问所有州的累计确诊人数
        axios({
          url: "http://123.57.149.69:8080/checkState/countDiagnosisByDate",
          method: "post",
          data: {
            date: date,
          },
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    init_stateTable(date) {
      axios({
        url: "http://123.57.149.69:8080/prediction/statePrediction",
        method: "post",
        data: {
          date: date,
        },
      })
        .then((res) => {
          this.state_datainfo = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    get_allstate_death(date) {
      return new Promise((resolve, reject) => {
        //访问所有州的累计死亡人数
        axios({
          url: "http://123.57.149.69:8080/checkState/countDeathByDate",
          method: "post",
          data: {
            date: date,
          },
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
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
    /**
     * 点击疫情回顾按钮
     */
    playMap() {
      if(this.className) {
        interval = setInterval(() => {
          let dateTime = new Date(this.date_pic);
          dateTime = dateTime.setDate(dateTime.getDate() + 1);
          this.date_pic = this.formatDate(dateTime);
          if(this.date_pic == '2020-05-19') {
            clearInterval(interval);
            this.className = true
          }
          this.sel_date(this.date_pic)
        }, 700)
        this.className = false
      } else {
        clearInterval(interval);
        this.className = true
      }
      
    },
    getStateAll(name) {
      return new Promise((resolve, reject) => {
        axios({
          url: "http://123.57.149.69:8080/checkState/countDiagnosisAndDeath",
          method: "post",
          data: {
            date: this.date_pic,
            state: name,
          },
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * 初始化搜索功能
     */
    init_search() {
      var that = this;
      var ac = new BMap.Autocomplete({ //建立一个自动完成的对象
        input: "search_bar",
        location: that.map,
      });

      ac.addEventListener("onhighlight", function (e) {
        //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var address = "";
        if (e.fromitem.index > -1) {
          address =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str =
          "FromItem<br />index = " +
          e.fromitem.index +
          "<br />value = " +
          address;

        address = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          address =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str +=
          "<br />ToItem<br />index = " +
          e.toitem.index +
          "<br />value = " +
          address;
        document.getElementById("search_bar").innerHTML = str;
      });

      var myValue;
      ac.addEventListener("onconfirm", function (e) {
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        document.getElementById("search_bar").innerHTML =
          "onconfirm<br />index = " +
          e.item.index +
          "<br />myValue = " +
          myValue;

        setPlace();
      });

      function setPlace() {
        async function myFun() {
          var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          that.map.centerAndZoom(pp, 5);
          var point
          var gc
          await BMAPGL().then((BMapGL) => {
            point = new BMapGL.Point(pp.lng, pp.lat);
            that.infoWindowContent1.lng = pp.lng;
            that.infoWindowContent1.lat = pp.lat;
            gc = new BMapGL.Geocoder();
          })
          
          gc.getLocation(point, async (rs) => {
            let mydata = await that.getStateAll(rs.addressComponents.province);
            //用set方法实时更新data数据（原因：数据层次太多没有触发render函数自动更新）
            that.$set(
              that.infoWindowContent1,
              "state",
              rs.addressComponents.province
            );
           // console.log(mydata)
            that.$set(that.infoWindowContent1, "cases", mydata.idx_total_cases);
            that.$set(
              that.infoWindowContent1,
              "deathes",
              mydata.idx_total_death_cases
            );
            let grade;
            if (data_list[j] <= 10) {
              grade = 1;
            } else if (data_list[j] <= 100) {
              grade = 2;
            } else if (data_list[j] <= 1000) {
              grade = 3;
            } else if (data_list[j] <= 5000) {
              grade = 4;
            } else if (data_list[j] <= 10000) {
              grade = 5;
            } else {
              grade = 6;
            }
            that.$set(that.infoWindowContent1, "grade", grade);
          });
          that.infoWindowShow1 = true;
          //that.map.addOverlay(pic)
        }
        var local = new BMap.LocalSearch(that.map, {
          //智能搜索
          onSearchComplete: myFun,
        });
        local.search(myValue);
      }
    },
    /**
     * 自适应大小
     */
    autoAdaption() {
      this.getWindowHeight.height = window.innerHeight + "px";
      this.getWindowHeight.width = window.innerWidth + "px";
      $(".header").css("line-height", $(".header").height() + "px");
      $(".main_right").css(
        "height",
        window.innerHeight - $(".header").height() + "px"
      );
      $("#new_case").css("width", window.innerWidth * 0.22 + "px");
      $("#new_case").css("height", window.innerHeight * 0.6 + "px");
      $(".tableHead").css('font-size', this.fontSize(0.2) + 'px')
      $('#newcase_line').css('width', window.innerWidth * 0.9 + 'px')
      $('#newcase_line').css('height', window.innerHeight * 0.47 + 'px')
      $('#Cumulative_line').css('width', window.innerWidth * 0.9 + 'px')
      $('#Cumulative_line').css('height', window.innerHeight * 0.47 + 'px')
      $('#rate_line').css('width', window.innerWidth * 0.9 + 'px')
      $('#rate_line').css('height', window.innerHeight * 0.47 + 'px')
    },
    /**
     * 计算图表的字体大小
     */
    fontSize(res) {
      let docEl = document.documentElement,
        clientWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
      if (!clientWidth) return;
      let fontSize = 100 * (clientWidth / 1920);
      return res * fontSize;
    },
    /**
     * @param {Object} e 点击关闭信息窗口
     */
    infoWindowClose(e) {
      this.infoWindowShow = false;
    },
    /**
     * @param {Object} e 打开信息窗口
     */
    infoWindowOpen(e) {
      this.infoWindowShow = true;
    },
    /**
     * @param {Object} e 点击关闭信息窗口
     */
    infoWindowClose1(e) {
      this.infoWindowShow1 = false;
    },
    /**
     * @param {Object} e 打开信息窗口
     */
    infoWindowOpen1(e) {
      this.infoWindowShow1 = true;
    },
    convertPointData(data) {
      var res = [];
      for (const item in data) {
        res.push({
          name: data[item].name,
          value: [data[item].log, data[item].lat, data[item].remark],
        });
      }
      return res;
    },
    /**
     * 病例柱状图初始化
     */
    async init_newcase(date) {
      //向后端请求top10病例
      let data = await this.getTop(date);

      let state_list = [];
      let value_list = [];
      for (let i = 0; i < data.length; i++) {
        state_list[data.length - i - 1] = data[i].idx_state;
        value_list[data.length - i - 1] = data[i].idx_total_cases;
      }

      var newcase_chart = echarts.init(document.getElementById("new_case"));
      var option = {
        label: {
          emphasis: {
            textStyle: {
              color: "#fff",
              fontSize: this.fontSize(0.2)
            },
          },
        },
        grid: {
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            fontSize: this.fontSize(0.2)
          }
        },
        xAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#fff",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              fontSize: this.fontSize(0.14)
            }
          },
        },
        yAxis: {
          type: "category",
          name: "state",
          axisLine: {
            lineStyle: {
              color: "#fff",
            },
          },
          nameTextStyle: {
            fontSize: this.fontSize(0.17)
          },
          axisLabel: {
            textStyle: {
              fontSize: this.fontSize(0.14)
            }
          },
          data: state_list,
        },
        /* visualMap: {
            orient: 'horizontal',
            left: 'center',
            min: 10,
            max: 100,
            demension: 0,
            inRange: {
              color: ['#65b581', '#ffce34', '#fd665f']
            }
          }, */
        series: [
          {
            type: "bar",
            encode: {
              x: "amount",
              y: "name",
            },
            itemStyle: {
              color: function (params) {
                var colorList = [
                  "#fcde64",
                  "#ffcd18",
                  "#ecab1d",
                  "#EE9201",
                  "#e3783a",
                  "#e54225",
                  "#cc2e28",
                  "#bc180c",
                  "#930000",
                  "#5a0307",
                ];
                return colorList[params.dataIndex];
              },
            },
            data: value_list,
          },
        ],
      };
      newcase_chart.setOption(option);
    },
    /**
     * 获取top10累计确诊
     */
    getTop(date) {
      return new Promise((resolve, reject) => {
        axios
          .post("http://123.57.149.69:8080/comulativeState/comulativeTopTen", {
            date: date,
          })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * 点击改变走马灯item
     * @param {Object} index 走马灯的位置
     */
    change_chart(index) {
      $(".epidemic_name:eq(0)").removeClass("active_focus");
      this.$refs.line_charts.setActiveItem(index);
    },
    /**
     * 获取新增病例信息
     * @param {Object} date 月份
     */
    get_newcase_data(date) {
      return new Promise((resolve, reject) => {
        axios({
          url: "http://123.57.149.69:8080/stateChatController/sevenDaysNewAdditions",
          method: "post",
          data: {
            date: date,
          },
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * 获取全国累计病例和死亡信息
     * @param {Object} date 月份
     */
    get_all_data(date) {
      return new Promise((resolve, reject) => {
        axios({
          url: "http://123.57.149.69:8080/stateChatController/sevenDaysCountDiagnosis",
          method: "post",
          data: {
            date: date,
          },
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * 初始化新增病例折线图
     */
    async init_newcase_line(date) {
      $(".epidemic_name:eq(0)").addClass("active_focus");
      const colorList = ["#9E87FF", "#73DDFF", "#fe9a8b", "#F56948", "#9E87FF"];

      let data = await this.get_newcase_data(date);

      let newcase_list = [];
      let newdeath_list = [];
      let date_list = [];
      for (let i = 0; i < data.length; i++) {
        newcase_list[i] = data[i].idx_total_cases;
        newdeath_list[i] = data[i].idx_total_death_cases;
        date_list[i] = data[i].idx_date;
      }

      var newcase_chart = echarts.init(document.getElementById("newcase_line"));
      let option = {
        title: {
          text: "美国疫情新增趋势图",
          textStyle: {
            fontSize: this.fontSize(0.27),
            fontWeight: 700,
          },
        },
        legend: {
          icon: "circle",
          top: "5%",
          right: "5%",
          itemWidth: this.fontSize(0.15),
          itemGap: this.fontSize(0.16),
          textStyle: {
            color: "#556677",
            fontSize: this.fontSize(0.2)
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            label: {
              show: true,
              backgroundColor: "#fff",
              color: "#556677",
              borderColor: "rgba(0,0,0,0)",
              shadowColor: "rgba(0,0,0,0)",
              shadowOffsetY: 0,
            },
            lineStyle: {
              width: 0,
            },
          },
          backgroundColor: "#fff",
          textStyle: {
            color: "#5c6c7c",
            fontSize: this.fontSize(0.2)
          },
          padding: [10, 10],
          extraCssText: "box-shadow: 1px 1px 2px 1px rgba(163,163,163,0.5)",
        },
        grid: {
          top: "15%",
          x: 200,
        },
        xAxis: [
          {
            type: "category",
            data: date_list,
            axisLine: {
              lineStyle: {
                color: "#DCE2E8",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: "#556677",
                fontSize: this.fontSize(0.18)
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
              margin: 15,
            },
            axisPointer: {
              label: {
                // padding: [11, 5, 7],
                padding: [0, 0, 10, 0],

                margin: 15,
                // 移入时的字体大小
                fontSize: 12,
                backgroundColor: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#fff", // 0% 处的颜色
                    },
                    {
                      // offset: 0.9,
                      offset: 0.86,
                      /*
        0.86 = （文字 + 文字距下边线的距离）/（文字 + 文字距下边线的距离 + 下边线的宽度）
                                */
                      color: "#fff", // 0% 处的颜色
                    },
                    {
                      offset: 0.86,
                      color: "#33c0cd", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#33c0cd", // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
            },
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#DCE2E8",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#556677",
                fontSize: this.fontSize(0.17)
              },
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            position: "right",
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#556677",
                fontSize: this.fontSize(0.17)
              },
              formatter: "{value}",
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#DCE2E8",
              },
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "新增确诊",
            type: "line",
            data: newcase_list,
            symbolSize: 1,
            symbol: "circle",
            smooth: true,
            yAxisIndex: 0,
            showSymbol: true,
            lineStyle: {
              width: 5,
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "#9effff",
                },
                {
                  offset: 1,
                  color: "#9E87FF",
                },
              ]),
              shadowColor: "rgba(158,135,255, 0.3)",
              shadowBlur: 10,
              shadowOffsetY: 20,
            },
            itemStyle: {
              normal: {
                color: "#9E87FF",
                borderColor: "#9E87FF",
              },
            },
          },
          {
            name: "新增死亡",
            type: "line",
            data: newdeath_list,
            symbolSize: 1,
            yAxisIndex: 1,
            symbol: "circle",
            smooth: true,
            showSymbol: true,
            lineStyle: {
              width: 5,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#fe9a",
                },
                {
                  offset: 1,
                  color: "#fe9a8b",
                },
              ]),
              shadowColor: "rgba(254,154,139, 0.3)",
              shadowBlur: 10,
              shadowOffsetY: 20,
            },
            itemStyle: {
              normal: {
                color: "#fe9a8b",
                borderColor: "#fe9a8b",
              },
            },
          },
        ],
      };
      newcase_chart.setOption(option);
    },
    /**
     * 初始化美国累计病例折线图
     */
    async init_Cumulative_line(date) {
      const colorList = ["#9E87FF", "#73DDFF", "#fe9a8b", "#F56948", "#9E87FF"];

      let data = await this.get_all_data(date);

      let newcase_list = [];
      let newdeath_list = [];
      let date_list = [];
      for (let i = 0; i < data.length; i++) {
        newcase_list[i] = data[i].idx_total_cases;
        newdeath_list[i] = data[i].idx_total_death_cases;
        date_list[i] = data[i].idx_date;
      }

      var cmt_chart = echarts.init(document.getElementById("Cumulative_line"));
      var option = {
        title: {
          text: "美国疫情累计趋势图",
          textStyle: {
            fontSize: this.fontSize(0.27),
            fontWeight: 700,
          },
        },
        legend: {
          icon: "circle",
          top: "5%",
          right: "5%",
          itemWidth: this.fontSize(0.15),
          itemGap: this.fontSize(0.16),
          textStyle: {
            color: "#556677",
            fontSize: this.fontSize(0.2)
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            label: {
              show: true,
              backgroundColor: "#fff",
              color: "#556677",
              borderColor: "rgba(0,0,0,0)",
              shadowColor: "rgba(0,0,0,0)",
              shadowOffsetY: 0,
            },
            lineStyle: {
              width: 0,
            },
          },
          backgroundColor: "#fff",
          textStyle: {
            color: "#5c6c7c",
            fontSize: this.fontSize(0.2)
          },
          padding: [10, 10],
          extraCssText: "box-shadow: 1px 1px 2px 1px rgba(163,163,163,0.5)",
        },
        grid: {
          top: "15%",
          x: 200,
        },
        xAxis: [
          {
            type: "category",
            data: date_list,
            axisLine: {
              lineStyle: {
                color: "#DCE2E8",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: "#556677",
                fontSize: this.fontSize(0.18)
              },
              // 默认x轴字体大小
              fontSize: this.fontSize(0.17),
              // margin:文字到x轴的距离
              margin: 15,
            },
            axisPointer: {
              label: {
                // padding: [11, 5, 7],
                padding: [0, 0, 10, 0],

                margin: 15,
                // 移入时的字体大小
                fontSize: 12,
                backgroundColor: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#fff", // 0% 处的颜色
                    },
                    {
                      // offset: 0.9,
                      offset: 0.86,
                      /*
        0.86 = （文字 + 文字距下边线的距离）/（文字 + 文字距下边线的距离 + 下边线的宽度）
                                */
                      color: "#fff", // 0% 处的颜色
                    },
                    {
                      offset: 0.86,
                      color: "#33c0cd", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#33c0cd", // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
            },
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#DCE2E8",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#556677",
                fontSize: this.fontSize(0.17)
              },
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            position: "right",
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#556677",
                fontSize: this.fontSize(0.17)
              },
              formatter: "{value}",
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#DCE2E8",
              },
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "累计确诊",
            type: "line",
            data: newcase_list,
            symbolSize: 1,
            symbol: "circle",
            smooth: true,
            yAxisIndex: 0,
            showSymbol: true,
            lineStyle: {
              width: 5,
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "#9effff",
                },
                {
                  offset: 1,
                  color: "#9E87FF",
                },
              ]),
              shadowColor: "rgba(158,135,255, 0.3)",
              shadowBlur: 10,
              shadowOffsetY: 20,
            },
            itemStyle: {
              normal: {
                color: "#9E87FF",
                borderColor: "#9E87FF",
              },
            },
          },
          {
            name: "累计死亡",
            type: "line",
            data: newdeath_list,
            symbolSize: 1,
            yAxisIndex: 1,
            symbol: "circle",
            smooth: true,
            showSymbol: true,
            lineStyle: {
              width: 5,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#fe9a",
                },
                {
                  offset: 1,
                  color: "#fe9a8b",
                },
              ]),
              shadowColor: "rgba(254,154,139, 0.3)",
              shadowBlur: 10,
              shadowOffsetY: 20,
            },
            itemStyle: {
              normal: {
                color: "#fe9a8b",
                borderColor: "#fe9a8b",
              },
            },
          },
        ],
      };
      cmt_chart.setOption(option);
    },
    get_allPredict(date) {
      return new Promise((resolve, reject) => {
        axios({
          url: "http://123.57.149.69:8080/prediction/usaData",
          method: "post",
          data: {
            date: date,
          },
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * 初始化全国预测
     */
    async init_rate_line(date) {
      let data = await this.get_allPredict(date);
      let kneePoint = 0;

      let points = data.kneePoint;
      console.log(points);
      data = data.usaData;

      let case_list = [];
      let death_list = [];
      let date_list = [];
      for (let i = 0; i < data.length; i++) {
        case_list[i] = data[i].idx_total_case;
        death_list[i] = data[i].idx_total_death;
        date_list[i] = i + 1 + "日";
      }

      var rate_chart = echarts.init(document.getElementById("rate_line"));
      const colorList = ["#9E87FF", "#73DDFF", "#fe9a8b", "#F56948", "#9E87FF"];
      var cmt_chart = echarts.init(document.getElementById("Cumulative_line"));
      var option = {
        backgroundColor: "#fff",
        title: {
          text: "全国预测",
          textStyle: {
            fontSize: this.fontSize(0.27),
            fontWeight: 700,
          },
        },

        tooltip: {
          trigger: "axis",
          axisPointer: {
            label: {
              show: true,
              backgroundColor: "#fff",
              color: "#556677",
              borderColor: "rgba(0,0,0,0)",
              shadowColor: "rgba(0,0,0,0)",
              shadowOffsetY: 0,
            },
            lineStyle: {
              width: 0,
            }
          },
          backgroundColor: "#fff",
          textStyle: {
            color: "#5c6c7c",
            fontSize: this.fontSize(0.2)
          },
          padding: [10, 10],
          extraCssText: "box-shadow: 1px 1px 2px 1px rgba(163,163,163,0.5)",
          formatter: function (params) {
            let html = "";
            params.forEach((item) => {
              if (
                date[6] == 6 &&
                item.dataIndex + 1 == 17 &&
                item.seriesIndex ==
                  0 /* ||(date[6] == 3 && item.dataIndex+1 == 31 && item.seriesIndex == 0) */
              ) {
                //判断坐标点，并给与选中的样式
                html += '<h2 style="margin-bottom: 8px">疫情拐点</h2>';
                html += `${item.marker}${item.seriesName}:${item.value} </br>`;
              } else {
                html += `${item.marker}${item.seriesName}:${item.value} </br>`;
              }
            });
            return html;
          },
        },
        grid: {
          borderWidth: 0,
          top: 110,
          bottom: 95,
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          x: "46%",
          top: "11%",
          textStyle: {
            color: "#90979c",
            fontSize: this.fontSize(0.19)
          },
          data: ["感染人数", "死亡人数"],
        },

        calculable: true,
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#9daec8",
                width: 1.5,
              },
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: "#556677",
                fontSize: this.fontSize(0.16)
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
              margin: 15,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            data: date_list,
          },
        ],

        yAxis: [
          {
            name: "死亡人数",
            nameTextStyle: {
                fontSize: this.fontSize(0.175)
            },
            type: "value",
            splitLine: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#9daec8",
                width: 1.5,
              },
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: "#556677",
                fontSize: this.fontSize(0.17)
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
              margin: 15,
            },
          }
        ],
        dataZoom: [
          {
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,

            start: 0,
            end: 100,
            handleIcon:
              "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
            handleSize: "110%",
            handleStyle: {
              color: "#009ee7",
            },
            textStyle: {
              color: "rgba(25, 98, 170, 0.5)",
            },
            fillerColor: "rgba(17, 161, 213, 0.4)",
            borderColor: "rgba(17, 161, 213, 0.3)",
          },
          {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35,
          },
        ],
        series: [
          {
            name: "感染人数",
            type: "line",
            symbolSize: 8,
            symbol: "circle",
            itemStyle: {
              color: "#4fbdd3",
            },
            data: case_list,
            /* yAxisIndex: 0 */
          },
          {
            name: "死亡人数",
            type: "line",
            symbolSize: 8,
            symbol: "circle",
            itemStyle: {
              color: "#ee3f4d",
            },
            data: death_list,
            /* yAxisIndex: 1 */
          },
        ],
      };

      if (date[6] == 6) {
        kneePoint = 17;
        option.series[0].markPoint = {
          data: [
            {
              name: "预测拐点",
              value: "拐点" /* +data[kneePoint - 1].idx_total_case */,
              xAxis: kneePoint - 1,
              yAxis: data[kneePoint - 1].idx_total_case,
            },
          ],
          symbol: "pin",
        };
      }

      rate_chart.setOption(option);
    },
    /**
     * 改变走马灯对应的按钮的样式
     * @param {Object} val 当前走马灯的索引
     */
    change_page(val) {
      $(".epidemic_name:eq(0)").removeClass("active_focus");
      $(".epidemic_name:eq(1)").removeClass("active_focus");
      $(".epidemic_name:eq(2)").removeClass("active_focus");

      if (val == 0) $(".epidemic_name:eq(0)").addClass("active_focus");
      else if (val == 1) $(".epidemic_name:eq(1)").addClass("active_focus");
      else if (val == 2) $(".epidemic_name:eq(2)").addClass("active_focus");
    },
    /**
     * 跳转界面
     */
    jump_country() {
      let routeUrl = this.$router.resolve({
        path: "/country-map",
        query: {
          state: this.infoWindowContent.state,
        },
      });
      window.open(routeUrl.href, "_blank");
    },
    jump_country1() {
      let routeUrl = this.$router.resolve({
        path: "/country-map",
        query: {
          state: this.infoWindowContent1.state,
        },
      });
      window.open(routeUrl.href, "_blank");
    },
    /**
     * @param {Object} val 选中日期的值
     */
    sel_date(val) {
      //更新数据
      this.init_p(val, this.status);
      this.init_newcase(val, this.status);
      this.init_stateTable(val);
      axios({
        url: "http://123.57.149.69:8080/comulativeState/comulativeUsa",
        method: "post",
        data: {
          date: val,
        },
      })
        .then((res) => {
          this.diagnosis = res.data.idx_total_cases;
          this.death = res.data.idx_total_death_cases;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 选择月份
     * @param {Object} val 月份
     */
    sel_month(val) {
      this.init_newcase_line(val);
      this.init_Cumulative_line(val);
      this.init_rate_line(val);
    },
    /**
     * 初始化按钮
     */
    init_btn(status) {
      this.init_p(this.date_pic, status);
    },
    /**
     * 初始化数字
     */
    init_numbers() {
      var num = $(".data_value:lt(4)");
      var values = [6669775, 2610541, 594006, 33369192];
      _wu.seconds_Loading_Thousand_Points(num, values);
      var rate = $(".data_value:gt(3)");
      var rate_value = [79.8, 1.8];
      // _wu.seconds_loading(rate, rate_value)
      function init_rate(rate, rate_value) {
        let totalSeconds = 1000;
        let seconds = 30;
        let duration = totalSeconds / 10; //总时长
        let loadSeconds = seconds / 10; //秒数
        for (let i = 0; i < rate.length; i++) {
          //遍历 保存
          rate_value.push((rate_value[i] / duration) * loadSeconds); //获取各个30 毫秒该加载的数值
          rate[i].innerText = parseInt(rate_value[i]); //刚刚进入的时候格式化数据
        }
        return rate_value;
      }
      rate_value = init_rate(rate, rate_value);
      for (let i = 0; i < rate.length; i++) {
        //遍历所有 数据
        let zhi = 0; //每30毫秒添加的数据默认为0
        let showsum = setInterval(function () {
          zhi += rate_value[i]; //每30 毫秒递加
          rate[i].innerText = parseFloat(zhi).toFixed(2) + "%"; // dom 上展示的 是每次30毫秒加载的数据
        }, 30);
        setTimeout(function () {
          //到1秒被停止
          window.clearInterval(showsum);
          rate[i].innerText = parseFloat(rate_value[i]) + "%"; // 停止后保存的是最终值
        }, 1000);
      }
    },
  },
};
</script>

<style>
@font-face {
  font-family: myfont;
  src: url("../assets/head_font.otf");
}

* {
  font-family: myfont;
}

.header {
  position: absolute;
  display: block;
  z-index: 2;
  width: 100%;
  height: 9%;
  font-size: 0.7em;
  background-color: rgba(1, 6, 17, 0.6);
  box-sizing: border-box;
  top: 0;
  left: 0;
  color: #fff;
}

.main_right {
  z-index: 2;
  position: absolute;
  width: 20%;
  top: 9%;
  right: 0;
  background-color: rgba(1, 6, 17, 0.6);
  height: 81%;
}

p {
  font-size: 0.7em;
}

h4,
h5,
h6 {
  color: #fff;
  margin-bottom: 2px;
  margin-top: 10px;
}

.div_border {
  margin-bottom: 2%;
  padding-right: 5%;
  float: left;
  height: 45px;
}

.time {
  color: #e2e2e2;
  font-size: 0.7em;
}

.title_border {
  border-left: 4px solid #3a8ee6;
  padding-left: 5px;
}

.virus_station {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
}

.virus_station > div {
  width: 60px;
  color: #fff;
  margin-left: 20px;
}

.map {
  overflow: hidden;
  background-color: #333333;
  cursor: hand;
  max-width: none;
}

.search_box {
  background-color: #fff;
  position: absolute;
  left: 2%;
  top: 10%;
  z-index: 1;
  transition: left 0.5s;
  margin: 1% 1%;
  height: 1.5em;
  width: 20%;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 -1px 0px rgb(0 0 0 / 2%);
  border-radius: 0.2em;
  overflow: hidden;
}

.search_boxbar {
  padding-left: 0.8em;
}

#search_bar {
  border: none;
  width: 80%;
  height: 1.5em;
  line-height: 1em;
  font-size: 0.6em;
  transform: translateY(-0.2em);
}

#search_bar:focus {
  outline: none;
}

#search_button {
  border: none;
  float: right;
  font-size: 0.9em;
  height: 100%;
  overflow: hidden;
}

.BMap_cpyCtrl {
  display: none;
}

.anchorBL {
  display: none;
}

#new_case {
  transform: translateX(-28px) translateY(-30px);
}

.content_bg {
  background-image: linear-gradient(#10aeb5, #06beb6);
  height: 100%;
  padding-top: 40px;
}

.content_part {
  margin-right: 40px;
  margin-left: 40px;
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
}

.Epidemic_info {
  display: flex;
}

h2,
h3 {
  margin: 0;
}

.deadline {
  font-size: 0.7em;
  color: #999999;
}

.data_section > p {
  margin: 10px 0;
}

.data_section {
  margin-left: 50px;
  width: 150px;
}

.data_name {
  font-weight: bold;
  font-size: 0.8em;
}

.data_value {
  font-family: PingFangSC-Medium;
  font-size: 0.8em;
  font-weight: 700;
}

.data_change {
  font-size: 16px;
}

.el-table th {
  background-image: linear-gradient(#6dd5ed, #61b3c7) !important;
  color: #fff !important;
  border-radius: 2px !important;
  border-right: 1px solid !important;
}

.el-carousel__container {
  margin: 20px !important;
  border: 1px solid #d1d1d1 !important;
  border-radius: 7px !important;
  height: 450px !important;
}

.el-carousel__indicators--outside {
  display: none !important;
}

.tab_charts {
  display: flex;
  justify-content: center;
}

#date_pic {
  position: absolute;
  top: 10%;
  right: 19%;
  font-size: 0.8em !important;
}

.el-input__inner {
  width: 170px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 -1px 0px rgb(0 0 0 / 2%);
}

.epidemic_name {
  width: 250px;
  height: 80px;
  font-size: 0.9em;
  font-weight: bold;
}

/* 按钮聚焦状态 */
.active_focus {
  color: #ed5a65;
  border: 1px solid #ed5a65;
  background-color: #fd687517;
}

.el-button:active {
  color: #ed5a65;
  border: 1px solid #ed5a65;
}

.el-button:focus {
  color: #ed5a65;
  border: 1px solid #ed5a65;
  background-color: #fd687517;
}

.el-button:hover {
  color: #ed5a65;
  border: 1px solid #ed5a65;
  background-color: #fd687517;
}

#Cumulative_line {
  height: 470px;
  width: 1080px;
}

#rate_line {
  height: 470px;
  width: 1080px;
}

.el-divider--horizontal {
  margin: 10px 0 !important;
}

.infoWindow > span {
  font-weight: bold;
}

.info_list {
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 0;
}

.info_list li {
  list-style: none;
  padding-bottom: 5px;
}

.info_list li span:first-child {
  margin-right: 70px;
}

#view_details {
  cursor: pointer;
  float: right;
  margin-right: 10px;
  font-weight: bold;
  color: #2070e8;
}

.mapSort_btn {
  background-color: rgb(85 150 197 / 55%) !important;
  border: 1px solid #7b9bde;
  color: #fff;
  font-size: 0.8em;
}

.mapSort_btn:hover {
  border-color: #7cccde;
  color: #fff;
  background-color: rgb(137 187 224 / 55%) !important;
}

.mapSort_btn:focus {
  border-color: #7cccde;
  color: #fff;
  background-color: rgb(116 229 245 / 53%) !important;
}

#legend {
  width: 8.5%;
  height: 22%;
  background-color: #fff;
  position: absolute;
  z-index: 20;
  left: 3%;
  top: 70%;
  padding: 0.7em;
  font-size: 0.5em;
}

#legend {
  border-radius: 0.5em;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 -1px 0px rgb(0 0 0 / 2%);
}

#legend li {
  list-style: none;
  margin-bottom: 0.5em;
}

#legend ul {
  padding: 0;
  margin-top: 5px;
}

#legend img {
  margin-right: 8px;
  width: 1.3em;
  height: 1.3em;
}

#legend span {
  line-height: 18px;
}

.info_list li:nth-child(odd) {
  background-color: #efefef;
}

.infoWindow {
  font-size: .7em;
}
</style>
