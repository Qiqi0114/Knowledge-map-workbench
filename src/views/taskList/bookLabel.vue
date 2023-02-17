<template>
    <el-row>
      <!-- 左侧书籍文章区域 -->
        <el-col :span="12"  @mouseleave="mouseOut()">
            <!-- 章节目录按钮 -->
            <div class="grid-content">
                <el-icon v-if="drawer" :size="30" style="float: left;padding: 15px;" @click="drawer = true"><Expand /></el-icon>
                <el-icon v-if="!drawer" :size="30" style="float: left;padding: 15px;" @click="drawer = true"><Fold /></el-icon>
                <div>{{ baseInfoDirectoryName }}</div>
            </div>
            <!-- 滚动条加载文章 -->
            <el-scrollbar :height="scrollbarHeight" style="margin-top: 30px;">
                <div
                 v-loading="bookLoading"
                 element-loading-text="七七拼命加载"
                :element-loading-spinner="svgLoad"
                element-loading-svg-view-box="-10, -10, 50, 50"
                element-loading-background="rgba(122, 122, 122, 0.8)"
                ><div id="directoryText" @mouseup="mouseSelected()"></div></div>
            </el-scrollbar>
        </el-col>
      <!-- 右侧词条、图谱区域 -->
        <el-col :span="12">
          <!-- 查询 添加词条标注 -->
            <el-row>
                  <el-col>
                      <el-form ref="searchFormRef" :model="searchForm" :inline="true" style="width:100%">
                          <el-row>
                              <el-col :span="8">
                                  <el-form-item label="词条名称" prop="entryName">
                                      <el-input v-model.entryName="searchForm.entryName"
                                        @input="getDirectoryList()" placeholder="请输入名称" clearable/>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                  <el-button @click="addEntry()" type="success">词条标注</el-button>
                              </el-col>
                          </el-row>
                      </el-form>
                  </el-col>
            </el-row>
            <!-- 词条列表分页 -->
            <el-row>
              <!-- 表格部分 -->
              <div ref="tableContainer" style="width: 100%;margin-top: 5px;">
                  <el-table :data="baseInfoTableData" border
                      ref="baseInfoTableDataRef" v-loading="loading" :header-cell-style="{ background: '#F5F6FA' }"
                      :height="200" @mouseover="mouseOverTable()">
                      <el-table-column fixed="left" label="操作" min-width="80">
                          <template #default="scope">
                              <el-button type="danger" link @click="">删除</el-button>
                          </template>
                      </el-table-column>
                      <el-table-column prop="id" label="词条id" min-width="130" :show-overflow-tooltip="true"/>
                      <el-table-column prop="entryName" label="词条名称" min-width="100" />
                      <el-table-column prop="entryText" label="词条解释" min-width="100" />
                      <el-table-column prop="userName" label="标注用户" min-width="120" />
                      <el-table-column prop="entryTime" label="标注时间" min-width="200" :show-overflow-tooltip="true"/>
                      <el-table-column prop="bookName" label="书籍名称" min-width="300" :show-overflow-tooltip="true"/>
                      <el-table-column prop="parentName" label="父名称" min-width="100" />
                      <el-table-column prop="relationshipName" label="关系名称" min-width="100" />
                  </el-table>
              </div>
              <!--分页器 start-->
              <div>
                  <el-pagination v-model:currentPage="pCurrentPage" v-model:page-size="pPageSize"
                      :page-sizes="[10, 20]" :small="pSmall" :disabled="pDisabled" :background="pBackground"
                      layout="total, sizes, prev, pager, next, jumper" :total="pTotal" @size-change="handleSizeChange"
                      @current-change="handleCurrentChange" />
              </div>
              <!--分页器 end-->
            </el-row>
            <!-- 图谱 -->
            <el-row>
              <div id="force-container"></div>
            </el-row>
        </el-col>
    </el-row>
    <!-- 章节目录抽屉 -->
    <el-drawer v-model="drawer" direction="ltr" :with-header="false">
    <template #default>
        <el-radio-group v-model="radio1" class="ml-4">
            <el-row>
                <el-col v-for="(o, index) in baseInfoDirectoryData " :key="o">
                    <el-radio :label="o" size="large">{{ o.directoryName }}</el-radio>
                </el-col>
            </el-row>
        </el-radio-group>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">确认</el-button>
      </div>
    </template>
    </el-drawer>
          <!--添加词条标注对话框-->
          <el-dialog title="添加词条标注" v-model="dialogAddFormVisible">
                <el-form :model="addForm">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="词条名称">
                        <el-input v-model="addForm.entryName"  style="width:250px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="词条解释">
                        <el-input v-model="addForm.entryText" :disabled ="entryTextFlag" style="width:250px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="书籍id">
                        <el-input v-model="addForm.bookId" :disabled="true" style="width:250px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="父id">
                            <el-input v-model="addForm.parentId" :disabled="true" style="width:250px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="关系" prop="relationshipId">
                        <el-select v-model="addForm.relationshipId"
                                  filterable  placeholder="请选择关系" style="width:90%" clearable>
                                <el-option v-for="item in RelationshipList.RelationshipListCode" :key="item.value" :label="item.label"
                                    :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                    <el-button @click="addEntryCancel()">取 消</el-button>
                    <el-button type="primary" @click="addEntryConfirm()"
                        >确 定</el-button
                    >
                    </span>
                </template>
            </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { onMounted, reactive, ref } from "vue-demi";
