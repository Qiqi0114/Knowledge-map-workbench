<template>
    <el-row>
        <el-col :span="12" >
            <div class="grid-content">
                <el-button type="primary" style="float: left;" @click="drawer = true">章节</el-button>
                <div>{{ baseInfoDirectoryName }}</div>
            </div>
            <el-scrollbar :height="scrollbarHeight">
                <div id="directoryText"></div>
            </el-scrollbar>
        </el-col>
        <el-col :span="12">
            
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
</template>

<script lang="ts" setup>
import { ElMessageBox } from "element-plus";
import { onMounted, ref } from "vue-demi";
import { getDirectoryListByBookIdAPI, getTaskChapterAPI } from "../../api/bookLabel";
import router from "../../router";
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
    try{
        const res = await getTaskChapterAPI({
            id:id,
            background:'',
        })
        baseInfoBoolData.value = res.data.data;  
        const directoryTextSpan = document.getElementById('directoryText')
        directoryTextSpan.innerHTML = res.data.data.chapterText;
    }catch(e){console.log('e',e);}
}
//路由参数
const RESROUTER = router.currentRoute.value.query as any;
onMounted (() => {
    getDirectoryListByBookId();
})
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
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
:deep(.el-scrollbar){
    margin-top: 30px;
    height: 100%;
}
</style>