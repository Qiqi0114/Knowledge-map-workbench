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
                      :height="200" @mouseover="mouseOverTable()" @row-click="getKnowledgeNode">
                      <el-table-column fixed="left" label="操作" min-width="80">
                          <template #default="scope">
                              <el-button type="danger" link @click="delKnowledgeNode(scope.row.id)">删除</el-button>
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
                    <el-col :span="12" v-if="nodeNameFlag">
                      <el-form-item label="节点名称">
                            <el-input v-model="addForm.parentName" :disabled="true" style="width:250px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="关系" prop="relationshipId">
                        <el-select v-model="addForm.relationshipId"
                                  filterable  placeholder="请选择关系" :disabled = "relationFlag" style="width:90%" clearable>
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

          <!--修改节点对话框-->
          <el-dialog title="修改节点" v-model="dialogEditFormVisible">
                <el-form :model="editForm">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="父id">
                            <el-input v-model="editForm.nodeId" :disabled="true" style="width:250px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="节点名称">
                            <el-input v-model="editForm.nodeName" style="width:250px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="关系" prop="relationshipId">
                        <el-select v-model="editForm.relationshipId"
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
                    <el-button @click="editNodeCancel()">取 消</el-button>
                    <el-button type="primary" @click="editNodeConfirm()"
                        >确 定</el-button
                    >
                    </span>
                </template>
            </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { onMounted, reactive, Ref, ref } from "vue-demi";
import { Expand,Fold } from '@element-plus/icons-vue'
import * as d3 from 'd3'
import { getDeleteNodeByIdAPI, getDirectoryListAPI, getDirectoryListByBookIdAPI, getKnowledgeNodeAPI, getRelationshipAPI, getTaskChapterAPI, saveEntryMapperAPI, uplateNodeNameAPI } from "../../api/bookLabel";
import router from "../../router";
var color=d3.schemeCategory10;
var nodes = [];
var links = [];

onMounted(async() => {
 /* await drawBarChart(nodes,links); */
})