import { Expand,Fold } from '@element-plus/icons-vue'
import * as d3 from 'd3'
import { getDirectoryListAPI, getDirectoryListByBookIdAPI, getRelationshipAPI, getTaskChapterAPI, saveEntryMapperAPI } from "../../api/bookLabel";
import router from "../../router";
var color=d3.schemeCategory10;
var nodes = [
				{"name":"爱情公寓"},
				{"name":"曾小贤"},
				{"name":"胡一菲"},
				{"name":"吕子乔"},
				{"name":"陈美嘉"},
				{"name":"关谷神奇"},
				{"name":"唐悠悠"},
				{"name":"陆展博"},
				{"name":"林宛瑜"},
				{"name":"张伟"},
				{"name":"诸葛大力"},
				{"name":"秦羽墨"},
				{"name":"诺澜"},
				{"name":"Lisa榕"},
				{"name":"杜俊"},
				{"name":"赵海棠"},
				{"name":"咖喱酱"}
			];
var links = [
				{"source":1,"target":0,"relation":"租户"},
				{"source":2,"target":0,"relation":"租户"},
				{"source":3,"target":0,"relation":"租户"},
				{"source":4,"target":0,"relation":"租户"},
				{"source":5,"target":0,"relation":"租户"},
				{"source":6,"target":0,"relation":"租户"},
				{"source":7,"target":0,"relation":"租户"},
				{"source":8,"target":0,"relation":"租户"},
				{"source":9,"target":0,"relation":"租户"},
				{"source":10,"target":0,"relation":"租户"},
				{"source":11,"target":0,"relation":"租户"},
				{"source":15,"target":0,"relation":"租户"},
				{"source":16,"target":0,"relation":"租户"},
				{"source":1,"target":2,"relation":"夫妻"},
				{"source":1,"target":13,"relation":"上下级"},
				{"source":1,"target":12,"relation":"同事&喜欢"},
				{"source":2,"target":7,"relation":"姐弟"},
				{"source":2,"target":11,"relation":"同学"},
				{"source":2,"target":12,"relation":"情敌"},
				{"source":3,"target":4,"relation":"夫妻"},
				{"source":3,"target":6,"relation":"小姨妈/大外甥"},
				{"source":3,"target":13,"relation":"暗恋"},
				{"source":4,"target":6,"relation":"闺蜜"},
				{"source":5,"target":6,"relation":"夫妻"},
				{"source":5,"target":14,"relation":"师兄弟"},
				{"source":7,"target":8,"relation":"情侣"},
				{"source":9,"target":10,"relation":"情侣"},
				{"source":9,"target":15,"relation":"情敌"},
				{"source":9,"target":16,"relation":"助理"},
				{"source":10,"target":15,"relation":"同学"},
				{"source":10,"target":2,"relation":"师生"},
				{"source":15,"target":10,"relation":"追求"},
				{"source":15,"target":2,"relation":"师生"},
				{"source":13,"target":12,"relation":"同学"}
			];

onMounted(async() => {
 await drawBarChart(nodes,links);
})


