<template>
   <el-row>
    <el-col
      v-for="(o, index) in baseInfoCardData "
      :key="o"
      :span="4"
      :offset="index > -1 ? 2 : 0"
    >
      <el-card :body-style="{ padding: '0px' }">
        <img
          src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          class="image"
        />
        <div style="padding: 7px">
          <span>{{ o.bookName }}</span>
        </div>
        <div>
            <div class="bottom">
            <el-button type="primary" class="button" @click="goToBookLabel(o.id)">标注</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
                  <!--分页器 start-->
                  <div class="pagination-bg">
                    <el-pagination v-model:currentPage="pCurrentPage" v-model:page-size="pPageSize"
                        :page-sizes="[10, 20]" :small="pSmall" :disabled="pDisabled" :background="pBackground"
                        layout="total, sizes, prev, pager, next, jumper" :total="pTotal" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
                <!--分页器 end-->
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getTaskBookListAPI } from '../../api/bookLabel';
import router from '../../router';
//card赋值
const baseInfoCardData = ref([]);
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
    getTaskBookList();
};
const handleCurrentChange = (val: number) => {
    pCurrentPage.value = val;
    getTaskBookList();
};
//跳转书籍标记页面
const goToBookLabel = async(id:string) => {
  router.push({ path: "/home/bookLabel", query: {id:id} })
}
//获取任务列表
const getTaskBookList = async() => {
    try{
        const res = await getTaskBookListAPI({
            bookName:'',
            pageNum:pCurrentPage.value,
            pageSize:pPageSize.value,
        })
        baseInfoCardData.value = res.data.data.records;
        console.log(baseInfoCardData.value);
        
    }catch(e){console.log('e',e);}
}
onMounted(() => {
    getTaskBookList()
})
</script>

<style lang="scss" scoped>

.bottom {
  margin: 5px;
  line-height: 12px;
  display: flex;
  float: right;
  justify-content: space-between;
  align-items: center;
}

.button {
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}
.pagination-bg{
    float: right;
    padding: 20px;
}
</style>