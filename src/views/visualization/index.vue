<!-- <template>
    <div>
      <D3 />
    </div>
  </template>
  
  <script >
  import D3 from '../../components/D3.vue'
  
  export default {
    name: '',
    components: {
      D3
    }
  }
  </script> -->
  <template>
    <el-row style="margin-top: 20px;">
      <el-col :span="12"> <div id="zheEcharts"></div></el-col>
      <el-col :span="12">
        <div style="float: left; font-size: large;font-weight: 800;">新任务列表</div>
        <el-table :data="tableData" border style="width: 100%" :height="200">
          <el-table-column prop="id" label="id" width="100" :show-overflow-tooltip="true"/>
          <el-table-column prop="bookName" label="书籍名称" width="180" :show-overflow-tooltip="true"/>
          <el-table-column prop="directoryName" label="章节名称" width="180" :show-overflow-tooltip="true"/>
          <el-table-column prop="userName" label="用户名" width="120" />
          <el-table-column prop="taskCreateTime" label="创建时间" width="180" :show-overflow-tooltip="true"/>
          <el-table-column prop="taskLoadTime" label="截止时间" width="180" :show-overflow-tooltip="true"/>
          <el-table-column prop="staticZ" fixed="right" label="状态">
            <template #default="scope">
              <span v-if="scope.row.staticZ === 1">未完成</span>
              <span v-if="scope.row.staticZ === 2">已完成</span>
              <span v-if="scope.row.staticZ === 3">超时</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px;">
      <el-col :span="12"> <div id="zhuEcharts"></div></el-col>
      <el-col :span="12"><div id="zhu1Echarts"></div></el-col>
    </el-row>
  </template>
  
  <script lang="ts" setup>
import { inject, onMounted, ref } from "vue";
import { getHistogramAPI, getLineChartAPI, getNewTaskListAPI, getPieChartAPI } from "../../api/visualization";
import * as echarts from 'echarts';
//表格数据
const tableData = ref([])
//近一年内完成任务与违反成任务量
const getNewTaskList = async() =>{
    try{
      tableData.value = [];
        const res = await getNewTaskListAPI()
        if(res.data.code === 200){
          tableData.value = res.data.data
        }else{}
    }catch(e){}
    await initChart()
}
//数据
const zheXdata = ref<string[]>([])
const zheYdata = ref<string[]>([])
//近一年标记数量折线图 
const getLineChart = async() =>{
    try{
      zheYdata.value = [];
      zheXdata.value = []
        const res = await getLineChartAPI()
        if(res.data.code === 200){
          zheXdata.value = res.data.data.dateNames
          zheYdata.value = res.data.data.dateValues
        }else{
            
        }
    }catch(e){}
    await initChart()
}

  //数据
const zhuXdata = ref<string[]>([])
const zhuYdata = ref<string[]>([])
//近一年的任务完成量柱状图
const getHistogram = async() =>{
    try{
      zhuXdata.value = [];
      zhuYdata.value = []
        const res = await getHistogramAPI()
        if(res.data.code === 200){
          zhuXdata.value = res.data.data.dateNames
          zhuYdata.value = res.data.data.dateValues
        }else{
            
        }
    }catch(e){}
    await initChart()
}
//数据
const pie1data = ref()
const pie2data = ref()
//近一年内完成任务与违反成任务量
const getPieChart = async() =>{
    try{
      pie1data.value = '';
      pie2data.value = '';
        const res = await getPieChartAPI()
        if(res.data.code === 200){
          pie1data.value = res.data.data[0]
          pie2data.value = res.data.data[1]
        }else{
            
        }
    }catch(e){}
    await initChart()
}
const initChart = () =>{
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('zheEcharts'), null, {
    width: 600,
    height: 250
  });
  // 绘制图表
  myChart.setOption({
    title: {
      text: '近一年标记数量折线图'
    },
    tooltip: {},
    xAxis: {
      data: zheXdata.value
    },
    yAxis: {},
    series: [
      {
        name: '数量',
        data: zheYdata.value,
        type: 'line'
      }
    ]
  });
  var myChart = echarts.init(document.getElementById('zhuEcharts'), null, {
    width: 600,
    height: 250
  });
  // 绘制图表
  myChart.setOption({
    title: {
      text: '近一年的任务完成量柱状图'
    },
    tooltip: {},
    xAxis: {
      data: zhuXdata.value
    },
    yAxis: {},
    series: [
      {
        name: '完成量',
        type: 'bar',
        data: zhuYdata.value
      }
    ]
  });
  var myChart = echarts.init(document.getElementById('zhu1Echarts'), null, {
    width: 600,
    height: 250
  });
  // 绘制图表
  myChart.setOption({
    title: {
      text: '近一年内完成任务与违反成任务量'
    },
    tooltip: {},
    series: [
      {
      type: 'pie',
      data: [
        {
          value: pie1data.value.value,
          name: pie1data.value.name
        },
        {
          value: pie2data.value.value,
          name: pie2data.value.name
        },
      ]
      }
    ]
  });
}


    onMounted(()=>{
      getLineChart()
      getHistogram()
      getPieChart()
      getNewTaskList()
    })
  </script>
  
  <style lang="scss" scoped>
  
  </style>