//
const visibleFlag = ref<boolean>(false);
const drawBarChart = async(nodes: { name: string; }[],links: { source: number; target: number; relation: string; }[]) => {
            var w=window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
			var h=window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
			w=w*0.48;
			h=h*0.4;
            // 容器
            var svg=d3.select("#force-container")
                        .append("svg")
                        .attr("width",w)
                        .attr("height",h*1.2);
            // 新建一个力导向图
            var forceSimulation = d3.forceSimulation()
                                    .force("link",d3.forceLink())
                                    .force("charge",d3.forceManyBody().strength(-800))
                                    .force("center",d3.forceCenter(w/2,h/2));
            forceSimulation.nodes(nodes)
                           .on("tick");
            forceSimulation.force("link")
                           .links(links)
                           .distance(180);
            // 关系路径
            var link=svg.selectAll(".link")
                        .data(links)
                        .enter()
                        .append("line")
                        .attr("class","link")
                        .style("stroke-width",1)
                        .style("stroke",(d: any,i: number)=>color[i%10])
					    .style("opacity",0.6);
            // 节点
            var node=svg.selectAll(".node")
                        .data(nodes)
                        .enter()
                        .append("circle")
                        .attr("r",16)
                        .style("fill",(d: any,i: number)=>color[i%10])
                        .call(drag()); 
                node.on('click', (d: any)=> {
              visibleFlag.value = !visibleFlag.value
              toggleMenu(d3.select(".node"), d, visibleFlag.value)
            })
            forceSimulation.on("tick",()=>{
                link.attr("x1",(d: { source: { x: any; }; })=>d.source.x)
                    .attr("y1",(d: { source: { y: any; }; })=>d.source.y)
                    .attr("x2",(d: { target: { x: any; }; })=>d.target.x)
                    .attr("y2",(d: { target: { y: any; }; })=>d.target.y);
                node.attr("cx",(d: { x: any; })=>d.x)
                    .attr("cy",(d: { y: any; })=>d.y);
                edges_text.attr("x",(d: { source: { x: any; }; target: { x: any; }; })=>(d.source.x + d.target.x) / 2 )
                          .attr("y",(d: { source: { y: any; }; target: { y: any; }; })=>(d.source.y + d.target.y) / 2 );
                                texts.attr("x",(d: { x: any; })=>d.x)
                          .attr("y",(d: { y: any; })=>d.y);
            });
            //拖拽
            function drag()
            {
                function dragstarted(event: { active: any; },d: { fx: any; x: any; fy: any; y: any; }){
                    if(!event.active)   forceSimulation.alphaTarget(0.3).restart();
                    d.fx=d.x;
                    d.fy=d.y;
                }
                function dragged(event: { x: any; y: any; },d: { fx: any; fy: any; }){
                    d.fx=event.x;
                    d.fy=event.y;
                }
                function dragended(event: { active: any; },d: { fx: null; fy: null; }){
                    if(!event.active)   forceSimulation.alphaTarget(0);
                    d.fx=null;
                    d.fy=null;
                }
                return d3.drag()
                         .on("start",dragstarted)
                         .on("drag",dragged)
                         .on("end",dragended);
            };
            var edges_text = svg.selectAll(".linetext")
							.data(links)
							.enter()
							.append("text")
							.attr("class","linetext")
							.text(d=> d.relation)
							.style("stroke",(d: any,i: number)=>color[i%10])
							.style("font-size",10);	                
            var texts=svg.selectAll(".forceText")
                        .data(nodes)
                        .enter()
                        .append("text")
                        .attr("class","forceText")
                        .style("stroke",(d: any,i: number)=>color[i%10])
                        .style("font-size","12px")
                        .attr("text-anchor","middle")
                        .attr("dy",30)
                        .text((d: { name: any; })=>d.name);

                        /**
       * @name: 生成操作菜单
       * @param {*} current 当前元素
       * @param {*} d 当前元素对应的数据
       * @param {*} flag 显隐
       */
const toggleMenu = (current: { append: (arg0: string) => { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; attr: { (arg0: string, arg1: number): { (): any; new(): any; attr: { (arg0: string, arg1: number): any; new(): any; }; }; new(): any; }; }; new(): any; }; }; select: (arg0: string) => { (): any; new(): any; append: { (arg0: string): { (): any; new(): any; classed: { (arg0: string, arg1: boolean): any; new(): any; }; }; new(): any; }; }; }, d: any, flag: boolean) => {
        const currentD = d
        console.log(currentD);
        
        const data = [{
          population: 30,
          value: '删除',
          type: 'delete'
        }, {
          population: 30,
          value: '修改',
          type: 'showOn'
        }]
        // 创建一个环生成器
        const arc = d3.arc()
          .innerRadius(80) // 内半径
          .outerRadius(35) // 外半径
        const pie = d3.pie()
          .value(function (d: { population: any; }) {
            return d.population
          })
          .sort(null)
        const pieData = pie(data)
        const pieAngle = pieData.map(function (p: { startAngle: any; endAngle: any; }) {
          return (p.startAngle + p.endAngle) / 2 / Math.PI * 180
        })
        // 菜单容器
        const g = current
          .append('circle')
          .attr('class', 'menu-circle')
          .attr('width', 100)
          .attr('height', 100)
        const Pie = g.append('circle')
        Pie.selectAll('line')
          .data(pie(data))
          .enter()
          .append('line')
          .attr('d', arc)
          .attr('fill', '#d3d7dc')
          .style('stroke', '#fff')
          .style('cursor', 'pointer')
          .on('click', function (d) {
            if (d.data.type === 'delete') {
              deleteNodeAndLinks(currentD)
            } else if (d.data.type === 'showOn') {
              deleteNextNodes(currentD)
            } else {
              addNodesAndLinks(currentD)
            }
            d3.event.stopPropagation()
          })

      }
}

