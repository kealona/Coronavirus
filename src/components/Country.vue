<template>
  <div>
    <div class="header">
      <el-row>
        <el-col :soan="3" :offset="1">
          {{state_data.stateName}}州地区疫情
        </el-col>
      </el-row>
    </div>
    <div class="main">
      <div class="content_bg">
        <h1 class="c1"></h1>
        <h1 class="c1"></h1>
        <div class="content_part">
          <h3>疫情概况</h3>
          <span class="deadline">数据更新至{{time}}</span>
          <div class="Epidemic_info">
            <!-- <div class="data_section">
              <p class="data_name">现有确诊</p>
              <p class="data_value" style="color: #ff6a57;">6669775</p>
              <p class="data_change">昨日+2</p>
            </div> -->
            <!-- <div class="data_section">
              <p class="data_name">累计治愈</p>
              <p class="data_value" style="color: #e86d48;">2610541</p>
              <p class="data_change">昨日+2</p>
            </div> -->
            <div class="data_section">
              <p class="data_name">累计死亡</p>
              <p class="data_value" style="color: #e83132;">{{death}}</p>
            </div>
            <div class="data_section">
              <p class="data_name">累计确诊</p>
              <p class="data_value" style="color: #ec9217;">{{cases}}</p>
            </div>
            <!-- <div class="data_section">
              <p class="data_name">治愈率</p>
              <p class="data_value" style="color: #13CE66;">78.9</p>
            </div>
            <div class="data_section">
              <p class="data_name">病死率</p>
              <p class="data_value" style="color: #4d5054;">1.8%</p>
            </div> -->
          </div>
          <h3 style="margin-top: 40px;">各地区疫情</h3>
          <el-date-picker @change="sel_date($event)" v-model="time" type="date" placeholder="选择日期" size="large"
            value-format="yyyy-MM-dd" style="float: right;margin-bottom: 10px;" :picker-options="pickerOptions">
          </el-date-picker>
          <div style="font-weight: bold;">
            <el-table :data="dataInfo" :style="'width: 100%;font-size: ' + fontSize(0.2) + 'px'" :default-sort="{prop: 'allNum', order: 'descending'}">
              <el-table-column prop="idx_county" label="地名" width="250px"></el-table-column>
              <el-table-column prop="idx_total_deaths" label="总死亡人数" sortable></el-table-column>
              <el-table-column prop="idx_total_cases" label="总感染人数" sortable></el-table-column>
              <el-table-column prop="today_cases" label="今日感染" sortable></el-table-column>
            </el-table>
          </div>
          <h3 style="margin-top: 40px;">疫情数据</h3>
          <span class="deadline">数据更新至{{time}}</span>
          <div>
            <el-carousel indicator-position="outside" ref="line_charts" :autoplay="false" @change="change_page">
              <el-carousel-item>
                <el-date-picker v-model="date1" type="month" placeholder="选择月" class="datePic"
                  @change="pic_date($event)" value-format="yyyy-MM"
                  :picker-options="pickerMonth">
                </el-date-picker>
                <div id="confirm_line">
                  <span>确诊人数折线图</span>
                </div>
              </el-carousel-item>
              <el-carousel-item>
                <el-date-picker v-model="date1" type="month" placeholder="选择月" class="datePic"
                  @change="pic_date($event)" value-format="yyyy-MM"
                  :picker-options="pickerMonth">
                </el-date-picker>
                <div id="deadNumbers_line">
                  <span>死亡人数折线图</span>
                </div>
              </el-carousel-item>
              <el-carousel-item>
                <el-date-picker v-model="date1" type="month" placeholder="选择月" class="datePic"
                  @change="pic_date($event)" value-format="yyyy-MM"
                  :picker-options="pickerMonth">
                </el-date-picker>
                <div id="rate_line">
                  <span>病死率/治愈率折线图</span>
                </div>
              </el-carousel-item>
            </el-carousel>
            <div class="tab_charts">
              <el-button class="epidemic_name" @click="change_chart(3)">确诊人数</el-button>
              <el-button class="epidemic_name" @click="change_chart(1)">死亡人数</el-button>
              <el-button class="epidemic_name" @click="change_chart(2)">各地区确诊/死亡</el-button>
            </div>
          </div>
        </div>
        <div style="height: 60px;">
      </div>
      </div>

    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import $ from 'jquery'
  import axios from 'axios'

  import digital from '../assets/js/digital_change.min.js'

  export default {
    name: 'countryMap',
    data() {
      return {
        state_data: {},
        time: '2020-04-22',
        date1: '2020-04',
        dataInfo: [],
        death: 0,
        cases: 0,
        pickerOptions: {
          disabledDate(time) {
            if(time.getTime() <  new Date("2020-01-20").getTime()||time.getTime() > new Date('2020-04-25').getTime()) {
              return true
            }
            else {
              return false
            }
          }
        },
        pickerMonth: {
          disabledDate(time) {
            if(time.getTime() <  new Date("2020-03").getTime()||time.getTime() > new Date('2020-05').getTime()) {
              return true
            }
            else {
              return false
            }
          }
        }
      }
    },
    mounted() {
      $('#confirm_line').css('width', window.innerWidth * 0.9 + 'px')
      $('#deadNumbers_line').css('width', window.innerWidth * 0.9 + 'px')
      $('#rate_line').css('width', window.innerWidth * 0.9 + 'px')
      this.$set(this.state_data, 'stateName', this.$route.query.state)
      $(".epidemic_name:eq(0)").addClass('active_focus')
      //初始化确诊人数折线图
      this.init_confirm(this.date1)
      //初始化死亡人数折线图
      this.init_dead(this.date1)
      //初始化病死率/治愈率折线图
      this.init_rate(this.date1)
      //初始化数字
      //this.init_numbers()
      //初始化表格数据
      this.init_table(this.time)
      this.sel_date(this.time)
    },
    methods: {
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
      async sel_date(val) {
        this.init_table(val)
        let data = await this.getStateAll(this.state_data.stateName)
        this.death = data.idx_total_death_cases
        this.cases = data.idx_total_cases
      },
      getStateAll(name) {
        return new Promise((resolve, reject) => {
          axios({
              url: 'http://123.57.149.69:8080/checkState/countDiagnosisAndDeath',
              method: 'post',
              data: {
                date: this.time,
                state: name
              }
            })
            .then((res) => {
              console.log(res)
              resolve(res.data)
            })
            .catch((err) => {
              reject(err)
            })
        })

      },
      get_allTable(date) {
        return new Promise((resolve, reject) => {
          axios({
              url: 'http://123.57.149.69:8080/prediction/countyData',
              method: 'post',
              data: {
                date: date,
                state: this.state_data.stateName
              }
            })
            .then((res) => {
              resolve(res.data)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      async init_table(date) {
        let data = await this.get_allTable(date)
        this.dataInfo = data
      },
      /**
       * 初始化数字
       */
      init_numbers() {
        var num = $('.data_value:lt(4)')
        var values = [6669775, 2610541, 594006, 33369192]
        _wu.seconds_Loading_Thousand_Points(num, values);
        var rate = $('.data_value:gt(3)')
        var rate_value = [79.8, 1.8]
        // _wu.seconds_loading(rate, rate_value)
        function init_rate(rate, rate_value) {
          let totalSeconds = 1000
          let seconds = 30
          let duration = totalSeconds / 10; //总时长
          let loadSeconds = seconds / 10; //秒数
          for (let i = 0; i < rate.length; i++) { //遍历 保存
            rate_value.push(rate_value[i] / duration * loadSeconds); //获取各个30 毫秒该加载的数值
            rate[i].innerText = parseInt(rate_value[i]) //刚刚进入的时候格式化数据
          }
          return rate_value
        }
        rate_value = init_rate(rate, rate_value)
        for (let i = 0; i < rate.length; i++) { //遍历所有 数据
          let zhi = 0; //每30毫秒添加的数据默认为0
          let showsum = setInterval(function() {
            zhi += rate_value[i]; //每30 毫秒递加
            rate[i].innerText = parseFloat(zhi).toFixed(2) + '%' // dom 上展示的 是每次30毫秒加载的数据
          }, 30);
          setTimeout(function() { //到1秒被停止
            window.clearInterval(showsum);
            rate[i].innerText = parseFloat(rate_value[i]) + '%' // 停止后保存的是最终值
          }, 1000);
        }
      },
      /**
       * 改变走马灯对应的按钮的样式
       * @param {Object} val 当前走马灯的索引
       */
      change_page(val) {
        $(".epidemic_name:eq(0)").removeClass('active_focus')
        $(".epidemic_name:eq(1)").removeClass('active_focus')
        $(".epidemic_name:eq(2)").removeClass('active_focus')

        if (val == 0)
          $(".epidemic_name:eq(0)").addClass('active_focus')
        else if (val == 1)
          $(".epidemic_name:eq(1)").addClass('active_focus')
        else if (val == 2)
          $(".epidemic_name:eq(2)").addClass('active_focus')
      },
      /**
       * 点击改变走马灯item
       * @param {Object} index 走马灯的位置
       */
      change_chart(index) {
        $(".epidemic_name:eq(0)").removeClass('active_focus')
        this.$refs.line_charts.setActiveItem(index)
      },
      pic_date(date) {
        //初始化确诊人数折线图
        this.init_confirm(date)
        //初始化死亡人数折线图
        this.init_dead(date)
        //初始化病死率/治愈率折线图
        this.init_rate(date)
      },
      /**
       * 根据月份和州名查累计确诊和累计死亡人数
       * @param {Object} date 月份
       */
      get_all(date) {
        return new Promise((resolve, reject) => {
          axios({
              url: 'http://123.57.149.69:8080/stateChatController/everyDayCount',
              method: 'post',
              data: {
                date: date,
                StateName: this.state_data.stateName
              }
            })
            .then((res) => {
              resolve(res.data)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      /**
       * 根据月份和州名查新增确诊和当前确诊
       * @param {Object} date 月份
       */
      get_confirm(date) {
        return new Promise((resolve, reject) => {
          axios({
              url: 'http://123.57.149.69:8080/stateChatController/everyDayNewAndCountDiagnosis',
              method: 'post',
              data: {
                date: date,
                StateName: this.state_data.stateName
              }
            })
            .then((res) => {
              resolve(res.data)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      /**
       * 根据月份和州名查死亡人数和新增死亡
       * @param {Object} date 月份
       */
      get_death(date) {
        return new Promise((resolve, reject) => {
          axios({
              url: 'http://123.57.149.69:8080/stateChatController/everyDayNewAndCountDeath',
              method: 'post',
              data: {
                date: date,
                StateName: this.state_data.stateName
              }
            })
            .then((res) => {
              resolve(res.data)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      /**
       * 初始化确诊人数折线图
       */
      async init_confirm(date) {
        let casesData = await this.get_confirm(date)

        var xData = function() {
          var data = [];
          for (let i = 1; i <= casesData.length; i++) {
            data.push(i + "日");
          }
          return data;
        }();

        let case_list = []
        let new_list = []
        for (let i = 0; i < casesData.length; i++) {
          case_list.push(casesData[i].idx_total_cases)
          new_list.push(casesData[i].newAdditions)
        }

        var confirm_line = echarts.init(document.getElementById("confirm_line"))

        var option = {
          backgroundColor: '#fff',

          tooltip: {
            trigger: "axis",
            axisPointer: {
              label: {
                show: true,
                backgroundColor: '#fff',
                color: '#556677',
                borderColor: 'rgba(0,0,0,0)',
                shadowColor: 'rgba(0,0,0,0)',
                shadowOffsetY: 0
              },
              lineStyle: {
                width: 0
              }
            },
            backgroundColor: '#fff',
            textStyle: {
              color: '#5c6c7c'
            },
            padding: [10, 10],
            extraCssText: 'box-shadow: 1px 1px 2px 1px rgba(163,163,163,0.5)'
          },
          grid: {
            borderWidth: 0,
            top: 110,
            bottom: 95,
            textStyle: {
              color: "#fff"
            }
          },
          legend: {
            x: '46%',
            top: '11%',
            textStyle: {
              color: '#90979c',
            },
            data: ['新增确诊', '当前确诊']
          },

          calculable: true,
          xAxis: [{
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#9daec8",
                width: 1.5
              }
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#556677'
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
              margin: 15
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            data: xData,
          }],

          yAxis: [{
            name: '当前确诊',
            type: "value",
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#9daec8",
                width: 1.5
              }
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#556677'
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
              margin: 15
            }
          }, {
            name: '新增确诊',
            type: 'value',
            position: 'right',
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#556677'
              },
              formatter: '{value}'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#DCE2E8'
              }
            },
            splitLine: {
              show: false
            }
          }],
          dataZoom: [{
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,

            "start": 0,
            "end": 100,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: "#009ee7",
            },
            textStyle: {
              color: "rgba(25, 98, 170, 0.5)",
            },
            fillerColor: "rgba(17, 161, 213, 0.4)",
            borderColor: "rgba(17, 161, 213, 0.3)",

          }, {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35
          }],
          series: [{
            name: "新增确诊",
            type: "line",
            symbolSize: 8,
            symbol: 'circle',
            itemStyle: {
              color: "#4fbdd3",
            },
            markPoint: {
              label: {
                normal: {
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              data: [{
                type: 'max',
                name: '最大值',

              }, {
                type: 'min',
                name: '最小值'
              }]
            },
            data: new_list,
            yAxisIndex: 0
          }, {
            name: "当前确诊",
            type: "line",
            symbolSize: 8,
            symbol: 'circle',
            itemStyle: {
              color: "#ee3f4d",
            },
            markPoint: {
              label: {
                normal: {
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              data: [{
                type: 'max',
                name: '最大值',

              }, {
                type: 'min',
                name: '最小值'
              }]
            },
            data: case_list,
            yAxisIndex: 1
          }, ]
        }
        confirm_line.setOption(option)
      },
      /**
       * 初始化死亡人数折线图
       */
      async init_dead(date) {

        let casesData = await this.get_death(date)

        var xData = function() {
          var data = [];
          for (let i = 1; i <= casesData.length; i++) {
            data.push(i + "日");
          }
          return data;
        }();

        let new_list = []
        let death_list = []
        for (let i = 0; i < casesData.length; i++) {
          new_list.push(casesData[i].newDeath)
          death_list.push(casesData[i].idx_total_death_cases)
        }

        var dead_line = echarts.init(document.getElementById("deadNumbers_line"))

        var option = {
          backgroundColor: '#fff',

          tooltip: {
            trigger: "axis",
            axisPointer: {
              label: {
                show: true,
                backgroundColor: '#fff',
                color: '#556677',
                borderColor: 'rgba(0,0,0,0)',
                shadowColor: 'rgba(0,0,0,0)',
                shadowOffsetY: 0
              },
              lineStyle: {
                width: 0
              }
            },
            backgroundColor: '#fff',
            textStyle: {
              color: '#5c6c7c'
            },
            padding: [10, 10],
            extraCssText: 'box-shadow: 1px 1px 2px 1px rgba(163,163,163,0.5)'
          },
          grid: {
            borderWidth: 0,
            top: 110,
            bottom: 95,
            textStyle: {
              color: "#fff"
            }
          },
          legend: {
            x: '46%',
            top: '11%',
            textStyle: {
              color: '#90979c',
            },
            data: ['死亡人数', '新增死亡']
          },

          calculable: true,
          xAxis: [{
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#9daec8",
                width: 1.5
              }
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#556677'
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
              margin: 15
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            data: xData,
          }],

          yAxis: [{
            name: '死亡人数',
            type: "value",
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#9daec8",
                width: 1.5
              }
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#556677'
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
              margin: 15
            }
          }, {
            name: '新增死亡',
            type: 'value',
            position: 'right',
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#556677'
              },
              formatter: '{value}'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#DCE2E8'
              }
            },
            splitLine: {
              show: false
            }
          }],
          dataZoom: [{
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,

            "start": 0,
            "end": 100,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: "#009ee7",
            },
            textStyle: {
              color: "rgba(25, 98, 170, 0.5)",
            },
            fillerColor: "rgba(17, 161, 213, 0.4)",
            borderColor: "rgba(17, 161, 213, 0.3)",

          }, {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35
          }],
          series: [{
            name: "死亡人数",
            type: "line",
            symbolSize: 8,
            symbol: 'circle',
            itemStyle: {
              color: "#4fbdd3",
            },
            markPoint: {
              label: {
                normal: {
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              data: [{
                type: 'max',
                name: '最大值',

              }, {
                type: 'min',
                name: '最小值'
              }]
            },
            data: death_list,
            yAxisIndex: 0
          }, {
            name: "新增死亡",
            type: "line",
            symbolSize: 8,
            symbol: 'circle',
            itemStyle: {
              color: "#ee3f4d",
            },
            markPoint: {
              label: {
                normal: {
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              data: [{
                type: 'max',
                name: '最大值',

              }, {
                type: 'min',
                name: '最小值'
              }]
            },
            data: new_list,
            yAxisIndex: 1
          }, ]
        }
        dead_line.setOption(option)

      },
      /**
       * 初始化病死率/治愈率折线图
       */
      async init_rate(date) {

        let casesData = await this.get_all(date)

        var xData = function() {
          var data = [];
          for (let i = 1; i <= casesData.length; i++) {
            data.push(i + "日");
          }
          return data;
        }();

        let case_list = []
        let daeth_list = []
        for (let i = 0; i < casesData.length; i++) {
          case_list.push(casesData[i].idx_total_cases)
          daeth_list.push(casesData[i].idx_total_death_cases)
        }

        var rate_line = echarts.init(document.getElementById("rate_line"))

        var option = {
          backgroundColor: '#fff',

          tooltip: {
            trigger: "axis",
            axisPointer: {
              label: {
                show: true,
                backgroundColor: '#fff',
                color: '#556677',
                borderColor: 'rgba(0,0,0,0)',
                shadowColor: 'rgba(0,0,0,0)',
                shadowOffsetY: 0
              },
              lineStyle: {
                width: 0
              }
            },
            backgroundColor: '#fff',
            textStyle: {
              color: '#5c6c7c'
            },
            padding: [10, 10],
            extraCssText: 'box-shadow: 1px 1px 2px 1px rgba(163,163,163,0.5)'
          },
          grid: {
            borderWidth: 0,
            top: 110,
            bottom: 95,
            textStyle: {
              color: "#fff"
            }
          },
          legend: {
            x: '46%',
            top: '11%',
            textStyle: {
              color: '#90979c',
            },
            data: ['累计确诊', '累计死亡']
          },

          calculable: true,
          xAxis: [{
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#9daec8",
                width: 1.5
              }
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#556677'
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
              margin: 15
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            data: xData,
          }],

          yAxis: [{
            name: '累计确诊',
            type: "value",
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#9daec8",
                width: 1.5
              }
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#556677'
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
              margin: 15
            }
          }, {
            name: '累计死亡',
            type: 'value',
            position: 'right',
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#556677'
              },
              formatter: '{value}'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#DCE2E8'
              }
            },
            splitLine: {
              show: false
            }
          }],
          dataZoom: [{
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,

            "start": 0,
            "end": 100,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: "#009ee7",
            },
            textStyle: {
              color: "rgba(25, 98, 170, 0.5)",
            },
            fillerColor: "rgba(17, 161, 213, 0.4)",
            borderColor: "rgba(17, 161, 213, 0.3)",

          }, {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35
          }],
          series: [{
            name: "累计确诊",
            type: "line",
            symbolSize: 8,
            symbol: 'circle',
            itemStyle: {
              color: "#4fbdd3",
            },
            markPoint: {
              label: {
                normal: {
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              data: [{
                type: 'max',
                name: '最大值',

              }, {
                type: 'min',
                name: '最小值'
              }]
            },
            data: case_list,
            yAxisIndex: 0
          }, {
            name: "累计死亡",
            type: "line",
            symbolSize: 8,
            symbol: 'circle',
            itemStyle: {
              color: "#ee3f4d",
            },
            markPoint: {
              label: {
                normal: {
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              data: [{
                type: 'max',
                name: '最大值',

              }, {
                type: 'min',
                name: '最小值'
              }]
            },
            data: daeth_list,
            yAxisIndex: 1
          }, ]
        }
        rate_line.setOption(option)

      }
    }
  }
</script>

<style>
  @font-face {
    font-family: myfont;
    src: url('../assets/head_font.otf');
  }

  * {
    font-family: myfont;
  }

  .header {
    display: block;
    z-index: 2;
    width: 100%;
    height: 9%;
    font-size: 17px;
    background-color: #16888c;
    box-sizing: border-box;
    color: #fff;
    line-height: 56.25px;
  }

  .map {
    height: 625px;
    width: 100%;
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

  h3 {
    margin: 0;
  }

  .deadline {
    font-size: 15px;
    color: #999999;
  }

  .data_section>p {
    margin: 10px 0;
  }

  .data_section {
    margin-left: 50px;
    width: 150px;
  }

  .data_name {
    font-weight: bold;
    font-size: 19px;
  }

  .data_value {
    font-family: PingFangSC-Medium;
    font-size: 20px;
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
    top: 90px;
    right: 265px;
  }

  .el-input__inner {
    width: 170px;
    box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 -1px 0px rgb(0 0 0 / 2%);
  }

  .epidemic_name {
    width: 250px;
    height: 80px;
    font-size: 23px;
    font-weight: bold;
  }

  #confirm_line {
    height: 470px;
    width: 1200px;
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

  #deadNumbers_line {
    height: 470px;
    width: 1200px;
  }

  #rate_line {
    height: 470px;
    width: 1200px;
  }

  .datePic {
    position: absolute;
    top: 30px;
    left: 100px;
    z-index: 10
  }
</style>