const entryId = ref<string>('')
//单词条图谱可视化接口
const getKnowledgeNode = async(row) =>{
  entryId.value = row.id;
  await getKnowledgeNodes()
}
//单词条图谱可视化接口
const getKnowledgeNodes = async() =>{
    try{
        nodes = [];
        links = [];
        const res = await getKnowledgeNodeAPI({
          id:entryId.value,
        })
        nodes = res.data.data.nodes;
        links = res.data.data.links;
        //清空上一个图谱
        var elem = document.getElementById('force-container')
        // 获取 force-container 标签下的所有子节点
        var pObjs = elem.childNodes;
        for (var i = pObjs.length - 1; i >= 0; i--) { // 一定要倒序，正序是删不干净的，可自行尝试
          elem.removeChild(pObjs[i]);
        }
        await drawBarChart(nodes,links);
    }catch(e){console.log('e',e);}
}
//
const visibleFlag = ref<boolean>(false);
const drawBarChart = async(nodes: { id: string; name: string; }[],links: { source: number; target: number; relation: string; }[]) => {
            var w=window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
            var h=window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
            w=w*0.48;
            h=h*0.37;
            // 容器
            var svg=d3.select("#force-container")
                        .append("svg")
                        .attr("width",w)
                        .attr("height",h*1.2);

            // 新建一个力导向图
            var forceSimulation = d3.forceSimulation()
                                    // 连接线
                                    .force("link",d3.forceLink().id(d => d.id))
                                    // 引力
                                    .force("charge",d3.forceManyBody().strength(-200))
                                    // 整个实例中心
                                    .force("center",d3.forceCenter(w/2,h/2))
                                    forceSimulation.alpha(1).restart()
            // 为节点分配坐标
            forceSimulation.nodes(nodes)
                           .on("tick");
            // 连接线
            forceSimulation.force("link")
                           .links(links)
                           .distance(100);
            
/*         // 新建一个力导向图
       const simulation = d3.forceSimulation()
                            .force('charge', d3.forceManyBody().strength(-200))
                            .force('link', d3.forceLink())
                            .force('x', d3.forceX())
                            .force('y', d3.forceY())
                            // 整个实例中心
                            .force("center",d3.forceCenter(w/2,h/2))
                            .on('tick', ticked)
                    // 为节点分配坐标
                    simulation.nodes(nodes)
                                  .on("tick");
                    // 连接线
                    simulation.force("link")
                                  .links(links)
                                  .distance(100) */

/*             // 关系路径
            var link=svg.selectAll("link")
                        .data(links)
                        .enter()
                        .append("line")
                        .attr("class","link")
                        .style("stroke-width",1)
                        .style("stroke",(links: { relation: string; })=>{if(links.relation === '单向'){return "#f80000"} else if(links.relation === '双向'){return "#6c64ff" }else if(links.relation === '包含'){return "#00f811"} else if(links.relation === '反向'){return "#f8f400"}})
					    .style("opacity",0.6)
      //添加描述文字
            var edges_text = svg.selectAll(".linetext")
							.data(links)
							.enter()
							.append("text")
							.attr("class","linetext")
							.text((d: { relation: any; })=> d.relation)
							.style("stroke",(links: { relation: string; })=>{if(links.relation === '单向'){return "#f80000"} else if(links.relation === '双向'){return "#6c64ff" }else if(links.relation === '包含'){return "#00f811"} else if(links.relation === '反向'){return "#f8f400"}})
							.style("font-size",10);	  */ 
       
/*             var texts=svg.selectAll(".forceText")
                        .data(nodes)
                        .enter()
                        .append("text")
                        .attr("class","forceText")
                        .style("stroke",(d: any,i: number)=>color[i%10])
                        .style("font-size","12px")
                        .attr("text-anchor","middle")
                        .attr("dy",30)
                        .text((d: { name: any; })=>d.name); */
            // 节点
/*             var node=svg.append('g')
                        .attr('class', 'node-container')
                        .selectAll('circle')
                        .data(nodes, (d: { name: any; }) => d.name)
                        .enter()
                        .append("circle")
                        .attr("r",15)
                        .style("fill",(d: any,i: number)=>color[i%10])
                        .call(drag()); //使得节点能够拖动
                        node.data(nodes, (d: { name: any; }) => d.name)
                            .join(
                              (enter: { append: (arg0: string) => { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; attr: { (arg0: string, arg1: (d: any) => string): any; new(): any; }; }; new(): any; }; }; }) =>
                                enter.append('g')
                                  .attr('class', 'single-node')
                                  .attr('id', (d) => {
                                    return 'single-node' + d.id
                                  })
                            )
                            .on('click',  (d) => {
                              visibleFlag.value = visibleFlag.value
                              console.log(d)
                              
                              toggleMenu(d3.select('circle'), d.target.__data__, visibleFlag)
                            }) */
                         // 关系路径
                         let link = svg.append('g')
                          .attr('class', 'link-container')
                          .attr('stroke', '#000')
                          .attr('stroke-width', 1)
                          .selectAll('line')

                        // 关系文字
                        let linkText = svg.append('g')
                          .attr('class', 'link-text-container')
                          .attr('stroke', '#000')
                          .attr('stroke-width', 1.5)
                          .selectAll('text')    
                        // 节点
                        let node = svg.append('g')
                          .attr('class', 'node-container')
                          .selectAll('circle')
                          .call(drag()); //使得节点能够拖动
                        // 节点
                        node = node
                          .data(nodes, (d: { id: any; }) => d.id)
                          .join(
                            ( enter: { append: (arg0: string) => { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; attr: { (arg0: string, arg1: (d: any) => string): any; new(): any; }; }; new(): any; }; }; }) =>
                              enter.append('g')
                                .attr('class', 'single-node')
                                .attr('id', (d: { id: string; }) => {
                                  return 'single-node' + d.id
                                })
                          )
                          .call(drag()); //使得节点能够拖动