//文章加载
const bookLoading = ref<boolean>(false)
//自定义加载图标
const svgLoad =ref(`
    <path class="path" d="
      M 30 15
      L 28 17
      M 25.61 25.61
      A 15 15, 0, 0, 1, 15 30
      A 15 15, 0, 1, 1, 27.99 7.5
      L 15 15
    " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
  `) 
//章节赋值
const baseInfoDirectoryData = ref([]);
//书籍赋值
const baseInfoBoolData = ref([]);
//抽屉开关
const drawer = ref<boolean>(false)
//勾选章节
const radio1 = ref<string>('')
//书籍滚动高度
const scrollbarHeight = ref('550px')
const cancelClick = () => {
  drawer.value = false
}
//确认选择章节
const confirmClick= () => {
  ElMessageBox.confirm(`选择 ${radio1.value.directoryName} 章?`)
    .then(() => {
      drawer.value = false;
      getTaskChapter(radio1.value.id)
    })
    .catch(() => {
      // catch error
    })
}
//加载
const loading = ref<boolean>(false)
//table赋值
const baseInfoTableData = ref([]);
// 总数
const pTotal = ref(0);
// 第几页
const pCurrentPage = ref<number>(1);
// 每页多少条
const pPageSize = ref<number>(10);
const pSmall = ref(false);
const pDisabled = ref(false);
const pBackground = ref(false);
const handleSizeChange = (val: number) => {
pPageSize.value = val;
getDirectoryList();
};
const handleCurrentChange = (val: number) => {
pCurrentPage.value = val;
getDirectoryList();
};
const searchFormRef = ref<FormInstance>()
//查询参数
const searchForm = reactive({
  entryName:"",
})

//词条分页查询接口 查询接口
const getDirectoryList = async() =>{
  loading.value = true;
    try{
        const res = await getDirectoryListAPI({
          bookId:RESROUTER.id,
          entryName:searchForm.entryName,
          pageNum:pCurrentPage.value,
          pageSize:pPageSize.value,
        })
        baseInfoTableData.value = res.data.data.records;
    }catch(e){console.log('e',e);}
    loading.value = false;
}

//根据书籍id获取用户需要标注的章节目录
const getDirectoryListByBookId = async() =>{
    try{
        const res = await getDirectoryListByBookIdAPI({
            id:RESROUTER.id,
        })
        baseInfoDirectoryData.value = res.data.data;
    }catch(e){console.log('e',e);}
}

//根据目录id获取章节数据 可传背景颜色
const getTaskChapter = async(id:string) =>{
  bookLoading.value = true;
    try{
        const res = await getTaskChapterAPI({
            id:id,
            background:'',
        })
        baseInfoBoolData.value = res.data.data;  
        const directoryTextSpan = document.getElementById('directoryText')
        directoryTextSpan.innerHTML = res.data.data.chapterText;
    }catch(e){console.log('e',e);}
    bookLoading.value = false;
}

