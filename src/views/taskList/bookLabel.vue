<template>
    <el-row>
        <el-col :span="12" >
            <div class="grid-content">
                <el-icon v-if="drawer" :size="30" style="float: left;padding: 15px;" @click="drawer = true"><Expand /></el-icon>
                <el-icon v-if="!drawer" :size="30" style="float: left;padding: 15px;" @click="drawer = true"><Fold /></el-icon>
                <div>{{ baseInfoDirectoryName }}</div>
            </div>
            <el-scrollbar :height="scrollbarHeight" style="margin-top: 30px;">
                <div
                 v-loading="bookLoading"
                 element-loading-text="七七拼命加载"
                :element-loading-spinner="svg"
                element-loading-svg-view-box="-10, -10, 50, 50"
                element-loading-background="rgba(122, 122, 122, 0.8)"
                ><div id="directoryText"></div></div>
            </el-scrollbar>
        </el-col>
        <el-col :span="12">
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
            <el-row>
              <!-- 表格部分 -->
              <div ref="tableContainer" style="width: 100%;margin-top: 5px;">
                  <el-table :data="baseInfoTableData" border
                      ref="baseInfoTableDataRef" v-loading="loading" :header-cell-style="{ background: '#F5F6FA' }"
                      :height="200">
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
            <el-row>
              
            </el-row>
        </el-col>
    </el-row>
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
                        <el-input v-model="addForm.entryText" style="width:250px"></el-input>
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
                    <el-button @click="dialogAddFormVisible = false">取 消</el-button>
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
import { getDirectoryListAPI, getDirectoryListByBookIdAPI, getRelationshipAPI, getTaskChapterAPI, saveEntryMapperAPI } from "../../api/bookLabel";
import router from "../../router";
//文章加载
const bookLoading = ref<boolean>(false)
  const svg =ref(`
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
    dialogAddFormVisible.value = true;
    addForm.bookId = RESROUTER.id;
    await getRelationshipList();
  }
  //确认词条标注
  const addEntryConfirm = async() => {
    await saveEntryMapper();
    dialogAddFormVisible.value = false;
    await getDirectoryList();
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
</style>