/*               function ticked () {
                  node
                    .attr('transform', function (d: { x: string; y: string; }) {
                      return 'translate(' + d.x + ',' + d.y + ')'
                    })
                                        //更新节点坐标
                node.attr("cx",(d: { x: any; })=>d.x)
                    .attr("cy",(d: { y: any; })=>d.y);

                  link.attr('x1', (d: { source: { x: any; }; }) => d.source.x)
                    .attr('y1', (d: { source: { y: any; }; }) => d.source.y)
                    .attr('x2', (d: { target: { x: any; }; }) => d.target.x)
                    .attr('y2', (d: { target: { y: any; }; }) => d.target.y)

                  linkText
                    .attr('x', (d: { source: { x: any; }; target: { x: any; }; }) => (d.source.x + d.target.x) / 2)
                    .attr('y', (d: { source: { y: any; }; target: { y: any; }; }) => (d.source.y + d.target.y) / 2)
              }
 */

                        d3.selectAll('.single-node')
                          .append('circle')
                          .attr('r', 30)
                          .attr('fill', '#999')
                          .style('cursor', 'pointer')
                        // 节点文字
                        d3.selectAll('.single-node')
                          .append('text')
                          .attr('y', 0)
                          .attr('dy', 5)
                          .attr('text-anchor', 'middle')
                          .style('cursor', 'pointer')
                          .attr('x', function (d: any) {
                            d3.select(this).append('tspan')
                                .attr('x', 0)
                                .attr('y', 0)
                                .style('font-size', 12)
                                .style('stroke', '#333')
                                .text(d.name)
                            /* return textBreaking(d3.select(this), d, false) */
                          })