//选中拖拽
let selection =  ref<string>('');
//鼠标光标选中事件
const mouseSelected = () =>{
   //获取Selection对象
   selection.value = window.getSelection().toString();
}

//选中拖拽存储
const entryWords = ref<string>('');
//鼠标离开区域事件
const mouseOut = () =>{
  entryWords.value = selection.value;
  entryTextFlag.value = true;
  console.log(entryWords.value);
  
}
//词条解释禁用标记
const entryTextFlag = ref<boolean>(false);
//父id、关系id禁用标记
const nodeFlag = ref<boolean>(false);
//鼠标移入词条表格触发的事件
const mouseOverTable = () =>{
  if(entryWords.value !== '' ){
    addForm.entryName = entryWords.value;
    addForm.bookId = RESROUTER.id;
    dialogAddFormVisible.value = true;
  }
}
//鼠标移入词条表格阻止弹窗标记
const stopFlag = ref<boolean>(false);
//根据目录id获取章节数据 可传背景颜色
const getRelationship = async() =>{
    try{
        const res = await getRelationshipAPI()
        baseInfoBoolData.value = res.data.data;  
    }catch(e){console.log('e',e);}
}

 //添加词条标注对话框开关
 const dialogAddFormVisible = ref<boolean>(false);
  const addForm = reactive({
    entryName:'',
    entryText:'',
    bookId:'',
    parentId:'',
    relationshipId:'',
  });
  //添加词条标注
  const addEntry = async() => {
    //判断拖拽未添加清空之前数据
    if(entryWords.value !== ''){
      entryWords.value = '';
      addForm.entryName = '';
      addForm.entryText = '';
      addForm.parentId = '';
      addForm.relationshipId = '';
    }
    dialogAddFormVisible.value = true;
  }
  //确认词条标注
  const addEntryConfirm = async() => {
    await saveEntryMapper();
    dialogAddFormVisible.value = false;
    await getDirectoryList();
  }
//取消确认词条标注
const addEntryCancel = async() =>{
  dialogAddFormVisible.value = false;
  entryTextFlag.value = false;
  entryWords.value = '';
  addForm.entryName = '';
  addForm.entryText = '';
  addForm.parentId = '';
  addForm.relationshipId = '';
}
//关系选项
let RelationshipList = reactive({RelationshipListCode:[] as any})
//获取关系列表
const getRelationshipList = async() => {
    try{
        const res = await getRelationshipAPI()
        if(res.data.code == '200'){
            const codeValue = res.data.data;
            let RelationshipCode: { value: any; label: any }[] = [];
            codeValue.forEach((val:{id:string,relationshipName:string}) => {
              RelationshipCode.push({value:val.id,label:val.relationshipName})
            }) 
            RelationshipList.RelationshipListCode = RelationshipCode
        }else{
            ElMessage.error('获取失败')
        }
    }catch(e){
        console.log(e,'e');
    }
} 

//词条标注接口
const saveEntryMapper = async() =>{
    try{
        const res = await saveEntryMapperAPI({
            bookId:RESROUTER.id,
            entryName:addForm.entryName,
            entryText:addForm.entryText,
            parentId:addForm.parentId,
            relationshipId:addForm.relationshipId,
        })
        if (res.data.code == 200) {
          ElMessage({
              message: "添加成功",
              duration: 1500,
              type: "success",
          });
          getDirectoryList();
          entryWords.value = '';
          addForm.entryName = '';
          addForm.entryText = '';
          addForm.parentId = '';
          addForm.relationshipId = '';
        } else {
            ElMessage.error(res.data.msg)
        }
    }catch(e){console.log('e',e);}
}

//路由参数
const RESROUTER = router.currentRoute.value.query as any;
onMounted (async() => {
    await getDirectoryListByBookId();
    await getTaskChapter(baseInfoDirectoryData.value[0].id)
    await getDirectoryList();
    await getRelationshipList();
})
</script>

<style lang="scss" scoped>
.el-row {

}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
}
/* :deep(.el-scrollbar){
    margin-top: 30px;
    height: 100%;
} */

#force-container {
  border: 1px solid #ccc;
}

</style>