/*                             // 绘制箭头
                            svg.append('g')
                            .attr('class', 'arrow-marker')
                            .append('marker')
                            .attr('id', 'arrow-marker')
                            .attr('markerUnits', 'strokeWidth') // 设置为 strokeWidth 箭头会随着线的粗细发生变化
                            .attr('markerUnits', 'userSpaceOnUse')
                            .attr('viewBox', '0 -5 10 10') // 坐标系的区域
                            .attr('refX', 40) // 箭头坐标
                            .attr('refY', 0)
                            .attr('markerWidth', 10) // 标识的大小
                            .attr('markerHeight', 10)
                            .attr('orient', 'auto') // 绘制方向，可设定为：auto（自动确认方向）和 角度值
                            .attr('stroke-width', 2) // 箭头宽度
                            .append('path')
                            .attr('d', 'M0,-5L10,0L0,5') // 箭头的路径
                            .attr('fill', '#000') // 箭头颜色 */
                            // 关系路径
                            link = link
                              .data(links, (d: { source: any; target: any; }) => [d.source, d.target])
                              .join(
                                ( enter: { append: (arg0: string) => { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; attr: { (arg0: string, arg1: (d: any) => string): { (): any; new(): any; attr: { (arg0: string, arg1: string): any; new(): any; }; }; new(): any; }; }; new(): any; }; }; }) =>
                                  enter.append('line')
                                    .attr('class', 'single-line')
                                    .attr('id', (d) => {
                                      return 'single-line'+ d.id
                                    })
                                    .attr('marker-end', 'url(#arrow-marker)') // 根据箭头标记的 id 号标记箭头
                              )

                            // 路径文字
                            linkText = linkText
                              .data(links, (d: { source: any; target: any; }) => [d.source, d.target])
                              .join(
                                ( enter: { append: (arg0: string) => { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; attr: { (arg0: string, arg1: (d: any) => string): { (): any; new(): any; text: { (arg0: (d: any) => any): { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; style: { (arg0: string, arg1: string): any; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; }) =>
                                  enter.append('text')
                                    .attr('class', 'link-text')
                                    .attr('id', (d: { id: string; }) => {
                                      return 'link-text' + d.id
                                    })
                                    .text((d: { relation: any; }) => {
                                      return d.relation
                                    })
                                    .attr('stroke', '#000')
                                    .attr('stroke-width', '1')
                                    .attr('fill', 'none')
                                    .style('cursor', 'pointer')
                              )
                              /* forceSimulation.alpha(1).restart() */
                      node
                        .on('click',  (d: { target: { __data__: any; }; }) => {
                           visibleFlag.value = !visibleFlag.value
                           console.log(d)
                         toggleMenu(d3.select('#single-node'+d.target.__data__.id), d.target.__data__, visibleFlag)
                        })
                        .on('mouseover', function (d) {
                          if(entryWords.value !== '' ){
                            //添加弹窗显示
                            dialogAddFormVisible.value = true;
                            //节点名称显示
                            nodeNameFlag.value = true;
                            entryTextFlag.value = false;
                            relationFlag.value = false;
                            //表单 赋值 书籍id 解释
                            addForm.entryName = entryWords.value;
                            addForm.bookId = RESROUTER.id;
                            //表单赋值 父id 名称
                            addForm.parentName = d.target.__data__.name;
                            addForm.parentId = d.target.__data__.id;
                          }
                        })

            //更新
            forceSimulation.on("tick",()=>{//对于每一个时间间隔
              //更新连线坐标
                link.attr("x1",(d: { source: { x: any; }; })=>d.source.x)
                    .attr("y1",(d: { source: { y: any; }; })=>d.source.y)
                    .attr("x2",(d: { target: { x: any; }; })=>d.target.x)
                    .attr("y2",(d: { target: { y: any; }; })=>d.target.y);
                    //更新节点坐标
                    node
                    .attr('transform', function (d: { x: string; y: string; }) {
                      return 'translate(' + d.x + ',' + d.y + ')'
                    })
                    //更新文字坐标
                    linkText.attr("x",(d: { source: { x: any; }; target: { x: any; }; })=>(d.source.x + d.target.x) / 2 )
                          .attr("y",(d: { source: { y: any; }; target: { y: any; }; })=>(d.source.y + d.target.y) / 2 );
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
      /**
       * @name: 节点文字换行
       * @param {*} dom
       * @param {*} data
       * @param {*} breaking 是否换行
       */
       const textBreaking = (dom: { append: (arg0: string) => { (): any; new(): any; attr: { (arg0: string, arg1: number): { (): any; new(): any; attr: { (arg0: string, arg1: number): { (): any; new(): any; text: { (arg0: { (): any; (): any; (): any; }): void; new(): any; }; style: { (arg0: string, arg1: number): { (): any; new(): any; style: { (arg0: string, arg1: string): { (): any; new(): any; text: { (arg0: any): void; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; text: (arg0: string) => void; }, data: { name: any; }, breaking: boolean) => {
        const text = data.name
        if (breaking) {
          const len = text.length
          if (len <= 3) {
            dom.append('tspan')
              .attr('x', 0)
              .attr('y', 0)
              .text(text)
          } else {
            const topText = text.substring(0, 3)
            const midText = text.substring(3, 7)
            let botText = text.substring(7, len)
            let topY = -22
            let midY = 8
            const botY = 34
            if (len <= 9) {
              topY += 10
              midY += 10
            } else {
              botText = text.substring(7, 9) + '...'
            }
            dom.text('')
            dom.append('tspan')
              .attr('x', 0)
              .attr('y', topY)
              .text(function () {
                return topText
              })
            dom.append('tspan')
              .attr('x', 0)
              .attr('y', midY)
              .text(function () {
                return midText
              })
            dom.append('tspan')
              .attr('x', 0)
              .attr('y', botY - 7)
              .text(function () {
                return botText
              })
          }
        } else {
          dom.append('tspan')
            .attr('x', 0)
            .attr('y', 0)
            .style('font-size', 12)
            .style('stroke', '#333')
            .text(data.name)
        }
      }
      /**
       * @name: 生成操作菜单
       * @param {*} current 当前元素
       * @param {*} d 当前元素对应的数据
       * @param {*} visibleFlag 显隐
       */
const toggleMenu = (current: { append: (arg0: string) => { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; attr: { (arg0: string, arg1: number): { (): any; new(): any; attr: { (arg0: string, arg1: number): any; new(): any; }; }; new(): any; }; }; new(): any; }; }; select: (arg0: string) => { (): any; new(): any; append: { (arg0: string): { (): any; new(): any; classed: { (arg0: string, arg1: boolean): any; new(): any; }; }; new(): any; }; }; }, d: any, visibleFlag: Ref<boolean>) => {
        const currentD = d
        let nodeId = d.id;
        let nodeName = d.name;
        const datas = [{
          population: 30,
          value: '删除',
          type: 'delete'
        }, {
          population: 30,
          value: '修改',
          type: 'showOn'
        }, {
          population: 30,
          value: '展开',
          type: 'showOff'
        }]
        // 创建一个环生成器
        const arc = d3.arc()
          .innerRadius(70) // 内半径
          .outerRadius(35) // 外半径
        const pie = d3.pie()
          .value(function (d: { population: any; }) {
            return d.population
          })
          .sort(null)
        const pieData = pie(datas)
        const pieAngle = pieData.map((p: { startAngle: any; endAngle: any; }) =>{
          return (p.startAngle + p.endAngle) / 2 / Math.PI * 180
        })
        // 菜单容器
        const g = current
          .append('g')
          .attr('class', 'menu-circle')
          .attr('width', 100)
          .attr('height', 100)
        const Pie = g.append('g')
        Pie.selectAll('path')
          .data(pie(datas))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', '#d3d7dc')
          .style('stroke', '#fff')
          .style('cursor', 'pointer')
          .on('click', function (d: { target: { __data__: { data: { value: string; }; }; }; }) {
            if (d.target.__data__.data.value ==='删除') {
              delKnowledgeNode(nodeId)
            } else if (d.target.__data__.data.value ==='修改') {
              editNode(nodeId,nodeName);
            } else {
            }
            d3.event.stopPropagation()
          })

        // 安妮文字
        const labelFontSize = 12
        const labelValRadius = (170 * 0.35 - labelFontSize * 0.35)
        const labelValRadius1 = (170 * 0.35 + labelFontSize * 0.35)
        const labelsVals = current
          .select('.menu-circle')
          .append('circle')
          .classed('labelsvals', true)
        // 定义两条路径以使标签的方向正确
        labelsVals.append('def')
          .append('path')
          .attr('id', 'label-path-1')
          .attr('d', `m0 ${-labelValRadius} a${labelValRadius} ${labelValRadius} 0 1,1 -0.01 0`)
        labelsVals.append('def')
          .append('path')
          .attr('id', 'label-path-2')
          .attr('d', `m0 ${-labelValRadius1} a${labelValRadius1} ${labelValRadius1} 0 1,0 0.01 0`)
        labelsVals.selectAll('text')
          .data(datas)
          .enter()
          .append('text')
          .attr('dy', function (d: { type: string; }) {
            if (d.type === 'showOn') {
              return -5
            } else {
              return 5
            }
          })
          .style('font-size', labelFontSize)
          .style('fill', 'black')
          .style('font-weight', 'bold')
          .style('text-anchor', 'middle')
          .append('textPath')
          .style('cursor', 'pointer')
          .attr('href', function (d: any, i: string|number) {
            const angle = pieAngle[i]
            if (angle > 90 && angle <= 270) { // 根据角度选择路径
              return '#label-path-2'
            } else {
              return '#label-path-1'
            }
          })
          .attr('startOffset', function (d: any, i: string|number) {
            const p = pieData[i]
            const angle = pieAngle[i]
            const percent = (p.startAngle + p.endAngle) / 2 / 2 / Math.PI * 100
            if (angle > 90 && angle <= 270) { // 分别计算每条路径的正确百分比
              return 100 - percent + '%'
            }
            return percent + '%'
          })
          .text(function (d: { value: any; }) {
            return d.value
          })
          .on('click', function (d: { target: { __data__: { data: { value: string; }; }; }; }) {
            if (d.target.__data__.data.value ==='删除') {
              console.log('1111')
              
            } else if (d.target.__data__.data.value ==='修改') {
              console.log('1111')
            }
            d3.event.stopPropagation()
          }, true)
        if (!visibleFlag.value) {
          d3.selectAll('.menu-circle').remove()
        } 
      }
            /**
       * @name: 设置节点颜色
       * @param {*} node
       */
const nodeColor = (node: { semantic_type: any; }) => {
        const type = node.semantic_type
        if (typeColor[type]) {
          return typeColor[type]
        } else {
          return '#ddd'
        }
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
}
//词条解释禁用标记
const entryTextFlag = ref<boolean>(false);
//关系禁用标记
const relationFlag = ref<boolean>(false);
//父id、关系id禁用标记
const nodeFlag = ref<boolean>(false);
//父节点名称
const nodeNameFlag = ref<boolean>(false);
//鼠标移入词条表格触发的事件
const mouseOverTable = () =>{
  if(entryWords.value !== '' ){
    addForm.entryName = entryWords.value;
    addForm.bookId = RESROUTER.id;
    entryTextFlag.value = true;
    relationFlag.value = true;
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
    parentName:'',
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
    relationFlag.value = true;
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
  relationFlag.value = false;
  nodeNameFlag.value = false;
  entryWords.value = '';
  addForm.entryName = '';
  addForm.entryText = '';
  addForm.parentId = '';
  addForm.parentName = '';
  addForm.relationshipId = '';
}

 //修改节点对话框开关
 const dialogEditFormVisible = ref<boolean>(false);
  const editForm = reactive({
    nodeId:'',
    nodeName:'',
    relationshipId:'',
  });

  //修改节点标注
  const editNode = async(id:string,name:string) => {
    editForm.nodeId=id;
    editForm.nodeName=name;
    editForm.relationshipId='';
    dialogEditFormVisible.value = true;
  }
  //确认修改节点
  const editNodeConfirm = async() => {
    await uplateNodeName();
    dialogEditFormVisible.value = false;
  }
//取消确认修改节点
const editNodeCancel = async() =>{
  dialogEditFormVisible.value = false;
  editForm.nodeId='';
  editForm.nodeName='';
  editForm.relationshipId='';
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
          getKnowledgeNodes();
          entryWords.value = '';
          addForm.entryName = '';
          addForm.entryText = '';
          addForm.parentId = '';
          addForm.relationshipId = '';
          addForm.parentName = '';
          entryTextFlag.value = false;
          relationFlag.value = false;
          nodeNameFlag.value = false;
        } else {
            ElMessage.error(res.data.msg)
        }
    }catch(e){console.log('e',e);}
}

//词条删除
const delKnowledgeNode = async(id:string) => {
  ElMessageBox.confirm("确认删除?", {
  confirmButtonText: "是",
  cancelButtonText: "否",
  type: "warning",
})
  .then(async () => {
      //删除的过渡效果
      loading.value = true;
      const res = await getDeleteNodeByIdAPI({id:id});
      if (res.data.code == 200) {
          ElMessage({
              message: "删除成功",
              duration: 1500,
              type: "success",
          });
          getKnowledgeNodes();
      } else {
          ElMessage.error(res.data.msg)
      }
      loading.value = false;
  })
  .catch(() => {console.log('error');});
}
//修改节点
const uplateNodeName = async() =>{
    try{
        const res = await uplateNodeNameAPI({
            id:editForm.nodeId,
            name:editForm.nodeName,
        })
        if (res.data.code == 200) {
          ElMessage({
              message: "修改成功",
              duration: 1500,
              type: "success",
          });
          getKnowledgeNodes();
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